"use server"

import { LangParamsType, LangType } from "@/_types"
import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import UserPageMain from "./_components"
import UserPageError from "./error"

export async function generateMetadata({ params: { lang } }: LangParamsType) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["meta"])
  return {
    title: t("dashboard"),
  }
}

export default async function UserPage({ params: { userId } }: { params: { lang: LangType; userId: string } }) {
  if (!userId || isNaN(parseInt(userId))) {
    return <UserPageError />
  }
  return <UserPageMain />
}
