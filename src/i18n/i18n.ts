import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // This fetches the JSON files from your public folder via HTTP
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    backend: {
      // Path to your public folder files
      loadPath: "/locales/{{lng}}.json",
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
