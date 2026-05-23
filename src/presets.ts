/**
 * @module @arraypress/currency-picker-astro/presets
 *
 * Reasonable defaults for the most common consumer currencies, with
 * rates relative to GBP. Update monthly from xe.com or ECB. If your
 * store has a different base, replace the `rate` column accordingly.
 *
 * @example
 *   import { CurrencyPicker } from '@arraypress/currency-picker-astro';
 *   import { defaultCurrencies, defaultLocaleMap } from '@arraypress/currency-picker-astro/presets';
 *
 *   <CurrencyPicker currencies={defaultCurrencies} localeToCurrency={defaultLocaleMap} />
 */
import type { CurrencyInfo } from './types';

/** A baseline 12-currency list with GBP as the base. */
export const defaultCurrencies: CurrencyInfo[] = [
	{ code: 'GBP', symbol: '£',  label: 'British Pound (£)',     rate: 1.00 },
	{ code: 'USD', symbol: '$',  label: 'US Dollar ($)',         rate: 1.27 },
	{ code: 'EUR', symbol: '€',  label: 'Euro (€)',              rate: 1.18 },
	{ code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)',  rate: 1.73 },
	{ code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)', rate: 1.92 },
	{ code: 'JPY', symbol: '¥',  label: 'Japanese Yen (¥)',      rate: 192,  decimals: 0 },
	{ code: 'CHF', symbol: 'Fr', label: 'Swiss Franc (Fr)',      rate: 1.09 },
	{ code: 'SEK', symbol: 'kr', label: 'Swedish Krona (kr)',    rate: 13.4 },
	{ code: 'NOK', symbol: 'kr', label: 'Norwegian Krone (kr)',  rate: 13.6 },
	{ code: 'DKK', symbol: 'kr', label: 'Danish Krone (kr)',     rate: 8.8 },
	{ code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar (NZ$)', rate: 2.08 },
];

/** Locale → currency mapping for auto-detect. */
export const defaultLocaleMap: Record<string, string> = {
	'en-US': 'USD', 'en-CA': 'CAD', 'en-AU': 'AUD', 'en-NZ': 'NZD',
	'en-IE': 'EUR',
	'de':    'EUR', 'de-DE': 'EUR', 'de-AT': 'EUR', 'de-CH': 'CHF',
	'fr':    'EUR', 'fr-FR': 'EUR', 'fr-BE': 'EUR', 'fr-CA': 'CAD', 'fr-CH': 'CHF',
	'es':    'EUR', 'es-ES': 'EUR', 'it':    'EUR', 'it-IT': 'EUR',
	'nl':    'EUR', 'nl-NL': 'EUR', 'nl-BE': 'EUR',
	'pt-PT': 'EUR', 'fi':    'EUR', 'el':    'EUR',
	'sv':    'SEK', 'sv-SE': 'SEK',
	'nb':    'NOK', 'no':    'NOK', 'nb-NO': 'NOK',
	'da':    'DKK', 'da-DK': 'DKK',
	'ja':    'JPY', 'ja-JP': 'JPY',
};
