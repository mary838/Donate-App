import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON translation files
import en from "./locales/en.json";
import km from "./locales/km.json";
import zh from "./locales/zh.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
    zh: { translation: zh },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback if key missing
  interpolation: { escapeValue: false },
});

export default i18n;
