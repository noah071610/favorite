"use client"

import { useNewPostStore } from "@/_store/newPost"

import Dropzone from "@/_components/Dropzone"
import NewPostLayout from "@/_components/NewPostLayout"
import { useTranslation } from "@/i18n/client"
import classNames from "classNames"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestContent() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const {
    content: { candidates },
  } = useNewPostStore()

  return (
    candidates.length > 0 && (
      <NewPostLayout>
        <section className={cx("styler-section")}>
          <h1>{t("enterCandidate")}</h1>
          <div className={cx(style.candidates)}>
            {(["left", "right"] as Array<"left" | "right">).map((dr, i) => (
              <div key={dr} className={cx(style["candidate-wrapper"])}>
                <Dropzone index={i} />
              </div>
            ))}
          </div>
        </section>
      </NewPostLayout>
    )
  )
}
