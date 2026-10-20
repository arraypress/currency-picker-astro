# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] — 2026-10-21

### Changed

- The trigger's `aria-label` is now the current code followed by `label` —
  `"GBP, Choose currency"` rather than `"Choose currency"` — and it is
  rewritten whenever the code changes. `label` is therefore the trigger's
  purpose, not its whole name; pass `''` to name the trigger by its code
  alone (no `aria-label` is rendered). The trigger also carries
  `data-cp-label`, which the script reads to rebuild the name.

### Fixed

- WCAG 2.5.3 (label in name): the trigger's `aria-label` didn't contain its
  visible text, the currency code, so speech-input users saying "click GBP"
  couldn't reach it (axe `label-content-name-mismatch`).
- `aria-selected` on the options never moved off the base currency. It now
  follows the current currency, from detection and from a pick.

### Tests

- 9 runtime tests run the picker's script in jsdom: the trigger's name after
  detection, a stored pick and a click; the `label` prop, empty `label` and
  two pickers with different labels; and `aria-selected`. 22 tests in all.

## [1.0.1] — Unreleased

### Changed

- Widened the `astro` peerDependency to `^6.0.0 || ^7.0.0` for
  Astro 7 readiness. No runtime changes — the component is unaffected by the
  Astro 7 compiler / Vite 8 (Rolldown) upgrade.

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
