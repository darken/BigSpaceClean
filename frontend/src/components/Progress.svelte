<script lang="ts">
  import { t, type MessageKey } from '../lib/i18n.svelte'

  let { step }: { step: number } = $props()

  const labels: MessageKey[] = ['stepContact', 'stepProperty', 'stepCleaning', 'stepConfirm']
</script>

<nav aria-label="progress" class="mb-6">
  <p class="mb-3 text-sm text-stone-500">{t('stepOf', { n: step + 1, total: labels.length })}</p>
  <ol class="grid grid-cols-4 gap-2">
    {#each labels as label, i}
      <li class="flex flex-col gap-1.5" aria-current={i === step ? 'step' : undefined}>
        <span
          class="h-1.5 rounded-full transition-colors duration-300 {i <= step ? 'bg-brand-600' : 'bg-stone-200'}"
        ></span>
        <span class="truncate text-xs {i === step ? 'font-bold text-brand-700' : 'text-stone-400'}">
          {t(label)}
        </span>
      </li>
    {/each}
  </ol>
</nav>
