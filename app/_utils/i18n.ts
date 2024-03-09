import translationKO from "@/_locales/ko_KR/common.json"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  ko: translationKO,
}

// i18next 초기화
i18n
  .use(initReactI18next) // initReactI18next를 사용하여 react-i18next를 초기화
  .init({
    // i18next 설정
    resources,
    lng: "ko",
    fallbackLng: "ko",
    debug: process.env.NODE_ENV === "development",
    interpolation: { escapeValue: true },
    returnObjects: true,
    returnEmptyString: true,
    returnNull: true,
    // 다른 설정들...
  })

export default i18n
