import type { Country } from '~/types/country';

export function normalizeStr(s: string | undefined | null): string {
  if (!s) return '';
  try {
    return s
      .toString()
      .normalize('NFD')
      // Strip combining marks (diacritics)
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  } catch {
    return s.toString().toLowerCase().trim();
  }
}

export function fuzzyMatchCountryName(query: string, name: string): boolean {
  const q = normalizeStr(query);
  const n = normalizeStr(name);
  if (!q) return true;
  return n.includes(q);
}

export function mapV3ToCountry(src: any): Country | null {
  if (!src) return null;
  const name = src?.name?.common || src?.name?.official || '';
  if (!name) return null;

  const languages: string[] = src?.languages
    ? Object.values(src.languages)
        .filter(Boolean)
        .map((x: any) => String(x))
    : [];

  const currencies: string[] = src?.currencies
    ? Object.entries<any>(src.currencies).map(([code, v]) =>
        v?.name ? `${v.name} (${code})` : code
      )
    : [];

  // Resolve native name (pick first available)
  let nativeName: string | undefined;
  const nNames = src?.name?.nativeName || {};
  for (const k of Object.keys(nNames)) {
    const v = nNames[k];
    nativeName = v?.common || v?.official;
    if (nativeName) break;
  }

  // Prefer flags; fall back to non-standard `image` or emoji `flag` if provided
  let resolvedFlags = src?.flags as any | undefined;
  if (!resolvedFlags && src?.image) {
    if (typeof src.image === 'string') resolvedFlags = { png: src.image };
    else if (typeof src.image === 'object')
      resolvedFlags = {
        png: src.image.png,
        svg: src.image.svg,
        alt: src.image.alt,
      };
  }
  if (!resolvedFlags && src?.flag && typeof src.flag === 'string') {
    resolvedFlags = { alt: `Flag of ${name} ${src.flag}` };
  }

  const country: Country = {
    name,
    nativeName,
    code: src?.cca3 || '',
    capital: Array.isArray(src?.capital) ? src.capital[0] : src?.capital,
    region: src?.region || '',
    subregion: src?.subregion || undefined,
    population: typeof src?.population === 'number' ? src.population : 0,
    flags: resolvedFlags,
    borders: src?.borders || undefined,
    tld: src?.tld || undefined,
    languages: languages.length ? languages : undefined,
    currencies: currencies.length ? currencies : undefined,
    altSpellings: src?.altSpellings || undefined,
  };

  return country;
}
