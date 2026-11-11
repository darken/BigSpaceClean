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

/* ------------------------------------------------------------------ */
/* HTTP Method handlers                                               */
/* ------------------------------------------------------------------ */

// To check the deployment.
function doGet() {
  return json({ ok: true, message: 'BigSpace Clean endpoint is running.' });
}

// Receives a JSON as text/plain from the form.
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('Received request', data);
    return json({ ok: true, requestId: nextRequestId() });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Invalid request' });
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

function nextRequestId() {
  const ymd = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const n = Math.floor(Math.random() * 10000);
  return ID_PREFIX + '-' + ymd + '-' + String(n).padStart(4, '0');
}

// Returns an object as a JSON response.
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
