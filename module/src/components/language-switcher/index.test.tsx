/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import LanguageSwitcher from './index';

import { setRouterQuery } from '../../utils/setRouterQuery';
import { setLanguageInLocalStorage } from '../../utils/setLanguageInLocalStorage';

jest.mock('../../utils/setRouterQuery');
jest.mock('../../utils/setLanguageInLocalStorage');

jest.mock('../../../../i18n/index', () => {
	return {
		__esModule: true,
		i18n: {
			translations: {
				mock: {
					string: 'mock',
					arr: [1, 2, 3],
					obj: { key: 'valueMock' },
					levelOne: { levelOneString: 'levelOneMock' },
				},
			},
			defaultLang: 'mock',
		},
	};
});

jest.mock('next/router', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		};
	},
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
const push = jest.fn();
const router = { push };
useRouter.mockImplementation(() => (router));

jest.mock('../../hooks/use-selected-language', () => {
	return {
		__esModule: true,
		default: () => { },
	};
});

const useSelectedLanguage = jest.spyOn(
	require('../../hooks/use-selected-language'),
	'default'
);

beforeEach(() => {
  useSelectedLanguage.mockImplementation(() => ({
    lang: 'mock',
  }));
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

function getQuery(lang: string) {
  return { lang }
}

describe('The LanguageSwitcher Component ', () => {
	it('is rendered to the document', async () => {
		const lang = 'languageKey';

		render(<LanguageSwitcher lang={lang} />);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		expect(component).toBeInTheDocument();
	});

	it('updates the language param with the passed param on click', async () => {
		const lang = 'languageKey';
    const shallow = false;

		render(<LanguageSwitcher lang={lang} />);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		await userEvent.click(component);

		expect(setRouterQuery).toHaveBeenCalledWith({ router, query: getQuery(lang), shallow });
	});

	it('updates the language param with the passed param on click and uses shallow routing if shall is passed', async () => {
		const lang = 'languageKeyShallow';
    const shallow = true;

		render(<LanguageSwitcher lang={lang} shallow={shallow} />);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		await userEvent.click(component);

    expect(setRouterQuery).toHaveBeenCalledWith({ router, query: getQuery(lang), shallow });
	});
});

describe('The LanguageSwitcher Component takes the children prop and ', () => {
	it('is rendered to the document', async () => {
		const lang = 'languageKey';

		render(
			<LanguageSwitcher lang={lang}>
				<span>
					<span>child</span>
				</span>
			</LanguageSwitcher>
		);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		expect(component).toContainElement(screen.queryByText('child'));
	});

	it('updates the language param with the passed param on click', async () => {
		const lang = 'languageKey';

		render(
			<LanguageSwitcher lang={lang}>
				<span>
					<span>child</span>
				</span>
			</LanguageSwitcher>
		);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		await userEvent.click(component);

    expect(setRouterQuery).toHaveBeenCalledWith({ router, query: getQuery(lang), shallow: false });
	});

	it('updates the language param with the passed param on click and preserves an onClick handler', async () => {
		const lang = 'languageKey';
		const mySpy = jest.fn();

		render(
			<LanguageSwitcher lang={lang}>
				<span onClick={() => mySpy()}>
					<span>child</span>
				</span>
			</LanguageSwitcher>
		);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		await userEvent.click(component);

		expect(mySpy).toHaveBeenCalled();
    expect(setRouterQuery).toHaveBeenCalledWith({ router, query: getQuery(lang), shallow: false });
	});

	it('updates the language param with the passed param on click and uses shallow routing if shall is passed', async () => {
		const lang = 'languageKeyShallow';

		render(
			<LanguageSwitcher lang={lang} shallow={true}>
				<span>
					<span>child</span>
				</span>
			</LanguageSwitcher>
		);

		const component = await screen.findByRole('button', {
			name: `set language to ${lang}`,
		});

		await userEvent.click(component);

    expect(setRouterQuery).toHaveBeenCalledWith({ router, query: getQuery(lang), shallow: true });
	});
});
