<script lang="ts">
  import { t } from '../../lib/i18n.svelte'

  let {
    requestId,
    email,
    demo = false,
    onnew,
  }: { requestId: string; email: string; demo?: boolean; onnew: () => void } = $props()

  let copied = $state(false)

  async function copyId() {
    try {
      await navigator.clipboard.writeText(requestId)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch {
      /* ignore */
    }
  }

  const nextSteps = ['thanksStep1', 'thanksStep2', 'thanksStep3'] as const
</script>

<div class="text-center">
  <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
    <svg viewBox="0 0 24 24" class="h-8 w-8 fill-none stroke-brand-600 stroke-[2.5]" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19.5 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
  <h2 class="text-2xl font-bold text-stone-900">{t('thanksTitle')}</h2>
  <p class="mt-2 text-stone-600">{t('thanksLead')}</p>

  <div class="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
    <p class="text-sm text-brand-700">{t('requestId')}</p>
    <div class="mt-1 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
      <span class="font-mono text-xl font-bold tracking-wide whitespace-nowrap text-brand-800">{requestId}</span>
      <button type="button" onclick={copyId}
        class="rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-xs font-medium text-brand-700">
        {copied ? t('copied') : t('copy')}
      </button>
    </div>
  </div>

  <p class="mt-4 text-sm text-stone-500">{t('thanksEmail', { email })}</p>
  {#if demo}
    <p class="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
      {t('demoMode')}
    </p>
  {/if}

  <div class="mt-8 rounded-2xl border border-stone-200 bg-white p-5 text-left">
    <h3 class="mb-3 font-bold text-stone-800">{t('thanksNext')}</h3>
    <ol class="space-y-3">
      {#each nextSteps as key, i}
        <li class="flex items-start gap-3 text-sm text-stone-700">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
          <span class="pt-0.5">{t(key)}</span>
        </li>
      {/each}
    </ol>
  </div>

  <button type="button" onclick={onnew}
    class="mt-8 text-sm font-medium text-brand-600 underline underline-offset-4 hover:text-brand-800">
    {t('newRequest')}
  </button>
</div>
