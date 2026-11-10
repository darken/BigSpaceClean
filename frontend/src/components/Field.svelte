<!-- Wraps an input with its label, required/optional badge, hint and error. -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { t, type MessageKey } from '../lib/i18n.svelte'

  let {
    id,
    label,
    required = false,
    hint,
    error,
    children,
  }: {
    id: string
    label: string
    required?: boolean
    hint?: string
    error?: MessageKey
    children: Snippet
  } = $props()
</script>

<div class="space-y-2" data-error={error ? 'true' : undefined}>
  <label for={id} class="flex items-center gap-2 font-medium text-stone-800">
    {label}
    {#if required}
      <span class="rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-bold text-brand-700">{t('required')}</span>
    {:else}
      <span class="text-[11px] text-stone-400">{t('optional')}</span>
    {/if}
  </label>
  {@render children()}
  {#if error}
    <p id="{id}-error" class="text-sm text-red-600" role="alert">{t(error)}</p>
  {:else if hint}
    <p class="text-sm text-stone-500">{hint}</p>
  {/if}
</div>
