<script setup lang="ts">
// ------ Variables ------
const open = defineModel<boolean>('open', { default: false });

// ------ Props ------
const props = withDefaults(
  defineProps<{
    closeOnEsc?: boolean;
    closeOnBackdrop?: boolean;
    maxWidth?: string;
  }>(),
  {
    closeOnEsc: true,
    closeOnBackdrop: true,
    maxWidth: '860px',
  }
);

// ------ Methods ------
const close = () => (open.value = false);
const onKeydown = (e: KeyboardEvent) => {
  if (props.closeOnEsc && e.key === 'Escape') close();
};

// ------ Watchers ------
watch(
  open,
  (v) => {
    const fn = onKeydown as any;
    if (v) window.addEventListener('keydown', fn);
    else window.removeEventListener('keydown', fn);
  },
  { immediate: true }
);

// ------ Lifecycle ------
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <teleport to="body">
    <div v-show="open" class="modal" @click.self="close" data-test="ui-modal">
      <div
        class="modal__card card"
        :style="{ maxWidth }"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
      >
        <slot>Modal content</slot>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: var(--sp-4);
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(2px) saturate(140%);
  animation: fadeIn var(--dur-2) var(--ease);
}

.modal__card {
  width: min(96vw, 100%);
  animation: popIn var(--dur-2) var(--ease);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes popIn {
  from {
    transform: translateY(8px);
    opacity: 0.98;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
