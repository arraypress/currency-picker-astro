import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CurrencyPickerRaw from '../src/CurrencyPicker.astro';
import { defaultCurrencies, defaultLocaleMap } from '../src/presets';
import type { CurrencyPickerProps } from '../src/types';

const CurrencyPicker = CurrencyPickerRaw as Parameters<AstroContainer['renderToString']>[0];

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

async function render(props: Partial<CurrencyPickerProps> = {}): Promise<string> {
	const merged = {
		currencies: defaultCurrencies,
		localeToCurrency: defaultLocaleMap,
		...props,
	};
	return container.renderToString(CurrencyPicker, {
		props: merged as unknown as Record<string, unknown>,
	});
}

function getAttr(html: string, name: string): string | null {
	const valued = new RegExp(`\\s${name}="([^"]*)"`).exec(html);
	if (valued) return valued[1];
	return null;
}

describe('<CurrencyPicker>', () => {
	it('renders the trigger button with the base currency code', async () => {
		const html = await render();
		expect(html).toContain('data-cp-trigger');
		expect(html).toContain('data-cp-current');
		expect(html).toContain('>GBP<'); // first preset's code
	});

	it('renders one option per currency', async () => {
		const html = await render();
		const optionCount = (html.match(/data-cp-pick=/g) ?? []).length;
		expect(optionCount).toBe(defaultCurrencies.length);
	});

	it('marks the base currency as aria-selected="true"', async () => {
		const html = await render();
		expect(html).toMatch(/data-cp-pick="GBP"[^>]*aria-selected="true"/);
	});

	it('passes currencies through as CP_CURRENCIES', async () => {
		const html = await render();
		expect(html).toContain('CP_CURRENCIES');
		expect(html).toContain('"code":"GBP"');
		expect(html).toContain('"code":"USD"');
	});

	it('passes localeMap as CP_LOCALE_MAP', async () => {
		const html = await render({ localeToCurrency: { 'en-US': 'USD' } });
		expect(html).toContain('CP_LOCALE_MAP');
		expect(html).toContain('"en-US":"USD"');
	});

	it('passes storageKey as CP_STORAGE_KEY', async () => {
		const html = await render({ storageKey: 'wg-currency' });
		expect(html).toMatch(/CP_STORAGE_KEY\s*=\s*"wg-currency"/);
	});

	it('panel opens up for variant="footer"', async () => {
		const html = await render({ variant: 'footer' });
		expect(html).toContain('cp-panel--up');
		expect(html).not.toContain('cp-panel--down');
	});

	it('panel opens down for variant="header"', async () => {
		const html = await render({ variant: 'header' });
		expect(html).toContain('cp-panel--down');
		expect(html).not.toContain('cp-panel--up');
	});

	it('throws if currencies array is empty', async () => {
		await expect(render({ currencies: [] })).rejects.toThrow(/non-empty array/);
	});

	it('uses the first currency as the base for CP_BASE', async () => {
		const html = await render({
			currencies: [
				{ code: 'USD', symbol: '$', label: 'US Dollar', rate: 1.0 },
				{ code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.79 },
			],
		});
		expect(html).toMatch(/CP_BASE\s*=\s*"USD"/);
	});

	it('listbox role attached to the panel', async () => {
		const html = await render();
		expect(html).toMatch(/role="listbox"/);
	});

	it('emits the currencychange CustomEvent name', async () => {
		const html = await render();
		expect(html).toContain('currencychange');
	});

	it('wg:prices-updated listener is wired', async () => {
		const html = await render();
		expect(html).toContain("'wg:prices-updated'");
	});
});
