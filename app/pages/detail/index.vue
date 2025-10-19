<template>
  <main class="detail container">
    <NuxtLink class="btn" to="/">← Back</NuxtLink>

    <section v-if="country" class="detail__card">
      <div class="detail__flag">
        <img
          v-if="country.flags?.svg || country.flags?.png"
          :src="country.flags?.svg || country.flags?.png"
          :alt="country.name + ' flag'"
          loading="lazy"
        />
      </div>

      <div class="detail__content">
        <h1 class="detail__title">{{ country.name }}</h1>
        <div class="detail__grid">
          <ul class="detail__list">
            <li>
              <span class="k">Native Name:</span>
              <span class="v">{{ country.nativeName || '—' }}</span>
            </li>
            <li>
              <span class="k">Population:</span>
              <span class="v">{{ num(country.population) }}</span>
            </li>
            <li>
              <span class="k">Region:</span>
              <span class="v">{{ country.region || '—' }}</span>
            </li>
            <li>
              <span class="k">Sub Region:</span>
              <span class="v">{{ country.subregion || '—' }}</span>
            </li>
            <li>
              <span class="k">Capital:</span>
              <span class="v">{{ country.capital || '—' }}</span>
            </li>
          </ul>

          <ul class="detail__list">
            <li>
              <span class="k">Top Level Domain:</span>
              <span class="v">{{ country.tld?.join(', ') || '—' }}</span>
            </li>
            <li>
              <span class="k">Currencies:</span>
              <span class="v">{{ country.currencies?.join(', ') || '—' }}</span>
            </li>
            <li>
              <span class="k">Languages:</span>
              <span class="v">{{ country.languages?.join(', ') || '—' }}</span>
            </li>
          </ul>
        </div>

        <div class="detail__borders" v-if="borders?.length">
          <span class="k">Border Countries:</span>
          <div class="chips">
            <NuxtLink
              v-for="b in borders"
              :key="b.code"
              class="chip"
              :to="'/detail?code=' + encodeURIComponent(b.code)"
              >{{ b.name }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </section>

    <p v-else class="status">Loading…</p>
  </main>
</template>

<script setup lang="ts">
import type { Country } from '@/types/country';

const route = useRoute();
const code = computed(() => (route.query.code as string) || '');
const name = computed(() => (route.query.name as string) || '');

const { data: country } = await useFetch<Country | null>('/api/country', {
  query: computed(() => ({ code: code.value || undefined, name: name.value || undefined })),
  default: () => null,
});

// Fetch border country names if codes available
const borderCodes = computed(() => country.value?.borders?.join(',') || '');
const { data: borderData } = await useFetch<any[]>(
  () =>
    borderCodes.value
      ? `https://restcountries.com/v3.1/alpha?codes=${borderCodes.value}&fields=name,cca3`
      : null,
  { default: () => [] }
);
const borders = computed<{ code: string; name: string }[]>(() =>
  (borderData.value || []).map((b: any) => ({ code: b?.cca3, name: b?.name?.common }))
);

const num = (n?: number) => (typeof n === 'number' ? n.toLocaleString() : '');
</script>

<style scoped>
.detail { padding-block: 2rem; font-size: var(--fs-1); }
.detail__card { display: grid; grid-template-columns: 1.3fr 1fr; gap: 4rem; margin-top: 2rem; align-items: start; }
.detail__flag img { width: 100%; height: auto; display: block; border-radius: var(--radius); }
.detail__title { margin: 0 0 1.25rem 0; font-weight: var(--fw-800); font-size: 2rem; }
.detail__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 4rem; }
.detail__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.k { font-weight: var(--fw-600); margin-right: 0.35rem; }
.v { opacity: 0.9; }
.detail__borders { margin-top: 2rem; display: grid; gap: 0.75rem; }
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip { background: var(--surface); border: 1px solid var(--br); padding: 0.25rem 0.75rem; border-radius: 6px; color: inherit; text-decoration: none; font-size: var(--fs-0); }
.status { color: var(--muted); }
@media (max-width: 1000px) {
  .detail__card { grid-template-columns: 1fr; gap: 2rem; }
  .detail__grid { grid-template-columns: 1fr; }
}
</style>
