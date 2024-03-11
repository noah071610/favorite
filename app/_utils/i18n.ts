import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import translationUS from "../../public/locales/en/translation.json"
import translationJA from "../../public/locales/ja/translation.json"
import translationKO from "../../public/locales/ko/translation.json"
import translationTH from "../../public/locales/th/translation.json"

const resources = {
  ko: translationKO,
  ja: translationJA,
  en: translationUS,
  th: translationTH,
}

// i18next 초기화
i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next) // initReactI18next를 사용하여 react-i18next를 초기화
  .init({
    // i18next 설정
    resources,
    lng: "ko",
    fallbackLng: "ko",
    // debug: process.env.NODE_ENV === "development",
    interpolation: { escapeValue: true },
    returnObjects: true,
    returnEmptyString: true,
    returnNull: true,
    // 다른 설정들...
  })

export default i18n
