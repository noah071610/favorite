"use client"

import { getUser } from "@/_queries/user"
import { CommentType } from "@/_types/post/post"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Comment({ user, text }: { user: UserType; text: string }) {
  return (
    <div className={cx(style["comment-area-wrapper"])}>
      <div className={cx(style["profile"])}>
        <div className={cx(style["user-image"])}>
          <img src={user.userImage} alt={`user_image_${user.userId}`} />
        </div>
      </div>
      <div className={cx(style["inner"])}>
        <div className={cx(style["name-space"])}>
          <span className={cx(style.name)}>{user.userName}</span>
        </div>
        <div className={cx(style.content)}>
          <p className={cx(style["text"])}>{text}</p>
        </div>
      </div>
    </div>
  )
}

function Commenting() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={cx(style["comment-area-wrapper"])}>
      <div className={cx(style["profile"])}>
        <div className={cx(style["user-image"])}>
          <img className={cx({ focus: isFocused })} src={user ? user.userImage : ""} alt={`user_image`} />
        </div>
      </div>
      <div className={cx(style["inner"])}>
        <div className={cx(style["name-space"])}>
          <span className={cx(style.name)}>{user ? user.userName : "익명"}</span>
        </div>
        <div className={cx(style["commenting"])}>
          <div className={cx(style.input, { [style.focus]: isFocused })}>
            <TextareaAutosize onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
            <div className={cx(style.border)} />
          </div>
          <div
            style={{
              display: isFocused ? "flex" : "none",
            }}
            className={cx(style["commenting-btn"])}
          >
            <div className={cx(style["inner"])}>
              <button className={cx(style.cancel)}>취소</button>
              <button className={cx(style.submit)}>코멘트</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentPart({ comments }: { comments: CommentType[] }) {
  return (
    <div className={cx(style["comment-part"])}>
      <Commenting />
      <section className={cx(style["comment-list"])}>
        {comments.map(({ text, user: commentUser }, index) => (
          <Comment text={text} key={`comment_${index}`} user={commentUser} />
        ))}
      </section>
    </div>
  )
}
