"use client"

import { useNewPostStore } from "@/_store/newPost"

import { useTranslation } from "@/i18n/client"
import { useParams } from "next/navigation"
import { ReactNode } from "react"

export default function NewPostLayout({ children }: { children: ReactNode }) {
  const { title, description, setNewPost } = useNewPostStore()
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ type, payload: e.target.value })
  }
  return (
    <div className={"main"}>
      <div className={"editor"}>
        <section className={"styler-section"}>
          <h1>{t("enterTitle")}</h1>
          <input
            className={"title-input"}
            placeholder={t("enterTitle") + " " + t("required")}
            value={title ?? ""}
            onChange={(e) => onChangeInput(e, "title")}
          />
        </section>
        <section className={"styler-section"}>
          <h1>{t("enterDesc")}</h1>
          <input
            className={"description-input"}
            placeholder={t("enterDesc") + " " + t("optional")}
            value={description ?? ""}
            onChange={(e) => onChangeInput(e, "description")}
          />
        </section>
        {children}
      </div>
    </div>
  )
}
