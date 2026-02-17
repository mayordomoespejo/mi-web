import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./translations/es";
import en from "./translations/en";

const STORAGE_KEY = "lang";
const supportedLanguages = ["es", "en"];

const detectLanguage = () => {
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = navigator.language?.split("-")[0];
  if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  return "es";
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en }
  },
  lng: detectLanguage(),
  fallbackLng: "es",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false
  }
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
