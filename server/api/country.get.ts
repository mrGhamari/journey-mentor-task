import { mapV3ToCountry } from '../utils/country';
import type { Country } from '@/types/country';

const FIELDS = [
  'name',
  'cca3',
  'capital',
  'region',
  'subregion',
  'population',
  'flags',
  'borders',
  'tld',
  'currencies',
  'languages',
  'altSpellings',
].join(',');

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as { code?: string; name?: string };

  const code = (q.code || '').toString().trim();
  const name = (q.name || '').toString().trim();

  let data: any[] = [];
  if (code) {
    const res = await $fetch<any | any[]>(
      `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}?fields=${FIELDS}`
    );
    data = Array.isArray(res) ? res : [res];
  } else if (name) {
    const res = await $fetch<any[]>(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true&fields=${FIELDS}`
    );
    data = res || [];
  }

  if (!data?.length) return null;
  const item = mapV3ToCountry(data[0]) as Country;
  return item;
});
