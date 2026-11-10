<script lang="ts">
  import { t } from '../lib/i18n.svelte'
</script>

<header class="sticky top-0 z-10 border-b border-stone-200/70 bg-white/90 backdrop-blur">
  <div class="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
    <div class="flex items-center gap-2">
      <img src="/favicon.svg" alt="" class="h-7 w-7" />
      <span class="font-bold tracking-wide text-brand-700">{t('brand')}</span>
    </div>
  </div>
</header>
