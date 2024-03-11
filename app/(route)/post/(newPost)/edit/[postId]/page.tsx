"use client"

import { useNewPostStore } from "@/_store/newPost"

import RendingSection from "../../_components/RendingSection"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { queryKey } from "@/_data"
import { toastError } from "@/_data/toast"
import { getPost } from "@/_queries/post"
import { ThumbnailType } from "@/_types/post/post"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const PollingContent = dynamic(() => import("../../_components/@Polling"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const ContestContent = dynamic(() => import("../../_components/@Contest"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const TournamentContent = dynamic(() => import("../../_components/@Tournament"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})

export default function NewPostEditPage() {
  const { t } = useTranslation(["modal"])
  const [editPostStatus, setEditPostStatus] = useState<"pending" | "save" | "ready">("pending")
  const { postId } = useParams()
  const router = useRouter()
  const { newPost, newPostStatus, loadNewPost, setStatus, setSaveDataForEdit, setLoadSaveData } = useNewPostStore()

  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const user = userData?.user
  const { data: post, isError } = useQuery<any>({
    queryKey: queryKey.post(postId as string),
    queryFn: () => getPost(postId as string),
    enabled: typeof user?.userId === "number" && typeof postId === "string",
  })

  useEffect(() => {
    setSaveDataForEdit()
    setEditPostStatus("save")
  }, [])

  useEffect(() => {
    return () => {
      setLoadSaveData()
    }
  }, [])

  useEffect(() => {
    if (editPostStatus === "save" && post && post.userId === user?.userId) {
      setStatus("edit")
      const {
        content: { candidates, ...newContent },
        ...targetPost
      } = post

      const thumbnailArr = targetPost.thumbnail.split("${}$")
      const thumbnailType: ThumbnailType =
        thumbnailArr.length > 1 ? "layout" : targetPost.thumbnail.trim() ? "custom" : "none"
      loadNewPost({
        newPost: {
          postId: targetPost.postId,
          type: targetPost.type,
          thumbnail: targetPost.thumbnail,
          title: targetPost.title,
          format: targetPost.format,
          count: targetPost.count,
        },
        candidates,
        content: newContent,
        selectedCandidateIndex: -1,
        newPostStatus: "edit",
        thumbnail: {
          imageSrc: thumbnailType === "custom" ? post.thumbnail : "",
          isPossibleLayout: false,
          layout: thumbnailType === "layout" ? thumbnailArr : [],
          slice: thumbnailType === "layout" ? thumbnailArr.length : candidates.length > 5 ? 5 : candidates.length,
          type: thumbnailType,
        },
      })
      setEditPostStatus("ready")
    }
  }, [post, user, editPostStatus])

  useEffect(() => {
    if (userData?.msg === "no" || typeof postId !== "string" || !postId || (isError && !post)) {
      router.push("/")
      toastError(t("error.unknown", { ns: "messages" }))
    }
  }, [userData, postId, isError, post])

  return post && editPostStatus === "ready" ? (
    <>
      {/* EDIT & RESULT SECTION */}
      {newPostStatus === "edit" && (
        <>
          {newPost?.type === "polling" && <PollingContent />}
          {newPost?.type === "contest" && <ContestContent />}
          {newPost?.type === "tournament" && <TournamentContent />}
        </>
      )}

      {/* RENDING SECTION */}
      {newPostStatus === "rending" && <RendingSection />}
    </>
  ) : (
    <FavoriteLoading type="content" />
  )
}
