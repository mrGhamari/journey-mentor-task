<script setup lang="ts">
import { computed, ref } from 'vue';

// ------ Variables ------
const slots = useSlots();
const inputRef = ref<HTMLInputElement>();
defineExpose({ focus: () => inputRef.value?.focus() });
const model = defineModel<string | number | null>({ default: '' });

// ------ Props ------
const props = withDefaults(
  defineProps<{
    id?: string;
    hint?: string;
    error?: string;
    label?: string;
    disabled?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'text' | 'number' | 'email' | 'password';
  }>(),
  { type: 'text', size: 'md' }
);

// ------ Computed ------
const uid = computed(
  () => props.id ?? `in-${Math.random().toString(36).slice(2, 8)}`
);
const inputClass = computed(() => ({
  'is-invalid': !!props.error,
  'has-prefix': !!slots.prefix,
  'has-suffix': !!slots.suffix,
  'input--sm': props.size === 'sm',
  'input--lg': props.size === 'lg',
}));

const describedBy = computed<string | undefined>(() => {
  const id = uid.value;
  const ids: string[] = [];
  if (props.error) ids.push(`${id}-err`);
  if (props.hint) ids.push(`${id}-hint`);
  return ids.length ? ids.join(' ') : undefined;
});

// ------ Methods ------
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  model.value =
    props.type === 'number'
      ? el.value === ''
        ? null
        : Number(el.value)
      : el.value;
}
</script>

<template>
  <label class="field" :for="uid">
    <span v-if="label" class="field__label">{{ label }}</span>

    <div class="field__control">
      <span v-if="$slots.prefix" class="field__prefix">
        <slot name="prefix" />
      </span>

      <input
        :id="uid"
        :type="type"
        class="input"
        ref="inputRef"
        :class="inputClass"
        :value="model ?? ''"
        :disabled="disabled"
        :aria-invalid="!!error"
        :placeholder="placeholder"
        :aria-describedby="describedBy"
        @input="onInput"
      />

      <span v-if="$slots.suffix" class="field__suffix">
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="error" class="field__error" :id="uid + '-err'">{{ error }}</p>
    <p v-else-if="hint" class="field__hint" :id="uid + '-hint'">{{ hint }}</p>
  </label>
</template>
