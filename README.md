# @arraypress/currency-picker-astro

> Astro frontend currency picker for static / SSG stores.
> Auto-detects the user's likely currency from `navigator.language`,
> persists choice to localStorage, rewrites every
> `[data-price-original]` element on the page on change.

The picker is a **reference converter** — checkout always charges in
your store's native currency. Surface that disclaimer in your own
copy so buyers aren't surprised.

## Install

```bash
npm install @arraypress/currency-picker-astro
```

## Use

```astro
---
import { CurrencyPicker } from '@arraypress/currency-picker-astro';
import { defaultCurrencies, defaultLocaleMap } from '@arraypress/currency-picker-astro/presets';
---
<footer>
  <CurrencyPicker
    currencies={defaultCurrencies}
    localeToCurrency={defaultLocaleMap}
  />
</footer>
```

Or supply your own rate table (recommended for production — keep the
rates accurate to within ~24 hours):

```astro
<CurrencyPicker
  currencies={[
    { code: 'GBP', symbol: '£', label: 'British Pound (£)', rate: 1.00 },
    { code: 'USD', symbol: '$', label: 'US Dollar ($)',      rate: 1.27 },
    { code: 'EUR', symbol: '€', label: 'Euro (€)',           rate: 1.18 },
    /* … */
  ]}
  localeToCurrency={{ 'en-US': 'USD', 'fr-FR': 'EUR', /* … */ }}
/>
```

The **first entry's code is the base currency**. Every rate is
expressed as `1 base = rate × other`. So with `'GBP'` first, `'USD'`
rate `1.27` means £1 = $1.27.

## DOM contract

Annotate every price you want converted:

```astro
<span
  data-price-original={price}
  data-price-currency="GBP"
  class="price"
>£{price}</span>
```

- `data-price-original` — raw numeric value in `data-price-currency`.
- `data-price-currency` — ISO-4217 code. Optional — defaults to the
  base currency if missing.

Elements without `data-price-original` are skipped. Migrate
gradually.

## Reactive updates

When your page mutates prices client-side (variation selectors,
quantity steppers, etc.), dispatch the refresh event after the swap:

```js
document.dispatchEvent(new CustomEvent('wg:prices-updated'));
```

The picker re-runs the conversion pass so the new values land in
the active currency.

## Events

```js
document.addEventListener('currencychange', (e) => {
  console.log('user picked', e.detail.code); // 'USD' | 'EUR' | …
});
```

Fires after every user-driven change. Auto-detection on first load
does *not* fire this event.

## Props

| Prop               | Default            | Description                                                       |
|--------------------|--------------------|-------------------------------------------------------------------|
| `currencies`       | **required**       | Currency list. First entry is the base.                           |
| `localeToCurrency` | `{}`               | BCP-47 locale → currency code. Powers `navigator.language` detect.|
| `storageKey`       | `'ap-currency'`    | localStorage key for persistence.                                 |
| `variant`          | `'footer'`         | `'footer'` opens up, `'header'` opens down.                       |
| `class`            | —                  | Extra classes on the trigger button.                              |
| `label`            | `'Choose currency'`| aria-label for the trigger.                                       |

## Styling

The component ships **no styles** — it only emits class hooks so you
can theme it however you like. Hook against these:

```
.cp-root          { /* wrapper */ }
.cp-trigger       { /* button */ }
.cp-icon, .cp-caret
.cp-panel         { /* dropdown */ }
.cp-panel--up
.cp-panel--down
.cp-panel[data-open="true"]   { /* visible state */ }
.cp-option        { /* menu row */ }
.cp-option-code, .cp-option-label
```

Most theme stylesheets already define equivalents — drop your own
selectors next to the rest of your design tokens.

## License

MIT
