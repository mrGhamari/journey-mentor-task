<template>
  <main class="home container" data-test="home">
    <!-- toolbar removed per responsive requirement -->

    <section class="grid">
      <CountryCard
        v-for="c in items"
        :key="c.code + c.name"
        :country="c"
        :to="(c.code ? '/detail?code=' + encodeURIComponent(c.code) : '/detail?name=' + encodeURIComponent(c.name))"
      />

      <div v-if="pending" class="status">Loading…</div>
      <div v-else-if="error" class="status">Failed to load</div>
      <div v-else-if="!items.length" class="status">No countries found</div>
    </section>
  </main>
</template>

<script setup lang="ts">
import CountryCard from '~/components/country/CountryCard.vue';
import type { CountriesListResponse } from '@/types/country';

const { data, pending, error } = await useFetch<CountriesListResponse>(
  '/api/countries',
  {
    query: { sort: 'name', dir: 'asc', page: 1, pageSize: 300 },
    default: () => ({ items: [], page: 1, pageSize: 300, total: 0 }),
  }
);
const items = computed(() => data.value?.items ?? []);
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-block: 1.5rem 0.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  padding-block: 1.5rem 2rem;
}
@media (max-width: 1200px) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 520px) {
  .grid { grid-template-columns: 1fr; }
}
.status {
  grid-column: 1 / -1;
  color: var(--muted);
}
</style>
