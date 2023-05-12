/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from '@testing-library/react';
import useLanguageSwitcherIsActive from './use-language-switcher-is-active';
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

	it(`true if there is no query at the router and the param equals the default language `, async () => {
		useRouter.mockImplementation(() => ({
			query: null,
		}));
    const { result } = renderHook(() => useLanguageSwitcherIsActive('mock'));
		expect(result.current.isActive).toBe(true);
	});

	it(`false if there is no query at the router and the param does not equal the default language `, async () => {
		useRouter.mockImplementation(() => ({
			query: null,
		}));
		const { result } = renderHook(() => useLanguageSwitcherIsActive('foo'));
		expect(result.current.isActive).toBe(false);
	});

	it(`true if there is no language at the query and the param equals the default language `, async () => {
		useRouter.mockImplementation(() => ({
			query: {},
		}));
		const { result } = renderHook(() => useLanguageSwitcherIsActive('mock'));
		expect(result.current.isActive).toBe(true);
	});

	it(`false if there is no language at the query and the param does not equal the default language `, async () => {
		useRouter.mockImplementation(() => ({
			query: {},
		}));
		const { result } = renderHook(() => useLanguageSwitcherIsActive('foo'));
		expect(result.current.isActive).toBe(false);
	});

	it(`true if the router query equals the param `, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result } = renderHook(() => useLanguageSwitcherIsActive('foo'));
		expect(result.current.isActive).toBe(true);
	});

	it(`false if the router query does not equal the param`, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result } = renderHook(() => useLanguageSwitcherIsActive('bar'));
		expect(result.current.isActive).toBe(false);
	});
});

describe('Local Storage: The hook returns ', () => {
  beforeAll(() => {
    jest.spyOn(require('./../index'), 'i18n').mockReturnValue({
      ...mockConfig,
      languageDataStore: LanguageDataStore.LOCAL_STORAGE
    })
  })

  it(`true if there is no data at the local storage and the param equals the default language`, async () => {
    const { result } = renderHook(() => useLanguageSwitcherIsActive('mock'));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if there is no data at the local storage and the param does not equal the default language`, async () => {
    const { result } = renderHook(() => useLanguageSwitcherIsActive('foo'));
    expect(result.current.isActive).toBe(false);
  });

  it(`true if the local storage value equals the param`, async () => {
    window.localStorage.setItem('lang', 'foo');
    const { result } = renderHook(() => useLanguageSwitcherIsActive('foo'));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the local storage does not equal the param`, async () => {
    window.localStorage.setItem('lang', 'foo');
    const { result } = renderHook(() => useLanguageSwitcherIsActive('mock'));
    expect(result.current.isActive).toBe(false);
  });
});
