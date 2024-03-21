import { getTemplatePosts } from "@/_queries/posts"
import { LangParamsType, LangType } from "@/_types"
import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import TemplatePageContent from "./_components"

export async function generateMetadata({ params: { lang } }: LangParamsType) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["posts-page"])
  return {
    title: t("useTemplate"),
  }
}

const TemplatePage = async ({ params: { lang } }: LangParamsType) => {
  const templates = await getTemplatePosts(lang as LangType)
  return <TemplatePageContent templates={templates} />
}

export default TemplatePage
