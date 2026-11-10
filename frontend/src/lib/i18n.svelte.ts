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

    name: 'お名前',
    namePh: '山田 太郎',
    company: '会社名・屋号',
    companyPh: '株式会社〇〇',
    email: 'メールアドレス',
    emailPh: 'example@mail.com',
    emailHint: '受付確認メールをお送りします。',
    phone: '電話番号',
    phonePh: '090-1234-5678',

    errRequired: '入力してください',
    errEmail: 'メールアドレスの形式が正しくありません',
    errPhone: '電話番号の形式が正しくありません',
    errSummary: '入力内容をご確認ください',
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
