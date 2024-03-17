"use client"

import { getUser } from "@/_queries/user"

import { NewPostStates, useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { PostContentType, PostFormatType, PostType } from "@/_types/post"
import { useState } from "react"

import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastError, toastSuccess } from "@/_data/toast"
import { posting } from "@/_queries/newPost"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { randomNum } from "@/_utils/math"
import { checkNewPost, generatePostData } from "@/_utils/post"
import classNames from "classNames"
import { useTranslation } from "react-i18next"
import Preview from "./Preview"
import ThumbnailStyle from "./ThumbnailStyle"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const options = [{ value: "editing" }, { value: "secret" }, { value: "default" }]

export default function RendingSection() {
  const queryClient = useQueryClient()
  const { t } = useTranslation(["newPost", "modal"])
  const { t: message } = useTranslation(["messages"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
    queryFn: getUser,
  })

  const { modalStatus, setModal, setError } = useMainStore()
  const { content, postId, type, thumbnail, title, description, format, count, setNewPost, setStatus } =
    useNewPostStore()
  const [previewPost, setPreviewPost] = useState<PostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)
  const newPost: NewPostStates = {
    postId,
    type,
    thumbnail,
    title,
    description,
    format,
    count,
    content,
  }

  const sendNewPostError = (type: ErrorTypes | null) => {
    if (!type) return
    setError({ type, text: errorMessage[type] })
    toastError(message(`error.${type}`))
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onClickOption = (format: PostFormatType) => {
    setNewPost({ type: "format", payload: format })
  }

  const preview = () => {
    if (!userData?.user) return
    const user = userData.user
    const createPost: PostType = {
      ...generatePostData({ newPost }),
      count: randomNum(40, 200),
      comments: [],
      user,
      format: "preview",
      type: newPost.type as PostContentType,
      popular: 0,
      postId: "preview",
      createdAt: new Date(),
      lastPlayedAt: new Date(),
    }

    switch (createPost.type) {
      case "polling":
        createPost.content.candidates = createPost.content.candidates.map((v: any) => ({
          ...v,
          pick: randomNum(20, 100),
        }))
        setPreviewPost(createPost)
        break

      case "contest":
        createPost.content.candidates[0].pick = randomNum(20, 100)
        createPost.content.candidates[1].pick = randomNum(20, 100)
        setPreviewPost(createPost)
        break

      case "tournament":
        createPost.content.candidates = createPost.content.candidates.map((v: any) => {
          // total : 100 기준
          const random = randomNum(10, 100)
          return {
            ...v,
            pick: randomNum(0, 50),
            win: random,
            lose: 100 - random,
          }
        })
        setPreviewPost(createPost)
        break

      default:
        return
    }

    setIsOnPreview(true)
  }

  const validate = async (type: "preview" | "posting") => {
    const check = checkNewPost(newPost)
    if (check) return sendNewPostError(check)

    switch (true) {
      case type === "preview":
        preview()
        break

      case type === "posting":
        if (!userData?.user) {
          toastSuccess(message("error.login"))
          return
        } else {
          const createPost = generatePostData({ newPost })
          await posting(createPost).then(async () => {
            if (createPost.type === "none") return
            toastSuccess(message("success.posting"))
            if (createPost.format !== "editing") {
              setModal("createPost")
            }
            await queryClient.invalidateQueries({ queryKey: queryKey.posts.user })
            await queryClient.invalidateQueries({ queryKey: queryKey.posts.all })
            await queryClient.invalidateQueries({ queryKey: queryKey.posts[createPost.type] })
            await queryClient.invalidateQueries({ queryKey: queryKey.post(createPost.postId) })
          })
        }
        break

      default:
        toastError(message(`error.unknown`))
        break
    }
  }

  const onClickConfirm = (isOk: boolean) => {
    if (isOk) {
      window.open(`/post/${newPost.type}/${postId}`)
    }
    setModal("none")
  }

  return (
    <>
      <div className={cx(style.rending)}>
        <section className={cx(style["rending-section"], style["thumbnail-section"])}>
          <h1>{t("changeThumb")}</h1>
          <ThumbnailStyle />
        </section>

        <section className={cx(style["rending-section"], style["options-section"])}>
          <h1>{t("optionsTitle")}</h1>
          <div className={cx(style.options)}>
            {options.map(({ value }) => (
              <button
                key={value}
                onClick={() => onClickOption(value as PostFormatType)}
                className={cx(style.option, { [style.active]: format === value })}
              >
                <span>{t(`options.${value}`)}</span>
                <div className={cx(style.circle)}>
                  <div className={cx(style["circle-inner"])}></div>
                </div>
              </button>
            ))}
          </div>
        </section>
        <div className={cx(style.finish)}>
          <div className={cx(style["btn-wrapper"])}>
            <button onClick={() => validate("preview")}>
              <span>{t("preview")}</span>
            </button>
            <button onClick={() => validate("posting")}>
              <span>{t("posting")}</span>
            </button>
          </div>
        </div>
      </div>
      {previewPost && isOnPreview && <Preview previewPost={previewPost} setIsOnPreview={setIsOnPreview} />}
      {modalStatus === "createPost" && (
        <Confirm title={t("createPost", { ns: "modal" })} onClickConfirm={onClickConfirm} />
      )}
    </>
  )
}