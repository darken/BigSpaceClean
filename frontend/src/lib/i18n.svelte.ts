// UI text dictionary. Japanese only for now.

export type Lang = 'ja' | 'en'

const messages = {
  ja: {
    brand: 'BigSpace Clean',
    title: '清掃のご依頼',
    lead: '民泊・ホテル・マンションの清掃をかんたんにご依頼いただけます。所要時間は約2分です。',

    stepContact: 'お客様情報',
    stepProperty: '物件情報',
    stepCleaning: '清掃内容',
    stepConfirm: '確認',
    stepOf: 'ステップ {n} / {total}',

    required: '必須',
    optional: '任意',
    next: '次へ',
    back: '戻る',
    toConfirm: '入力内容を確認する',
    edit: '修正する',
    submit: 'この内容で依頼する',
    submitting: '送信中…',

    name: 'お名前',
    namePh: '山田 太郎',
    company: '会社名・屋号',
    companyPh: '株式会社〇〇',
    email: 'メールアドレス',
    emailPh: 'example@mail.com',
    emailHint: '受付確認メールをお送りします。',
    phone: '電話番号',
    phonePh: '090-1234-5678',

    propertyName: '物件名',
    propertyNamePh: '浅草ステイ 301号室',
    address: '住所',
    addressPh: '東京都台東区浅草1-2-3',
    layout: '間取り・部屋数',
    layoutPh: '例：1K、2LDK、客室10室',
    access: '入室方法',
    accessPh: '例：スマートロック、キーボックス（ドア横）',
    accessHint: '暗証番号はここに入力しないでください。担当者から別途確認します。',

    cleaningTypes: 'ご希望のサービス',
    cleaningTypesHint: '複数選択できます。',
    date: '希望日',
    timeSlot: '希望時間帯',
    frequency: '頻度',
    notes: 'ご要望・備考',
    notesPh: '例：チェックアウト11時、次のチェックイン15時です。',

    confirmTitle: '入力内容のご確認',
    confirmLead: '以下の内容でよろしければ「この内容で依頼する」を押してください。',
    privacy: '入力いただいた個人情報は、清掃のご依頼への対応のみに使用します。',
    privacyAgree: '個人情報の取り扱いに同意します',

    thanksTitle: 'ご依頼ありがとうございます',
    thanksLead: 'ご依頼を受け付けました。担当者より1営業日以内にご連絡いたします。',
    requestId: '受付番号',
    copy: 'コピー',
    copied: 'コピーしました',
    thanksEmail: '{email} に確認メールをお送りしました。',
    thanksNext: '今後の流れ',
    thanksStep1: '担当者が内容と日程を確認します',
    thanksStep2: 'お見積り・日程確定のご連絡',
    thanksStep3: '当日、清掃スタッフが伺います',
    newRequest: '別の依頼をする',
    demoMode: 'デモモード：データは送信されていません',

    errRequired: '入力してください',
    errSelect: '選択してください',
    errEmail: 'メールアドレスの形式が正しくありません',
    errPhone: '電話番号の形式が正しくありません',
    errDate: '明日以降の日付を選択してください',
    errSummary: '入力内容をご確認ください',
    errAgree: '同意が必要です',
    errSubmit: '送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。',
  },
  // English: not added yet (same keys as `ja`)
  en: {
  },
} as const

export type MessageKey = keyof (typeof messages)['ja']

// Current language. Always 'ja' for now; reactive so a language switch
// can be added later.
export const i18n = $state({ lang: 'ja' })

/** Returns the Japanese text for a key. Use {name} placeholders for variables. */
export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
  let text: string = messages['ja'][key]
  for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v))
  return text
}
