"use client"

import Confirm from "@/_components/Confirm"
import Pagination from "@/_components/Pagination"
import PostCard from "@/_components/PostCard"
import { queryKey } from "@/_data"
import { toastError, toastSuccess } from "@/_data/toast"
import { deletePost, initNewPost } from "@/_queries/newPost"
import { getAllUserSaveCount, getUserPosts } from "@/_queries/posts"
import { getUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { LangType } from "@/_types"
import { PostCardType } from "@/_types/post"
import { UserQueryType } from "@/_types/user"
import { useTranslation } from "@/i18n/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import Image from "next/image"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"
import UserPageLoading from "../loading"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function UserPageSuspense() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page", "messages"])
  const searchParams = useSearchParams()
  const { replace, push } = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const cursor = searchParams.get("cursor")
  const [targetPost, setTargetPost] = useState<null | PostCardType>(null)
  const { userId: queryUserId } = useParams()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const [loadingNewPostCreate, setLoadingNewPostCreate] = useState(false)

  const user = userData?.user

  const { modalStatus, setModal } = useMainStore()

  const { data: postCount } = useQuery<number>({
    queryKey: queryKey.posts.count("user"),
    queryFn: getAllUserSaveCount,
    enabled: !!(user?.userId === parseInt(queryUserId as string)),
  })

  const { data: userPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.posts.user(cursor ?? "0"),
    queryFn: () => getUserPosts(cursor ?? "0"),
    enabled: !!(user?.userId === parseInt(queryUserId as string)),
  })

  const onClickUserPageBtn = (type: "delete" | "edit", target: PostCardType) => {
    if (type === "delete") {
      setModal("deletePost")
      setTargetPost(target)
    } else {
      if (user?.userId) {
        push(`/post/edit/${target.postId}`)
      } else {
        toastError(t("error.unknown", { ns: "messages" }))
      }
    }
  }

  const onClickConfirmDelete = async (isOk: boolean) => {
    if (isOk && targetPost) {
      await deletePost(targetPost.postId)
      await queryClient.invalidateQueries({
        predicate: (target) =>
          target.queryKey.includes("allPosts") ||
          target.queryKey.includes(`${targetPost.type}Posts`) ||
          target.queryKey.includes(`userPosts`),
      })

      const cachedCounts = queryClient.getQueriesData({
        predicate: (target) =>
          target.queryKey.includes("allCount") ||
          target.queryKey.includes(`${targetPost.type}Count`) ||
          target.queryKey.includes(`userCount`),
      })
      await Promise.allSettled(
        cachedCounts.map(async (targetKey) => {
          await queryClient.setQueryData(targetKey[0], (old: number) => {
            if (!old) return
            return old - 1
          })
        })
      )

      toastSuccess(t("success.delete", { ns: "messages" }))
    }
    setTargetPost(null)
    setModal("none")
  }

  const onClickCreateNewPost = async () => {
    if (user?.userId) {
      setLoadingNewPostCreate(true)
      await initNewPost(lang as LangType)
        .then(async (postId) => {
          await queryClient.invalidateQueries({
            predicate: (target) => target.queryKey.includes("userPosts") || target.queryKey.includes("userCount"),
          })
          push(`/post/edit/${postId}`)
        })
        .catch(() => {
          setLoadingNewPostCreate(false)
        })
    }
  }

  const setQuery = useCallback(
    (_cursor: number = 0) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      current.set("cursor", String(_cursor))
      const search = current.toString()
      const query = search ? `?${search}` : ""

      replace(`${pathname}${query}`)
    },
    [pathname, replace, searchParams]
  )

  const handlePageClick = (event: any) => {
    setQuery(event.selected)
  }

  useEffect(() => {
    if (userData?.msg === "no") {
      push("/")
    }
  }, [push, userData])

  useEffect(() => {
    if (!cursor) {
      setQuery(0)
    }
  }, [cursor, setQuery])

  return (
    <>
      {typeof userPosts !== "undefined" && user && !loadingNewPostCreate ? (
        <div className={cx(style["user-page"])}>
          <div className={cx(style.inner)}>
            <div className={style["profile"]}>
              <div className={style["user-icon"]}>
                <div style={{ backgroundColor: user.color }} className={style["icon"]}>
                  <span>{user.userName.slice(0, 1)}</span>
                </div>
              </div>
              <div className={style["user-info"]}>
                <span>{user.userName}</span>
              </div>
            </div>
            <div className={cx(style.grid)}>
              <button onClick={onClickCreateNewPost} className={cx(style["create-new"])}>
                <div className={cx(style["create-new-inner"])}>
                  <div className={cx(style["create-new-content"])}>
                    <div className={cx(style["image-wrapper"])}>
                      <Image width={35} height={35} alt="writing_emoji" src="/images/emoji/writing.png" />
                    </div>
                    <span>{t("createNewPost", { ns: "new-post-page" })}</span>
                  </div>
                </div>
              </button>
              {userPosts?.map((v) => (
                <PostCard key={v.postId} onClickUserPageBtn={onClickUserPageBtn} isUserPage={true} postCard={v} />
              ))}
            </div>
            {!!userPosts && typeof postCount === "number" && (
              <Pagination
                cursor={cursor}
                handlePageClick={handlePageClick}
                itemsPerPage={11}
                postCount={postCount <= 0 ? 1 : postCount}
              />
            )}
          </div>
        </div>
      ) : (
        <UserPageLoading />
      )}
      {modalStatus === "deletePost" && <Confirm onClickConfirm={onClickConfirmDelete} title={t("deletePostMessage")} />}
    </>
  )
}

export default function UserPage() {
  return (
    <Suspense fallback={<UserPageLoading />}>
      <UserPageSuspense />
    </Suspense>
  )
}
