<script setup lang="ts">
// ------ Props ------
const props = withDefaults(
  defineProps<{
    rel?: string;
    href?: string;
    target?: string;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    variant?: 'default' | 'primary' | 'ghost' | 'danger' | 'link';
  }>(),
  {
    size: 'md',
    block: false,
    loading: false,
    type: 'button',
    disabled: false,
    variant: 'default',
  }
);

// ------ Computed ------
const isLink = computed(() => !!props.href);
const tag = computed(() => (props.href ? 'a' : 'button'));
const btnClass = computed(() =>
  [
    'btn',
    props.block && 'btn--block',
    props.loading && 'is-loading',
    props.size === 'sm' && 'btn--sm',
    props.size === 'lg' && 'btn--lg',
    props.variant === 'ghost' && 'btn--ghost',
    props.variant === 'danger' && 'btn--danger',
    props.variant === 'primary' && 'btn--primary',
  ].filter(Boolean)
);
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :class="btnClass"
    :aria-busy="loading || undefined"
    :type="!isLink ? type : undefined"
    :target="href ? target : undefined"
    :disabled="!isLink && (disabled || loading)"
    :rel="
      href ? rel || (target === '_blank' ? 'noopener' : undefined) : undefined
    "
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot />
  </component>
</template>
