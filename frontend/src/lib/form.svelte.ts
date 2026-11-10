// Form state shared by all steps + validation rules.

import type { MessageKey } from './i18n.svelte'

export interface RequestForm {
  // Step 1: contact
  name: string
  company: string
  email: string
  phone: string
  // Step 2: property
  propertyName: string
  address: string
  layout: string
  accessMethod: string // free text, optional
  // Step 3: cleaning
  cleaningTypes: string[]
  date: string // yyyy-mm-dd
  timeSlot: string
  frequency: string
  notes: string
  // Spam trap: real users never see or fill this field
  website: string
}

function emptyForm(): RequestForm {
  return {
    name: '',
    company: '',
    email: '',
    phone: '',
    propertyName: '',
    address: '',
    layout: '',
    accessMethod: '',
    cleaningTypes: [],
    date: '',
    timeSlot: '',
    frequency: 'once',
    notes: '',
    website: '',
  }
}

export const form = $state<RequestForm>(emptyForm())

export function resetForm() {
  Object.assign(form, emptyForm())
}

/** Tomorrow as yyyy-mm-dd in local time (used for the date picker's min). */
export function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Digits, spaces, hyphens, parentheses and an optional leading +; 10–15 digits
const PHONE_RE = /^\+?[\d\s\-()]+$/

export type Errors = Partial<Record<keyof RequestForm, MessageKey>>

/** Returns the errors for one step. Empty object = valid. */
export function validateStep(step: number, f: RequestForm = form): Errors {
  const e: Errors = {}
  const blank = (s: string) => s.trim() === ''

  if (step === 0) {
    if (blank(f.name)) e.name = 'errRequired'
    if (blank(f.email)) e.email = 'errRequired'
    else if (!EMAIL_RE.test(f.email.trim())) e.email = 'errEmail'
    const digits = f.phone.replace(/\D/g, '')
    if (blank(f.phone)) e.phone = 'errRequired'
    else if (!PHONE_RE.test(f.phone.trim()) || digits.length < 10 || digits.length > 15)
      e.phone = 'errPhone'
  }

  if (step === 1) {
    if (blank(f.propertyName)) e.propertyName = 'errRequired'
    if (blank(f.address)) e.address = 'errRequired'
  }

  if (step === 2) {
    if (f.cleaningTypes.length === 0) e.cleaningTypes = 'errSelect'
    if (!f.date) e.date = 'errRequired'
    else if (f.date < tomorrow()) e.date = 'errDate'
    if (!f.timeSlot) e.timeSlot = 'errSelect'
    if (!f.frequency) e.frequency = 'errSelect'
  }

  return e
}
