<script lang="ts">
  import Field from '../Field.svelte'
  import { form, type Errors } from '../../lib/form.svelte'
  import { t } from '../../lib/i18n.svelte'

  let { errors }: { errors: Errors } = $props()
</script>

<div class="space-y-6">
  <Field id="propertyName" label={t('propertyName')} required error={errors.propertyName}>
    <input id="propertyName" class="input" bind:value={form.propertyName}
      placeholder={t('propertyNamePh')} aria-invalid={!!errors.propertyName} />
  </Field>

  <Field id="address" label={t('address')} required error={errors.address}>
    <input id="address" class="input" bind:value={form.address} placeholder={t('addressPh')}
      autocomplete="street-address" aria-invalid={!!errors.address} />
  </Field>

  <Field id="layout" label={t('layout')}>
    <input id="layout" class="input" bind:value={form.layout} placeholder={t('layoutPh')} />
  </Field>

  <Field id="accessMethod" label={t('access')} hint={t('accessHint')}>
    <input id="accessMethod" class="input" bind:value={form.accessMethod}
      placeholder={t('accessPh')} />
  </Field>
</div>
