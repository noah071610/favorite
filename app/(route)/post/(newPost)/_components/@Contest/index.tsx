"use client"

import { useNewPostStore } from "@/_store/newPost"

import classNames from "classNames"
import Dropzone from "../../../../../_components/Dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestContent() {
  const { newPost, candidates, setNewPost } = useNewPostStore()

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ type, payload: e.target.value })
  }

  return (
    candidates.length > 0 && (
      <div className={"main"}>
        <div className={cx("editor")}>
          <section className={cx("styler-section")}>
            <h1>제목 입력</h1>
            <input
              className={"title-input"}
              placeholder="제목 입력"
              value={newPost.title ?? ""}
              onChange={(e) => onChangeInput(e, "title")}
            />
          </section>
          <section className={cx("styler-section")}>
            <h1>설명 입력</h1>
            <input
              className={"description-input"}
              placeholder="설명 입력 (옵션)"
              value={newPost.description ?? ""}
              onChange={(e) => onChangeInput(e, "description")}
            />
          </section>
          <section className={cx("styler-section")}>
            <h1>후보 입력</h1>
            <div className={cx(style.candidates)}>
              {(["left", "right"] as Array<"left" | "right">).map((dr, i) => (
                <div key={dr} className={cx(style["candidate-wrapper"])}>
                  <Dropzone index={i} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  )
}
