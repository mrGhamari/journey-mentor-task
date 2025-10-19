<script setup lang="ts">
import type { Country } from '~/types/country';

const props = defineProps<{
  country: Country;
  to?: string;
}>();

const name = computed(() => props.country.name);
const population = computed(() => props.country.population);
const region = computed(() => props.country.region);
const capital = computed(() => props.country.capital);

const flagSrc = computed(() =>
  props.country.flags?.svg || props.country.flags?.png || (props as any).country.flag || ''
);
const flagAlt = computed(
  () => props.country.flags?.alt || `${name.value} flag`
);
const capitalText = computed(() =>
  Array.isArray(capital.value) ? capital.value.join(', ') : capital.value
);
const popText = (n: number | undefined) =>
  typeof n === 'number' ? n.toLocaleString() : '';
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="country">
    <div class="country__media">
      <img
        v-if="flagSrc"
        class="country__img"
        :src="flagSrc"
        :alt="flagAlt"
        loading="lazy"
      />
      <div v-else class="country__img country__img--placeholder">No Flag</div>
    </div>

    <div class="country__body">
      <h3 class="country__name" :title="name">{{ name }}</h3>
      <ul class="country__meta">
        <li>
          <span class="country__meta-label">Population:</span>
          <span class="country__meta-value">{{ popText(population) }}</span>
        </li>
        <li>
          <span class="country__meta-label">Region:</span>
          <span class="country__meta-value">{{ region }}</span>
        </li>
        <li v-if="capitalText">
          <span class="country__meta-label">Capital:</span>
          <span class="country__meta-value">{{ capitalText }}</span>
        </li>
      </ul>
    </div>
  </NuxtLink>
  <article v-else class="country">
    <div class="country__media">
      <img
        v-if="flagSrc"
        class="country__img"
        :src="flagSrc"
        :alt="flagAlt"
        loading="lazy"
      />
      <div v-else class="country__img country__img--placeholder">No Flag</div>
    </div>

    <div class="country__body">
      <h3 class="country__name" :title="name">{{ name }}</h3>
      <ul class="country__meta">
        <li>
          <span class="country__meta-label">Population:</span>
          <span class="country__meta-value">{{ popText(population) }}</span>
        </li>
        <li>
          <span class="country__meta-label">Region:</span>
          <span class="country__meta-value">{{ region }}</span>
        </li>
        <li v-if="capitalText">
          <span class="country__meta-label">Capital:</span>
          <span class="country__meta-value">{{ capitalText }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.country {
  display: grid;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--br);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  text-decoration: none;
  color: inherit;
  transition: transform var(--dur-1) var(--ease), box-shadow var(--dur-1) var(--ease);
}
.country:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.country__media {
  position: relative;
  overflow: hidden;
}
.country__img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.country__img--placeholder {
  display: grid;
  place-items: center;
  background: var(--surface-alt);
  color: var(--muted);
  height: 180px;
}

.country__body {
  padding: 1.25rem;
  background: color-mix(in oklab, var(--surface) 90%, black 10%);
}
.country__name {
  margin: 0 0 0.75rem 0;
  font-weight: var(--fw-800);
  font-size: 1.125rem;
  color: var(--fg);
}
.country__meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
  font-size: var(--fs-0);
}
.country__meta-label {
  font-weight: var(--fw-600);
  margin-right: 0.25rem;
}
.country__meta-value {
  color: color-mix(in oklab, var(--fg) 85%, white 15%);
}

/* Small screens tweak */
@media (max-width: 480px) {
  .country__img,
  .country__img--placeholder {
    height: 140px;
  }
}
</style>
