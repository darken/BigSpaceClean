// Form state shared by all steps + validation rules.

import type { MessageKey } from './i18n.svelte'

export interface RequestForm {
  // Step 1: contact
  name: string
  company: string
  email: string
  phone: string
  // Spam trap: real users never see or fill this field
  website: string
}

function emptyForm(): RequestForm {
  return {
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
  }
}

export const form = $state<RequestForm>(emptyForm())

export function resetForm() {
  Object.assign(form, emptyForm())
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

  return e
}
