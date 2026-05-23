# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — Unreleased

### Initial Release

- `<CurrencyPicker>` — Astro component for static/SSG stores.
- Auto-detects from `navigator.language` with a configurable locale
  → currency map. Falls back to the base currency if the locale
  isn't mapped.
- Rewrites every `[data-price-original]` element on the page on
  change. Caches the server-rendered text so switching back to the
  base currency restores the original markup verbatim.
- Cache is keyed on the `data-price-original` value so variant
  selectors that mutate prices refresh the cache cleanly.
- Re-runs on `wg:prices-updated` for client-side price mutations.
- Dispatches a `currencychange` CustomEvent on user-driven changes.
- Variants: `'footer'` (opens up) and `'header'` (opens down).
- Ships zero styles — exposes class hooks only.
- Optional defaults in `@arraypress/currency-picker-astro/presets`
  (11 currencies, GBP base).

13 tests passing under Astro's experimental_AstroContainer.
