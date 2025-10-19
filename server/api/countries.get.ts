import type {
  CountriesListResponse,
  CountriesQuery,
  Country,
} from '@/types/country';
import {
  fuzzyMatchCountryName,
  mapV3ToCountry,
  normalizeStr,
} from '../utils/country';

// Include flags to ensure image URLs are available while keeping requested fields
const FIELDS = ['name', 'flag', 'flags', 'capital', 'population', 'image'].join(',');

let cacheAll: { at: number; data: any[] } | null = null;
const TTL = 5 * 60 * 1000;

async function fetchAllCountries(): Promise<any[]> {
  const now = Date.now();
  if (cacheAll && now - cacheAll.at < TTL) return cacheAll.data;
  const data = await $fetch<any[]>(
    `https://restcountries.com/v3.1/all?fields=${FIELDS}`
  );
  cacheAll = { at: now, data };
  return data;
}

export default defineEventHandler(async (event) => {
  setHeader(
    event,
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );

  const q = getQuery<CountriesQuery>(event);
  const search = (q.q || '').toString();
  const region = (q.region || '').toString();
  const sort = (q.sort === 'population' ? 'population' : 'name') as
    | 'population'
    | 'name';
  const dir = (q.dir === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';
  const page = Math.max(1, Number(q.page ?? 1));
  // Allow larger page sizes so we can list all countries on the home page
  const pageSize = Math.min(300, Math.max(1, Number(q.pageSize ?? 250)));

  const src = await fetchAllCountries();

  let items = src
    .map((c: any) => mapV3ToCountry(c))
    .filter(Boolean) as Country[];

  if (region) {
    const nRegion = normalizeStr(region);
    items = items.filter((c) => normalizeStr(c.region) === nRegion);
  }

  if (search) {
    const s = search.trim();
    items = items.filter((c) => fuzzyMatchCountryName(s, c.name));
  }

  items.sort((a, b) => {
    let v = 0;
    if (sort === 'population') v = a.population - b.population;
    else v = a.name.localeCompare(b.name);
    return dir === 'asc' ? v : -v;
  });

  const total = items.length;
  const start = (page - 1) * pageSize;
  items = items.slice(start, start + pageSize);

  const res: CountriesListResponse = { items, page, pageSize, total };
  return res;
});
