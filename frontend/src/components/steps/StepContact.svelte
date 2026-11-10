<script lang="ts">
  import Field from '../Field.svelte'
  import { form, type Errors } from '../../lib/form.svelte'
  import { t } from '../../lib/i18n.svelte'

  let { errors }: { errors: Errors } = $props()
</script>

<div class="space-y-6">
  <Field id="name" label={t('name')} required error={errors.name}>
    <input id="name" class="input" bind:value={form.name} placeholder={t('namePh')}
      autocomplete="name" aria-invalid={!!errors.name} />
  </Field>

  <Field id="company" label={t('company')}>
    <input id="company" class="input" bind:value={form.company} placeholder={t('companyPh')}
      autocomplete="organization" />
  </Field>

  <Field id="email" label={t('email')} required hint={t('emailHint')} error={errors.email}>
    <input id="email" type="email" class="input" bind:value={form.email} placeholder={t('emailPh')}
      autocomplete="email" inputmode="email" aria-invalid={!!errors.email} />
  </Field>

  <Field id="phone" label={t('phone')} required error={errors.phone}>
    <input id="phone" type="tel" class="input" bind:value={form.phone} placeholder={t('phonePh')}
      autocomplete="tel" inputmode="tel" aria-invalid={!!errors.phone} />
  </Field>

  <!-- Honeypot: hidden from people, but simple spam bots fill every field -->
  <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
    <label for="website">Website</label>
    <input id="website" tabindex="-1" autocomplete="off" bind:value={form.website} />
  </div>
</div>
