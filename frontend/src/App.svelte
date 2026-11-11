<script lang="ts">
  import { tick } from 'svelte'
  import Header from './components/Header.svelte'
  import Progress from './components/Progress.svelte'
  import StepContact from './components/steps/StepContact.svelte'
  import StepProperty from './components/steps/StepProperty.svelte'
  import StepCleaning from './components/steps/StepCleaning.svelte'
  import Confirm from './components/steps/Confirm.svelte'
  import Thanks from './components/steps/Thanks.svelte'
  import { form, resetForm, validateStep, type Errors } from './lib/form.svelte'
  import { t, type MessageKey } from './lib/i18n.svelte'
  import { isDemoMode, submitRequest } from './lib/api'

  // 0 = contact, 1 = property, 2 = cleaning, 3 = review, 4 = thank you
  let step = $state(0)
  // Errors are only shown after the user tries to go to the next step
  let showErrors = $state(false)
  // Privacy consent on the review screen
  let agreed = $state(false)
  let agreeError = $state(false)
  // Sending state
  let submitting = $state(false)
  let submitError = $state(false)
  // Shown on the thank-you screen
  let requestId = $state('')
  let sentEmail = $state('')

  const stepTitles: MessageKey[] = ['stepContact', 'stepProperty', 'stepCleaning', 'confirmTitle']

  // Re-validates live, so an error disappears as soon as the user fixes it
  const errors: Errors = $derived(showErrors && step <= 2 ? validateStep(step) : {})

  async function goTo(n: number) {
    step = n
    showErrors = false
    await tick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function next() {
    if (Object.keys(validateStep(step)).length > 0) {
      showErrors = true
      await tick()
      // Move focus to the first field with an error
      const first = document.querySelector<HTMLElement>('[data-error] input, [data-error] textarea, [data-error] [role=radiogroup] button, [data-error] [role=group] button')
      first?.focus()
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    goTo(step + 1)
  }

  async function submit() {
    if (!agreed) {
      agreeError = true
      await tick()
      document.getElementById('agree')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    // Safety net: validate every step again before sending
    for (const s of [0, 1, 2]) {
      if (Object.keys(validateStep(s)).length > 0) {
        await goTo(s)
        showErrors = true
        return
      }
    }

    submitting = true
    submitError = false
    try {
      // Send a plain copy of the reactive form object
      const res = await submitRequest($state.snapshot(form))
      if (!res.ok || !res.requestId) throw new Error(res.error ?? 'Unknown error')
      requestId = res.requestId
      sentEmail = form.email
      resetForm()
      agreed = false
      goTo(4)
    } catch (err) {
      console.error(err)
      submitError = true
    } finally {
      submitting = false
    }
  }

  // Hide the consent error as soon as the box is checked
  $effect(() => {
    if (agreed) agreeError = false
  })

  $effect(() => {
    document.title = `${t('title')} | ${t('brand')}`
  })
</script>

<Header />

<main class="mx-auto max-w-xl px-4 pt-6 pb-36">
  {#if step < 4}
    {#if step === 0}
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">{t('title')}</h1>
        <p class="mt-2 text-stone-600">{t('lead')}</p>
      </div>
    {/if}

    <Progress {step} />

    <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 sm:p-7">
      <h2 class="mb-6 text-lg font-bold text-brand-800">{t(stepTitles[step])}</h2>

      {#if showErrors && Object.keys(errors).length > 0}
        <p class="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {t('errSummary')}
        </p>
      {/if}

      <form novalidate onsubmit={(e) => { e.preventDefault(); if (step < 3) next(); else submit() }}>
        {#if step === 0}
          <StepContact {errors} />
        {:else if step === 1}
          <StepProperty {errors} />
        {:else if step === 2}
          <StepCleaning {errors} />
        {:else}
          <Confirm bind:agreed {agreeError} onedit={goTo} />
        {/if}

        {#if submitError}
          <p class="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{t('errSubmit')}</p>
        {/if}

        <!-- Bottom action bar: fixed on phones so the main button is always reachable -->
        <div class="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div class="mx-auto flex max-w-xl gap-3">
            {#if step > 0}
              <button type="button" onclick={() => goTo(step - 1)} disabled={submitting}
                class="h-13 rounded-xl border border-stone-300 px-5 font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50">
                {t('back')}
              </button>
            {/if}
            <!-- disabled while sending, so a double tap cannot send twice -->
            <button type="submit" disabled={submitting}
              class="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 font-bold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99] disabled:opacity-70">
              {#if submitting}
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                {t('submitting')}
              {:else if step < 2}
                {t('next')}
              {:else if step === 2}
                {t('toConfirm')}
              {:else}
                {t('submit')}
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
  {:else}
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70 sm:p-8">
      <Thanks {requestId} email={sentEmail} demo={isDemoMode} onnew={() => goTo(0)} />
    </div>
  {/if}

  <footer class="mt-10 text-center text-xs text-stone-400">
    BigSpace Clean · Prototype
  </footer>
</main>
