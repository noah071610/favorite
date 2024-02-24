"use client"

import { useNewPostStore } from "@/_store/newPost"

import style from "@/(route)/post/contest/[postId]/_components/style.module.scss"
import PostInfo from "@/_components/PostInfo"
import { UserType } from "@/_types/user"
import classNames from "classNames"
import Dropzone from "./Dropzone"
const cx = classNames.bind(style)

export default function ContestContent({ user }: { user: UserType }) {
  const { newPost } = useNewPostStore()

  return (
    newPost && (
      <div className={cx(style["contest-post"])}>
        <div className={cx(["contest-post-inner"])}>
          <PostInfo title={newPost.title} description={newPost.description} user={user} isEdit={true} />
          <div style={{ overflow: "hidden" }} className={cx(style.content)}>
            {(["left", "right"] as Array<"left" | "right">).map((dr) => (
              <div key={dr} className={cx(style[dr])}>
                <Dropzone direction={dr} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  )
}
