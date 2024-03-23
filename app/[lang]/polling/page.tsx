import ContentPage from "@/_pages/ContentPage"
import { LangType } from "@/_types"
import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { Suspense } from "react"

export async function generateMetadata({ params: { lang } }: { params: { lang: LangType } }) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["posts-page"])
  return {
    title: t("polling"),
  }
}

const PollingPage = () => {
  return (
    <Suspense>
      <ContentPage query="polling" />
    </Suspense>
  )
}

export default PollingPage
