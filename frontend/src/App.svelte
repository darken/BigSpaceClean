<script lang="ts">
  import { tick } from 'svelte'
  import Header from './components/Header.svelte'
  import Progress from './components/Progress.svelte'
  import StepContact from './components/steps/StepContact.svelte'
  import { validateStep, type Errors } from './lib/form.svelte'
  import { t } from './lib/i18n.svelte'

  // 0 = contact (more steps coming next)
  let step = $state(0)
  // Errors are only shown after the user tries to go to the next step
  let showErrors = $state(false)

  // Re-validates live, so an error disappears as soon as the user fixes it
  const errors: Errors = $derived(showErrors ? validateStep(step) : {})

  async function next() {
    if (Object.keys(validateStep(step)).length > 0) {
      showErrors = true
      await tick()
      // Move focus to the first field with an error
      const first = document.querySelector<HTMLElement>('[data-error] input, [data-error] textarea')
      first?.focus()
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    // TODO: go to the property step
  }

  $effect(() => {
    document.title = `${t('title')} | ${t('brand')}`
  })
</script>

<Header />

<main class="mx-auto max-w-xl px-4 pt-6 pb-36">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">{t('title')}</h1>
    <p class="mt-2 text-stone-600">{t('lead')}</p>
  </div>

  <Progress {step} />

  <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 sm:p-7">
    <h2 class="mb-6 text-lg font-bold text-brand-800">{t('stepContact')}</h2>

    {#if showErrors && Object.keys(errors).length > 0}
      <p class="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
        {t('errSummary')}
      </p>
    {/if}

    <form novalidate onsubmit={(e) => { e.preventDefault(); next() }}>
      <StepContact {errors} />

      <!-- Bottom action bar: fixed on phones so the main button is always reachable -->
      <div class="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div class="mx-auto flex max-w-xl gap-3">
          <button type="submit"
            class="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 font-bold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]">
            {t('next')}
          </button>
        </div>
      </div>
    </form>
  </div>

  <footer class="mt-10 text-center text-xs text-stone-400">
    BigSpace Clean · Prototype
  </footer>
</main>
