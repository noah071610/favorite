"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { editPost, posting } from "@/_queries/newPost"
import { PostContentType, PostType } from "@/_types/post/post"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { queryKey } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastError, toastSuccess } from "@/_data/toast"
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

export default function RendingSection() {
  const { t } = useTranslation(["newPost"])
  const { t: message } = useTranslation(["messages"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
    queryFn: getUser,
  })

  const pathname = usePathname()
  const { postId } = useParams()
  const isEditPage = pathname.includes("edit")
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setModal, modalStatus, setError } = useMainStore()
  const { newPost, candidates, content, setNewPost, clearNewPost, setStatus, thumbnail } = useNewPostStore()
  const [previewPost, setPreviewPost] = useState<PostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)

  const { mutate } = useMutation({
    mutationKey: isEditPage ? queryKey.new.edit : queryKey.new.create,
    mutationFn: isEditPage
      ? (newPost: { [key: string]: any }) => editPost(newPost)
      : (newPost: { [key: string]: any }) => posting(newPost),
    onMutate: async (newPost) => {
      const targetContentsKey = queryKey.home[newPost.type as PostContentType]
      await queryClient.invalidateQueries({ queryKey: queryKey.home.all })
      await queryClient.invalidateQueries({ queryKey: targetContentsKey })
    },
    onSuccess: async ({ data }) => {
      if (isEditPage) {
        await queryClient.invalidateQueries({ queryKey: queryKey.post(newPost.postId) })
        await queryClient.invalidateQueries({ queryKey: queryKey.user.posts })
        router.push(`/user/${userData?.user?.userId}`)
        toastSuccess(message("success.editing"))
      } else {
        localStorage.removeItem("favorite_save_data")
        setStatus("init")
        setModal("none")
        clearNewPost("all")
        toastSuccess(message("success.posting"))
        router.push("/")
      }
    },
    onError: () => {
      toastError(message(`error.unknown`))
    },
  })

  const sendNewPostError = (type: ErrorTypes | null) => {
    if (!type) return
    setError({ type, text: errorMessage[type] })
    toastError(message(`error.${type}`))
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onClickOption = (option: "isSecret") => {
    setNewPost({ type: "format", payload: option })
  }

  const preview = () => {
    const user = userData?.user
      ? userData.user
      : {
          userId: 1,
          userImage: "",
          userName: t("anonymous"),
        }
    const createPost = {
      ...generatePostData({
        newPost,
        content,
        candidates,
        thumbnail,
        user,
      }),
      format: "preview",
      count: randomNum(40, 200),
      comments: [],
      user,
      createdAt: new Date(),
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

  const validate = async (type: "preview" | "posting" | "editing") => {
    const check = checkNewPost(newPost, content, candidates, thumbnail)
    if (check) return sendNewPostError(check)

    switch (true) {
      case type === "preview":
        preview()
        break

      case type === "posting":
        if (userData) {
          if (!userData.user) {
            toastSuccess(message("success.loginNewPost"))
            setModal("loginNewPost")
          } else {
            const createPost = generatePostData({ newPost, content, candidates, thumbnail, user: userData.user })
            mutate(createPost)
          }
        }
        break

      case type === "editing" && typeof postId === "string" && typeof userData?.user?.userId === "number":
        const editPost = generatePostData({
          isEditPost: true,
          newPost,
          content,
          candidates,
          thumbnail,
          user: userData.user,
        })
        mutate(editPost)
        break

      default:
        toastError(message(`error.unknown`))
        break
    }
  }
  useEffect(() => {
    if (userData?.user && modalStatus === "newPostLoginSuccess") {
      const createPost = generatePostData({ newPost, content, candidates, thumbnail, user: userData.user })
      mutate(createPost)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStatus, userData, newPost, content, candidates, thumbnail])

  return (
    <>
      <div className={cx(style.rending)}>
        <section className={cx(style["rending-section"])}>
          <h1>{t("changeThumb")}</h1>
          <ThumbnailStyle />
        </section>
        <div className={cx(style.finish)}>
          <div className={cx(style.option, { [style.active]: newPost?.format === "secret" })}>
            <span>{t("secretContent")}</span>
            <button onClick={() => onClickOption("isSecret")} className={cx(style.bar)}>
              <div className={cx(style.circle)}></div>
            </button>
          </div>
          <div className={cx(style["btn-wrapper"])}>
            <button onClick={() => validate("preview")}>
              <span>{t("preview")}</span>
            </button>
            <button onClick={() => validate(isEditPage ? "editing" : "posting")}>
              <span>{isEditPage ? t("editing") : t("posting")}</span>
            </button>
          </div>
        </div>
      </div>
      {previewPost && isOnPreview && <Preview previewPost={previewPost} setIsOnPreview={setIsOnPreview} />}
    </>
  )
}
