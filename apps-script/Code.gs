/**
 * BigSpace Clean — cleaning request backend
 */

const SHEET_NAME = '依頼一覧';
const TZ = 'Asia/Tokyo';
const ID_PREFIX = 'BSC';
const STATUS_OPTIONS = ['未対応', '対応中', '完了'];

const SHEET_HEADERS = [
  '受付日時', '受付番号', 'ステータス', '担当者',
  'お名前', '会社名', 'メール', '電話番号',
  '物件名', '住所', '間取り', '入室方法',
  'ご希望のサービス', '希望日', '希望時間帯', '頻度',
  'ご要望・備考',
];
// (1 = column A)
const COL_POS = {
  timestamp: 1, id: 2, status: 3,
  phone: 8, layout: 11, date: 14,
};

// Keep in sync with frontend/src/lib/options.ts.
const OPTIONS = {
  cleaningTypes: {
    turnover: 'チェックアウト清掃',
    linen: 'リネン・アメニティ交換',
    other: 'その他',
  },
  timeSlot: {
    morning: '午前 (9:00〜12:00)',
    afternoon: '午後 (12:00〜15:00)',
    evening: '夕方 (15:00〜18:00)',
    any: '指定なし',
  },
  frequency: {
    once: '1回のみ',
    weekly: '毎週',
    monthly: '毎月',
  },
};

/* ------------------------------------------------------------------ */
/* HTTP Method handlers                                               */
/* ------------------------------------------------------------------ */

// To check the deployment.
function doGet() {
  return json({ ok: true, message: 'BigSpace Clean endpoint is running.' });
}

// Receives a JSON as text/plain from the form.
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'Invalid request' });
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ ok: false, error: 'Invalid request' });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, save nothing.
  if (data.website) {
    const n = Math.floor(Math.random() * 10000);
    const requestId = ID_PREFIX + '-' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd') + '-' + String(n).padStart(4, '0');
    return json({ ok: true, requestId });
  }

  // Guarantees unique IDs and one write at a time.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: 'Server busy' });
  }

  try {
    const sheet = getSheet();
    const requestId = nextRequestId(sheet);
    sheet.appendRow(toRow(requestId, data));
    SpreadsheetApp.flush();
    return json({ ok: true, requestId: requestId });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Server error' });
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */
/* Setup (run once from the editor)                                    */
/* ------------------------------------------------------------------ */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME, 0);

  // Header row
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length)
    .setValues([SHEET_HEADERS])
    .setFontWeight('bold')
    .setBackground('#1f3a68')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  const maxRows = sheet.getMaxRows() - 1;
  function getColumnRange(column) {
    return sheet.getRange(2, column, maxRows, 1);
  }

  // ステータス dropdown (未対応 / 対応中 / 完了)
  const statusRange = getColumnRange(COL_POS.status);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build()
  );

  // Color for easy reading.
  const colors = { '未対応': '#fde2e1', '対応中': '#fff4cc', '完了': '#dff3e4' };
  const rules = sheet.getConditionalFormatRules().filter(function (r) {
    return !r.getRanges().some(function (rg) { return rg.getColumn() === COL_POS.status; });
  });
  Object.keys(colors).forEach(function (label) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(label)
      .setBackground(colors[label])
      .setRanges([statusRange])
      .build());
  });
  sheet.setConditionalFormatRules(rules);

  // Phone numbers and layouts as text, and format the dates
  getColumnRange(COL_POS.phone).setNumberFormat('@');
  getColumnRange(COL_POS.layout).setNumberFormat('@');
  getColumnRange(COL_POS.timestamp).setNumberFormat('yyyy/mm/dd hh:mm');
  getColumnRange(COL_POS.date).setNumberFormat('yyyy/mm/dd (ddd)');

  sheet.setColumnWidth(COL_POS.timestamp, 140);
  sheet.setColumnWidth(COL_POS.id, 150);
  sheet.setColumnWidths(5, SHEET_HEADERS.length - 4, 140);

  // Delete empty default sheets
  ['Sheet1', 'シート1'].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  console.log('Setup complete.');
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found. Run setup() first.');
  return sheet;
}

// BSC-YYYYMMDD-NNNN: NNNN = today's requests count.
function nextRequestId(sheet) {
  const prefix = ID_PREFIX + '-' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd') + '-';
  const lastRow = sheet.getLastRow();
  let max = 0;
  if (lastRow >= 2) {
    const ids = sheet.getRange(2, COL_POS.id, lastRow - 1, 1).getValues();
    ids.forEach(function (row) {
      const id = String(row[0]);
      if (id.indexOf(prefix) === 0) max = Math.max(max, parseInt(id.slice(prefix.length), 10) || 0);
    });
  }
  return prefix + String(max + 1).padStart(4, '0');
}

// One sheet row, in the same order as SHEET_HEADERS.
function toRow(requestId, d) {
  const cleaningTypes = Array.isArray(d.cleaningTypes) ? d.cleaningTypes : [];
  return [
    new Date(),
    requestId,
    '未対応',
    '', // 担当者: filled in by staff
    preventInjection(safeTrim(d.name)),
    preventInjection(safeTrim(d.company)),
    preventInjection(safeTrim(d.email)),
    preventInjection(safeTrim(d.phone)), // preventInjection needed for "+81..."
    preventInjection(safeTrim(d.propertyName)),
    preventInjection(safeTrim(d.address)),
    preventInjection(safeTrim(d.layout)),
    preventInjection(safeTrim(d.accessMethod)),
    cleaningTypes.map(function (v) { return label('cleaningTypes', v); }).join('、'),
    toDate(safeTrim(d.date)),
    label('timeSlot', d.timeSlot),
    label('frequency', d.frequency),
    preventInjection(safeTrim(d.notes)),
  ];
}

function safeTrim(v) {
  return String(v == null ? '' : v).trim();
}

// Returns the Japanese label.
function label(group, code) {
  return OPTIONS[group][code] || safeTrim(code);
}

function toDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : s;
}

// Text starting with = + - @ would run as a formula in Sheets.
function preventInjection(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

// Returns an object as a JSON response.
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run from the editor to test saving without the form.
function testDoPost() {
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const res = doPost({ postData: { contents: JSON.stringify({
    name: 'テスト 太郎', company: 'テスト株式会社',
    email: 'test@example.com', phone: '090-1234-5678',
    propertyName: '浅草テスト 101', address: '東京都台東区浅草1-1-1',
    layout: '1LDK', accessMethod: 'キーボックス（ドア横）',
    cleaningTypes: ['turnover', 'linen'],
    date: Utilities.formatDate(inThreeDays, TZ, 'yyyy-MM-dd'),
    timeSlot: 'afternoon', frequency: 'once',
    notes: 'テスト送信です', website: '',
  }) } });
  console.log(res.getContent());
}
