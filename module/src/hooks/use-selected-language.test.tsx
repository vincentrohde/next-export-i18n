/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from '@testing-library/react';
import useSelectedLanguage from './use-selected-language';
import { LanguageDataStore } from '../enums/languageDataStore';

const mockConfig = {
  translations: {
    mock: { title: 'mock' },
    foo: { title: 'bar' },
  },
  defaultLang: 'mock',
  useBrowserDefault: true,
}

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		};
	},
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('Query: The hook returns ', () => {
  beforeAll(() => {
    jest.spyOn(require('./../index'), 'i18n').mockReturnValue({
      ...mockConfig,
      languageDataStore: LanguageDataStore.QUERY
    })
  })

	it(`the default language if there is no router query object  `, async () => {
		useRouter.mockImplementation(() => ({
			query: {},
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('mock');
	});

	it(`the language from the router query object  `, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('foo');
	});

	it(`the updated language if the router query object changes`, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result: firstResult } = renderHook(() => useSelectedLanguage());
		expect(firstResult.current.lang).toBe('foo');

		useRouter.mockImplementation(() => ({
			query: { lang: 'bar' },
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('mock');
	});
});

describe('Local Storage: The hook returns ', () => {
  beforeAll(() => {
    jest.spyOn(require('./../index'), 'i18n').mockReturnValue({
      ...mockConfig,
      languageDataStore: LanguageDataStore.LOCAL_STORAGE
    })
  })

  it(`the default language if there is no router query object  `, async () => {
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe('mock');
  });

  it(`the language from the local storage object `, async () => {
    window.localStorage.setItem('lang', 'foo');
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe('foo');
  });

  it(`the updated language if the localStorage prop changes`, async () => {
    window.localStorage.setItem('lang', 'foo');
    const { result: firstResult } = renderHook(() => useSelectedLanguage());
    expect(firstResult.current.lang).toBe('foo');

    window.localStorage.setItem('lang', 'mock');
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe('mock');
  });
});
