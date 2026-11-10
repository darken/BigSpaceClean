<script lang="ts">
  import Field from '../Field.svelte'
  import ChoiceCards from '../ChoiceCards.svelte'
  import { form, tomorrow, type Errors } from '../../lib/form.svelte'
  import { t } from '../../lib/i18n.svelte'
  import { cleaningTypes, timeSlots, frequencies } from '../../lib/options'

  let { errors }: { errors: Errors } = $props()
</script>

<div class="space-y-6">
  <Field id="cleaningTypes" label={t('cleaningTypes')} required hint={t('cleaningTypesHint')}
    error={errors.cleaningTypes}>
    <ChoiceCards id="cleaningTypes" options={cleaningTypes} bind:values={form.cleaningTypes}
      multiple columns={1} invalid={!!errors.cleaningTypes} />
  </Field>

  <Field id="date" label={t('date')} required error={errors.date}>
    <input id="date" type="date" class="input" min={tomorrow()} bind:value={form.date}
      aria-invalid={!!errors.date} />
  </Field>

  <Field id="timeSlot" label={t('timeSlot')} required error={errors.timeSlot}>
    <ChoiceCards id="timeSlot" options={timeSlots} bind:value={form.timeSlot}
      invalid={!!errors.timeSlot} />
  </Field>

  <Field id="frequency" label={t('frequency')} required error={errors.frequency}>
    <ChoiceCards id="frequency" options={frequencies} bind:value={form.frequency}
      columns={3} invalid={!!errors.frequency} />
  </Field>

  <Field id="notes" label={t('notes')}>
    <textarea id="notes" class="input" rows="4" bind:value={form.notes}
      placeholder={t('notesPh')}></textarea>
  </Field>
</div>
