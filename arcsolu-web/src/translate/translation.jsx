import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";
import zh from "./zh.json";
import es from "./es.json";
import ja from "./ja.json";
import ko from "./ko.json";
import de from "./de.json";
import it from "./it.json";
import pt from "./pt.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
    es: {
      translation: es,
    },
    ko: {
      translation: ko,
    },
    zh: {
      translation: zh,
    },
    ja: {
      translation: ja,
    },
    de: {
      translation: de,
    },
    it: {
      translation: it,
    },
    pt: {
      translation: pt,
    },
  },
  lng: "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
