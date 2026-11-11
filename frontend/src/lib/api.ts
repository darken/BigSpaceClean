// API for sending request to the Google Apps Script backend.
//
// Because Apps Script cannot answer a CORS "preflight" (OPTIONS) request
// the data is sent as text/plain.

import type { RequestForm } from './form.svelte'

const ENDPOINT = import.meta.env.VITE_GAS_ENDPOINT as string | undefined

export const isDemoMode = !ENDPOINT

export interface SubmitResult {
  ok: boolean
  requestId?: string
  error?: string
}

export async function submitRequest(data: RequestForm): Promise<SubmitResult> {
  if (!ENDPOINT) {
    console.warn('[demo mode] VITE_GAS_ENDPOINT is not set. Payload:', data)
    await new Promise((r) => setTimeout(r, 800))
    const d = new Date()
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    return { ok: true, requestId: `BSC-${ymd}-0001` }
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as SubmitResult
}
