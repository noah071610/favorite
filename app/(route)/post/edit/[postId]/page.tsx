"use client"

import { NewPostStates, useNewPostStore } from "@/_store/newPost"
import "@/_styles/components/global-newPost.scss"

import RendingSection from "./_components/RendingSection"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { queryKey } from "@/_data"
import { toastError } from "@/_data/toast"
import { getSavePost } from "@/_queries/newPost"
import { UserQueryType } from "@/_types/user"
import { handleBeforeUnload } from "@/_utils/post"
import { useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import InitSection from "./_components/InitSection"

const PollingContent = dynamic(() => import("./_components/@Polling"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const ContestContent = dynamic(() => import("./_components/@Contest"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const TournamentContent = dynamic(() => import("./_components/@Tournament"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})

export default function NewPostEditPage() {
  const { t } = useTranslation(["modal"])
  const { postId } = useParams()
  const [editPostStatus, setEditPostStatus] = useState<"pending" | "ready">("pending")

  const router = useRouter()
  const { loadNewPost, content, type, thumbnail, title, description, format, count } = useNewPostStore()
  const newPost: NewPostStates = {
    postId: postId as string,
    type,
    thumbnail,
    title,
    description,
    format,
    count,
    content,
  }
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })

  useEffect(() => {
    const handleBeforeUnloadCallback = (e: any) => {
      handleBeforeUnload(newPost, e)
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    }
  }, [newPost])

  useEffect(() => {
    if (userData?.msg === "ok" && editPostStatus === "pending") {
      !(async function () {
        await getSavePost(postId as string)
          .then((content) => {
            loadNewPost(content)
            setEditPostStatus("ready")
          })
          .catch(() => {
            router.push("/")
            toastError(t("error.unknown", { ns: "messages" }))
          })
      })()
    }
    if (userData?.msg === "no") {
      router.push("/")
      toastError(t("error.unknown", { ns: "messages" }))
    }
  }, [editPostStatus, userData?.msg])

  return editPostStatus === "ready" ? (
    <div className="global-new-post-page">
      {/* EDIT & RESULT SECTION */}
      {content.newPostStatus === "init" && <InitSection />}
      {content.newPostStatus === "edit" && (
        <>
          {type === "polling" && <PollingContent />}
          {type === "contest" && <ContestContent />}
          {type === "tournament" && <TournamentContent />}
        </>
      )}

      {/* RENDING SECTION */}
      {content.newPostStatus === "rending" && <RendingSection />}
    </div>
  ) : (
    <>
      <FavoriteLoading type="content" />
    </>
  )
}
