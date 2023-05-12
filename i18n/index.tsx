import { Dictionary, I18N } from "../module/src/types";

// @ts-ignore
import de from "./translations.de.yaml";
//  @ts-ignore
import en from "./translations.en.yaml";

const i18n = {
  translations: {
    en: en.i18n as Dictionary,
    de: de.i18n as Dictionary,
  },
  defaultLang: "de",
  useBrowserDefault: true,
} as I18N;

export { i18n };
