<script lang="ts">
  import { form } from '../../lib/form.svelte'
  import { t, type MessageKey } from '../../lib/i18n.svelte'
  import { cleaningTypes, frequencies, labelOf, timeSlots } from '../../lib/options'

  let {
    agreed = $bindable(false),
    agreeError = false,
    onedit,
  }: {
    agreed?: boolean
    agreeError?: boolean
    onedit: (step: number) => void
  } = $props()

  type Row = [MessageKey, string]

  const sections = $derived.by(() => {
    const contact: Row[] = [
      ['name', form.name],
      ['company', form.company],
      ['email', form.email],
      ['phone', form.phone],
    ]
    const property: Row[] = [
      ['propertyName', form.propertyName],
      ['address', form.address],
      ['layout', form.layout],
      ['access', form.accessMethod],
    ]
    const cleaning: Row[] = [
      ['cleaningTypes', form.cleaningTypes.map((v) => labelOf(cleaningTypes, v)).join('、')],
      ['date', formatDate(form.date)],
      ['timeSlot', labelOf(timeSlots, form.timeSlot)],
      ['frequency', labelOf(frequencies, form.frequency)],
      ['notes', form.notes],
    ]
    return [
      { title: 'stepContact' as MessageKey, step: 0, rows: contact },
      { title: 'stepProperty' as MessageKey, step: 1, rows: property },
      { title: 'stepCleaning' as MessageKey, step: 2, rows: cleaning },
    ]
  })

  /** "2026-11-15" -> "2026年11月15日(日)" */
  function formatDate(iso: string) {
    if (!iso) return ''
    const d = new Date(`${iso}T00:00:00`)
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
  }
</script>

<div class="space-y-5">
  <p class="text-stone-600">{t('confirmLead')}</p>

  {#each sections as section}
    <section class="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div class="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2.5">
        <h3 class="font-bold text-stone-700">{t(section.title)}</h3>
        <button type="button" onclick={() => onedit(section.step)}
          class="rounded-lg px-2 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50">
          {t('edit')}
        </button>
      </div>
      <dl class="divide-y divide-stone-100">
        {#each section.rows as [key, value]}
          <div class="grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-3 text-sm">
            <dt class="text-stone-500">{t(key)}</dt>
            <dd class="break-words whitespace-pre-wrap text-stone-900">{value || '—'}</dd>
          </div>
        {/each}
      </dl>
    </section>
  {/each}

  <div id="agree" class="rounded-2xl border p-4 {agreeError ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'}">
    <p class="mb-3 text-sm text-stone-600">{t('privacy')}</p>
    <label class="flex cursor-pointer items-center gap-3 font-medium">
      <input type="checkbox" bind:checked={agreed} class="h-5 w-5 rounded accent-brand-600" />
      {t('privacyAgree')}
    </label>
    {#if agreeError}
      <p class="mt-2 text-sm text-red-600" role="alert">{t('errAgree')}</p>
    {/if}
  </div>
</div>
