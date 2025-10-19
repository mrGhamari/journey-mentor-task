# Project Walkthrough (Step by Step)

This document explains the steps taken to implement the Countries UI, API integration, theming, and detail view in this Nuxt 3 project.

## 1) Apply Style Guide + Fonts

- Added Nunito Sans (weights 300/600/800) via Google Fonts.
  - nuxt.config.ts:8
- Replaced and organized design tokens to match the style guide (light/dark palettes, radii, shadows, spacing, font sizes + weights).
  - app/assets/main.css:1
- Implemented dark theme overrides using `[data-theme="dark"]` and updated inputs to use themed surfaces.
  - app/assets/main.css:55, 147
- Centered the page content by making `.container` auto‑margin horizontally.
  - app/assets/main.css:120

## 2) Theme Toggle

- A simple theme switch sets `data-theme="light|dark"` on `<html>` and persists the value in `localStorage`.
  - app/components/ui/themeButton.vue:1
  - app/composables/userTheme.ts:1

## 3) Country Card (UI)

- Replaced product-centric card with a theme-aware country card matching the design system tokens.
- Shows: flag, name, population, region, capital. Whole card is clickable if a `to` prop is provided.
  - app/components/country/CountryCard.vue:1

## 4) Types and Mapping

- Introduced a normalized `Country` type for both API and UI layers.
  - app/types/country.ts:1
- Implemented mapping and helpers for REST Countries v3.
  - server/utils/country.ts:1
    - `mapV3ToCountry` converts upstream payloads to `Country` (resolves flags, native name, currencies, languages, etc.).
    - `normalizeStr` removes diacritics for comparisons.
    - `fuzzyMatchCountryName` for simple name search.

## 5) Countries List API (Server)

- API route: `GET /api/countries`
- Fetches from REST Countries using the fields required by the spec and caches results for 5 minutes.
- Supports optional query parameters: `q`, `region`, `sort`, `dir`, `page`, `pageSize`.
- Returns: `{ items: Country[], page, pageSize, total }`.
  - server/api/countries.get.ts:1

Example upstream URL (as requested):
- `https://restcountries.com/v3.1/all?fields=name,flag,flags,capital,population,image`

## 6) Detail API (Server)

- API route: `GET /api/country`
- Accepts `code` (preferred) or `name` (fullText) and returns a single `Country` with richer fields.
  - server/api/country.get.ts:1

## 7) Home Page (Index)

- Displays a responsive grid of country cards.
  - 4 columns on desktop; 3/2/1 on smaller widths.
- Fetches data from `/api/countries` and renders the full list.
- Each card links to `/detail?code=CCA3` (or falls back to `name`).
  - app/pages/index.vue:1

## 8) Detail Page

- Layout matches the provided mock: large flag left, info right, and “Back” button.
- Shows Native Name, Population, Region, Sub Region, Capital, TLD, Currencies, Languages.
- Fetches and displays border countries as small chips; chips link to their detail pages.
  - app/pages/detail/index.vue:1

## 9) How to Run

- Install and start:
  - `npm install`
  - `npm run dev`
- Open: `http://localhost:3000`
- Navigate:
  - Home lists all countries (the grid is responsive and centered).
  - Click a card → Detail view for that country.
  - Use the theme switch in the header to toggle dark mode.

## 10) Notes and Next Steps

- The list API uses a generous `pageSize` (300) to show all countries at once. For production, consider pagination or infinite scroll.
- The upstream REST Countries API does not include a first‑class `image` field; mapping falls back to `flags` and handles that gracefully.
- Optional enhancements:
  - Re-introduce search and region filters on the home page and sync with the URL.
  - Show richer neighbor info (e.g., small flags) for border countries.
  - Add skeleton loading states for list and detail.

