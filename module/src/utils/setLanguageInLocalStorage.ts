export function setLanguageInLocalStorage(lang: string) {
  window.localStorage.setItem('lang', lang);
  const event = new Event('localStorageLangChange');
  window.dispatchEvent(event);
}
