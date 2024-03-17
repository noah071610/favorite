"use client"

import { useNewPostStore } from "@/_store/newPost"

import Dropzone from "@/_components/Dropzone"
import NewPostLayout from "@/_components/NewPostLayout"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestContent() {
  const { t } = useTranslation(["newPost"])
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
