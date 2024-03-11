"use client"

import Confirm from "@/_components/Confirm"
import PostCard from "@/_components/PostCard"
import { API, queryKey } from "@/_data"
import { chartBackgroundColors } from "@/_data/chart"
import { toastError, toastSuccess } from "@/_data/toast"
import { deletePost } from "@/_queries/newPost"
import { getUserPosts } from "@/_queries/post"
import { useMainStore } from "@/_store/main"
import { PostCardType, PostContentType } from "@/_types/post/post"
import { UserQueryType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import UserPageError from "../error"
import UserPageLoading from "../loading"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function UserPageMain() {
  const { t } = useTranslation(["modal", "messages"])
  const queryClient = useQueryClient()
  const router = useRouter()
  const [targetPost, setTargetPost] = useState<null | PostCardType>(null)
  const { userId: queryUserId } = useParams()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })

  console.log(API.defaults.headers.common["Authorization"])

  const user = userData?.user
  const { mutate } = useMutation({
    mutationKey: queryKey.new.create,
    mutationFn: (targetPost: any) => deletePost(targetPost.postId),
    onMutate: async (targetPost) => {
      const targetContentsKey = queryKey.home[targetPost.type as PostContentType]
      await queryClient.cancelQueries({ queryKey: queryKey.home.all })
      await queryClient.cancelQueries({ queryKey: targetContentsKey })
      await queryClient.cancelQueries({ queryKey: queryKey.user.posts })
      ;[queryKey.home.all, targetContentsKey].forEach((key) => {
        queryClient.setQueryData(key, (old: any) => {
          if (!old) return undefined
          const flat = [...old.pages.flat()].filter((v) => v.postId !== targetPost.postId)

          return {
            ...old,
            pages: flat.reduce((acc: PostCardType[][], curr: PostCardType, index: number) => {
              if (index % 12 === 0) {
                acc.push([curr])
              } else {
                acc[acc.length - 1].push(curr)
              }
              return acc
            }, []),
          }
        })
      })

      queryClient.setQueryData(queryKey.user.posts, (old: PostCardType[]) => {
        if (!old) return undefined
        const filter = old.filter((v) => v.postId !== targetPost.postId)
        return filter
      })
    },
    onSuccess: async () => {
      toastSuccess(t("success.delete", { ns: "messages" }))
    },
  })

  const { modalStatus, setModal } = useMainStore()

  const { data: userPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.user.posts,
    queryFn: () => getUserPosts(),
    enabled: !!(user?.userId === parseInt(queryUserId as string)),
  })

  const onClickUserPageBtn = (type: "delete" | "edit", target: PostCardType) => {
    if (type === "delete") {
      setModal("deletePost")
      setTargetPost(target)
    } else {
      if (user?.userId) {
        router.push(`/post/edit/${target.postId}`)
      } else {
        toastError(t("error.unknown", { ns: "messages" }))
      }
    }
  }

  const onClickConfirm = (isOk: boolean) => {
    if (isOk) {
      mutate(targetPost)
    }
    setTargetPost(null)
    setModal("none")
  }

  return (
    <>
      {userData ? (
        !user ? (
          <UserPageError />
        ) : (
          <div className={cx(style["user-page"])}>
            <div className={cx(style.inner)}>
              <div className={style["profile"]}>
                <div className={style["user-icon"]}>
                  <div style={{ backgroundColor: chartBackgroundColors[1] }} className={style["icon"]}>
                    <span>{user.userName.slice(0, 1)}</span>
                  </div>
                </div>
                <div className={style["user-info"]}>
                  <span>{user.userName}</span>
                </div>
              </div>
              <div className={cx(style.grid)}>
                {userPosts?.map((v: PostCardType) => (
                  <PostCard onClickUserPageBtn={onClickUserPageBtn} isUserPage={true} key={v.postId} postCard={v} />
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <UserPageLoading />
      )}
      {modalStatus === "deletePost" && <Confirm onClickConfirm={onClickConfirm} title={t("deletePost")} />}
    </>
  )
}
