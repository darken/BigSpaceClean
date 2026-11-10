<!--
  Tappable cards, more spacious than normal radio buttons / checkboxes.
  - single choice: bind:value (string)
  - multiple choice: bind:values (string[])
-->
<script lang="ts">
  import type { Option } from '../lib/options'

  let {
    id,
    options,
    value = $bindable(''),
    values = $bindable([]),
    multiple = false,
    columns = 2,
    invalid = false,
  }: {
    id: string
    options: Option[]
    value?: string
    values?: string[]
    multiple?: boolean
    columns?: 1 | 2 | 3
    invalid?: boolean
  } = $props()

  const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

  function isSelected(v: string) {
    return multiple ? values.includes(v) : value === v
  }

  function choose(v: string) {
    if (multiple) {
      values = values.includes(v) ? values.filter((x) => x !== v) : [...values, v]
    } else {
      value = v
    }
  }
</script>

<div
  {id}
  role={multiple ? 'group' : 'radiogroup'}
  aria-invalid={invalid}
  class="grid gap-2.5 {gridCols[columns]}"
>
  {#each options as opt}
    {@const selected = isSelected(opt.value)}
    <button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onclick={() => choose(opt.value)}
      class="relative flex min-h-14 flex-col justify-center rounded-xl border-2 px-4 py-3 text-left transition
        {selected
          ? 'border-brand-600 bg-brand-50 shadow-sm'
          : invalid
            ? 'border-red-300 bg-white hover:border-brand-200'
            : 'border-stone-200 bg-white hover:border-brand-200'}"
    >
      <span class="pr-6 font-medium {selected ? 'text-brand-800' : 'text-stone-800'}">{opt.label}</span>
      {#if opt.desc}
        <span class="mt-0.5 text-xs leading-snug text-stone-500">{opt.desc}</span>
      {/if}
      
      <span
        class="absolute top-3 right-3 flex h-5 w-5 items-center justify-center border-2 transition
          {multiple ? 'rounded-md' : 'rounded-full'}
          {selected ? 'border-brand-600 bg-brand-600' : 'border-stone-300 bg-white'}"
        aria-hidden="true"
      >
        {#if selected}
          <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-white"><path d="M7.6 13.4 4.2 10l-1.4 1.4 4.8 4.8 10-10-1.4-1.4z" /></svg>
        {/if}
      </span>
    </button>
  {/each}
</div>
