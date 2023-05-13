import { setLanguageInLocalStorage } from './setLanguageInLocalStorage';

const mockDispatchEvent = jest.fn();
const mockLocalStorageSet = jest.fn();

describe('setLanguageInLocalStorage', () => {

  beforeEach(() => {
    window.dispatchEvent = mockDispatchEvent;
    window.localStorage.setItem = mockLocalStorageSet;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set language in localStorage', () => {
    const lang = 'en';

    setLanguageInLocalStorage(lang);

    expect(mockLocalStorageSet).toHaveBeenCalledWith('lang', lang);
  });

  test('should dispatch the "localStorageLangChange" event', () => {
    const lang = 'en';
    const eventType = 'localStorageLangChange';

    setLanguageInLocalStorage(lang);

    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent.mock.calls[0][0].type).toBe(eventType);
  });
});
