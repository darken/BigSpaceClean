// Form options. The field value is send to the server

export interface Option {
  value: string
  label: string
  desc?: string
}

export const cleaningTypes: Option[] = [
  { value: 'turnover', label: 'チェックアウト清掃', desc: 'ゲストのチェックアウト後、次の宿泊に向けた清掃' },
  { value: 'linen', label: 'リネン・アメニティ交換', desc: 'シーツ・タオルの交換、アメニティの補充' },
  { value: 'other', label: 'その他', desc: '備考にご記入ください' },
]

export const timeSlots: Option[] = [
  { value: 'morning', label: '午前', desc: '9:00〜12:00' },
  { value: 'afternoon', label: '午後', desc: '12:00〜15:00' },
  { value: 'evening', label: '夕方', desc: '15:00〜18:00' },
  { value: 'any', label: '指定なし' },
]

export const frequencies: Option[] = [
  { value: 'once', label: '1回のみ' },
  { value: 'weekly', label: '毎週' },
  { value: 'monthly', label: '毎月' },
]

/** Find the label of a code (used on the review screen). */
export function labelOf(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}
