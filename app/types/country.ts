export type Country = {
  name: string;
  nativeName?: string;
  code: string;
  capital?: string;
  region: string;
  subregion?: string;
  population: number;
  flags?: { svg?: string; png?: string; alt?: string };
  borders?: string[];
  tld?: string[];
  languages?: string[];
  currencies?: string[];
  altSpellings?: string[];
};

export type CountriesQuery = {
  q?: string;
  region?: string;
  sort?: 'population' | 'name';
  dir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export type CountriesListResponse = {
  items: Country[];
  page: number;
  pageSize: number;
  total: number;
};
