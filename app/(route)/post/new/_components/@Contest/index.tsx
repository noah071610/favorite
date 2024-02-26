"use client"

import { useNewPostStore } from "@/_store/newPost"

import style from "@/(route)/post/contest/[postId]/_components/style.module.scss"
import PostInfo from "@/_components/PostInfo"
import classNames from "classNames"
import Dropzone from "./Dropzone"
import _style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestContent() {
  const { newPost } = useNewPostStore()

  return (
    newPost && (
      <div className={cx(style["contest-post"])}>
        <div className={cx(["contest-post-inner"])}>
          <PostInfo title={newPost.title} description={newPost.description} isEdit={true} />
          <div className={cx(_style.content)}>
            <section className={cx(_style.editor)}>
              {(["left", "right"] as Array<"left" | "right">).map((dr) => (
                <div key={dr} className={cx(_style[dr])}>
                  <Dropzone direction={dr} />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    )
  )
}
