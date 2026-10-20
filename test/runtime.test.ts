/**
 * The picker's inline script, run in a real DOM.
 *
 * `CurrencyPicker.test.ts` checks the rendered markup; these tests render the
 * component the same way, then load that HTML into jsdom with scripts enabled
 * so the client half runs as it would in a browser — locale detection, the
 * stored pick, and a click on an option.
 *
 * The accessible-name tests pin WCAG 2.5.3 (label in name): the trigger's
 * visible text is the current code, so its aria-label must contain that code
 * every time the code changes, not only on first render.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import CurrencyPickerRaw from '../src/CurrencyPicker.astro';
import { defaultCurrencies, defaultLocaleMap } from '../src/presets';
import type { CurrencyPickerProps } from '../src/types';

const CurrencyPicker = CurrencyPickerRaw as Parameters<AstroContainer['renderToString']>[0];

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

interface MountOptions {
	props?: Partial<CurrencyPickerProps>;
	/** `navigator.language` — drives auto-detection. */
	language?: string;
	/** localStorage entries set before the script runs. */
	storage?: Record<string, string>;
}

async function mount({ props = {}, language = 'en-GB', storage = {} }: MountOptions = {}) {
	const html = await container.renderToString(CurrencyPicker, {
		props: {
			currencies: defaultCurrencies,
			localeToCurrency: defaultLocaleMap,
			...props,
		} as unknown as Record<string, unknown>,
	});
	/* Scripts run during parsing, so the window has to be configured before
	 * the markup arrives: build an empty page, set it up, then write the HTML. */
	const dom = new JSDOM('<!doctype html><html><body></body></html>', {
		url: 'https://shop.example/',
		runScripts: 'dangerously',
	});
	const { window } = dom;
	await new Promise<void>((resolve) => {
		if (window.document.readyState === 'complete') resolve();
		else window.addEventListener('load', () => resolve());
	});
	Object.defineProperty(window.navigator, 'language', { value: language, configurable: true });
	for (const [k, v] of Object.entries(storage)) window.localStorage.setItem(k, v);
	/* A <script> inserted by innerHTML never runs, so recreate each one. */
	window.document.body.innerHTML = html;
	window.document.querySelectorAll('script').forEach((old) => {
		const s = window.document.createElement('script');
		s.textContent = old.textContent;
		old.replaceWith(s);
	});
	const doc = window.document;
	return {
		window,
		doc,
		trigger: () => doc.querySelector('[data-cp-trigger]')!,
		pick: (code: string) => (doc.querySelector(`[data-cp-pick="${code}"]`) as HTMLElement).click(),
		selected: () => Array.from(doc.querySelectorAll('[data-cp-pick][aria-selected="true"]')).map((el) => el.getAttribute('data-cp-pick')),
	};
}

describe('<CurrencyPicker> — accessible name (WCAG 2.5.3)', () => {
	it('starts the server-rendered name with the visible base code', async () => {
		const html = await container.renderToString(CurrencyPicker, {
			props: { currencies: defaultCurrencies } as unknown as Record<string, unknown>,
		});
		expect(html).toMatch(/aria-label="GBP, Choose currency"/);
	});

	it('names the trigger after the detected currency', async () => {
		const { trigger } = await mount({ language: 'en-US' });
		expect(trigger().querySelector('[data-cp-current]')!.textContent).toBe('USD');
		expect(trigger().getAttribute('aria-label')).toBe('USD, Choose currency');
	});

	it('names the trigger after a stored pick', async () => {
		const { trigger } = await mount({ storage: { 'ap-currency': 'JPY' } });
		expect(trigger().getAttribute('aria-label')).toBe('JPY, Choose currency');
	});

	it('renames the trigger when the visitor picks a currency', async () => {
		const { trigger, pick } = await mount();
		expect(trigger().getAttribute('aria-label')).toBe('GBP, Choose currency');
		pick('EUR');
		expect(trigger().querySelector('[data-cp-current]')!.textContent).toBe('EUR');
		expect(trigger().getAttribute('aria-label')).toBe('EUR, Choose currency');
	});

	it('uses the label prop as the purpose after the code', async () => {
		const { trigger, pick } = await mount({ props: { label: 'Choose display currency' } });
		pick('CAD');
		expect(trigger().getAttribute('aria-label')).toBe('CAD, Choose display currency');
	});

	/* With no purpose the visible code alone is the name, so no aria-label is
	 * needed at all — and none is written later. */
	it('leaves the trigger named by its code when label is empty', async () => {
		const { trigger, pick } = await mount({ props: { label: '' } });
		expect(trigger().hasAttribute('aria-label')).toBe(false);
		pick('USD');
		expect(trigger().hasAttribute('aria-label')).toBe(false);
	});

	/* A header and a footer picker can carry different labels; each keeps its own. */
	it('keeps each trigger\'s own label when several are on the page', async () => {
		const first = await container.renderToString(CurrencyPicker, {
			props: { currencies: defaultCurrencies, label: 'Header currency' } as unknown as Record<string, unknown>,
		});
		const { doc, pick } = await mount({ props: { label: 'Footer currency' } });
		doc.body.insertAdjacentHTML('afterbegin', first.replace(/<script[\s\S]*?<\/script>/g, ''));
		doc.dispatchEvent(new doc.defaultView!.Event('astro:page-load'));
		pick('SEK');
		const names = Array.from(doc.querySelectorAll('[data-cp-trigger]')).map((t) => t.getAttribute('aria-label'));
		expect(names).toEqual(['SEK, Header currency', 'SEK, Footer currency']);
	});
});

describe('<CurrencyPicker> — selected option', () => {
	it('marks the detected currency as selected', async () => {
		const { selected } = await mount({ language: 'de-DE' });
		expect(selected()).toEqual(['EUR']);
	});

	it('moves aria-selected to the picked option', async () => {
		const { selected, pick } = await mount();
		expect(selected()).toEqual(['GBP']);
		pick('AUD');
		expect(selected()).toEqual(['AUD']);
	});
});
