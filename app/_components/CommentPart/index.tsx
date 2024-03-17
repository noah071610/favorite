"use client"

import { queryKey } from "@/_data"
import { toastSuccess } from "@/_data/toast"
import { useCommentMutation } from "@/_hooks/mutations/useCommentMutation"
import { getUser } from "@/_queries/user"
import { CommentType } from "@/_types/post"
import { UserQueryType, UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ko" // 한국어 로케일 설정
import { useParams } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import TextareaAutosize from "react-textarea-autosize"

const formattedDate = (date: any) => dayjs(date).locale("ko").format("YYYY년MM월DD일")

function Comment({ user, text, authorId }: { user?: UserType; text: string; authorId: number }) {
  const { t } = useTranslation(["common"])
  return (
    <div className={"comment-area-wrapper"}>
      <div className={"inner"}>
        <div className={"name-space"}>
          <span className={"name"}>{user?.userName ?? t("anonymous")}</span>
          <span className={"date"}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={"author"}>{t("author")}</span>}
        </div>
        <div className={"content"}>
          <p className={"text"}>{text}</p>
        </div>
      </div>
    </div>
  )
}

function Commenting({ authorId, isPreview }: { authorId: number; isPreview: boolean }) {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
    queryFn: getUser,
  })
  const { t } = useTranslation(["common"])
  const { t: message } = useTranslation(["messages"])
  const user = userData?.user
  const { postId } = useParams()

  const [isFocused, setIsFocused] = useState(false)
  const [displayBtn, setDisplayBtn] = useState(false)
  const [text, setText] = useState("")
  const handleChange = (event: any) => {
    setText(event.target.value)
  }
  const commented = () => {
    toastSuccess(message("success.commenting"))
    setText("")
    setIsFocused(false)
    setDisplayBtn(false)
  }

  const { mutate } = useCommentMutation(commented)

  const onClickCommenting = async () => {
    if (!!text.trim() && !isPreview) {
      mutate({
        userId: user?.userId ?? 1,
        postId: postId as string,
        userName: user?.userName ?? t("anonymous"),
        text,
      })
    }
  }

  return (
    <div className={"comment-area-wrapper"}>
      <div className={`inner ${isPreview ? "preview" : ""}`}>
        <div className={"name-space"}>
          <span className={"name"}>{user?.userName ?? t("anonymous")}</span>
          <span className={"date"}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={"author"}>{t("author")}</span>}
        </div>
        <div className={"commenting"}>
          <div className={`input ${isFocused ? "focus" : ""}`}>
            <TextareaAutosize
              value={text}
              onChange={handleChange}
              onFocus={() => {
                setIsFocused(true)
                setDisplayBtn(true)
              }}
              onBlur={() => setIsFocused(false)}
            />
            <div className={"border"} />
          </div>
          <div className={`commenting-btn ${displayBtn ? "focus" : ""}`}>
            <div className={"inner"}>
              <button
                onClick={() => {
                  setIsFocused(false)
                  setDisplayBtn(false)
                }}
                className={"cancel"}
              >
                {t("cancel")}
              </button>
              <button onClick={onClickCommenting} className={"submit"}>
                {t("comment")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentPart({
  authorId,
  comments,
  isPreview,
}: {
  authorId: number
  comments: CommentType[]
  isPreview: boolean
}) {
  return (
    <div className={"global-comment-part"}>
      <Commenting authorId={authorId} isPreview={isPreview} />
      <section className={"comment-list"}>
        {comments.map(({ text, user: commentUser }, index) => (
          <Comment authorId={authorId} text={text} key={`comment_${index}`} user={commentUser} />
        ))}
      </section>
    </div>
  )
}
