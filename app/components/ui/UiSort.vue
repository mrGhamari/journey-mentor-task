<script setup lang="ts">
// Variables ------
const dir = defineModel<'asc' | 'desc'>({ default: 'asc' });

// ------ Computed ------
const isAsc = computed(() => dir.value === 'asc');
const icon = computed(() => (isAsc.value ? '▲' : '▼'));
const text = computed(
  () => `Price ${icon.value} ${isAsc.value ? 'ASC' : 'DESC'}`
);

// ------ Methods ------
const toggle = () => (dir.value = isAsc.value ? 'desc' : 'asc');
</script>

<template>
  <div class="field">
    <div class="field__control">
      <button type="button" class="btn" style="padding: 10px;" @click="toggle">
        {{ text }}
      </button>
    </div>
  </div>
</template>