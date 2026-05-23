/**
 * @module @arraypress/currency-picker-astro/types
 */

export interface CurrencyInfo {
	/** ISO-4217 code (uppercase). */
	code: string;
	/** Currency symbol prefix (`$`, `£`, `¥`). Used only as a fallback
	 *  when `Intl.NumberFormat` is unavailable. */
	symbol: string;
	/** Human label for the dropdown (`'British Pound (£)'`). */
	label: string;
	/**
	 * Rate from the base currency — `1 BASE = rate * <this currency>`.
	 * The base is whatever the consumer's `data-price-currency` carries
	 * on the page; default behaviour assumes `'GBP'` if missing.
	 */
	rate: number;
	/** Decimal places to show. JPY/KRW = 0, most others = 2. Default `2`. */
	decimals?: number;
}

export interface CurrencyPickerProps {
	/**
	 * The full currency list — order drives dropdown order. The first
	 * entry's `code` is treated as the canonical base for rate maths.
	 */
	currencies: CurrencyInfo[];
	/**
	 * Map of BCP-47 locale → ISO-4217 currency code. Used by the
	 * auto-detect path (`navigator.language`). Falls back to the
	 * base currency when the locale isn't mapped.
	 */
	localeToCurrency?: Record<string, string>;
	/**
	 * localStorage key used to persist the user's choice. Default:
	 * `'ap-currency'`. App-specific keys avoid colliding with other
	 * pickers on the same domain.
	 */
	storageKey?: string;
	/**
	 * Variant — purely cosmetic, controls the menu open direction:
	 *   `'footer'` (default) — opens UP. Pick for footer placements.
	 *   `'header'` — opens DOWN. Pick for header placements.
	 */
	variant?: 'footer' | 'header';
	/** Extra classes appended to the trigger button. */
	class?: string;
	/** Aria-label for the trigger. Default: `'Choose currency'`. */
	label?: string;
}
