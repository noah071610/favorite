"use client"

import { useNewPostStore } from "@/_store/newPost"

import style from "@/(route)/post/contest/[postId]/_components/style.module.scss"
import PostInfo from "@/_components/PostInfo"
import classNames from "classNames"
import Dropzone from "./Dropzone"
import _style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestContent() {
  const { newPost, candidates } = useNewPostStore()

  return (
    candidates.length > 0 && (
      <div className={cx(style["contest-post"])}>
        <div className={cx(["contest-post-inner"])}>
          <PostInfo title={newPost.title} description={newPost.description} isEdit={true} />
          <div className={cx(_style.content)}>
            <section className={cx(_style.editor)}>
              {(["left", "right"] as Array<"left" | "right">).map((dr, i) => (
                <div key={dr} className={cx(_style[dr])}>
                  <Dropzone index={i} />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    )
  )
}
