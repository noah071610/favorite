"use client"

import { useNewPostStore } from "@/_store/newPost"

import RendingSection from "../_components/RendingSection"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { handleBeforeUnload } from "@/_utils/post"
import classNames from "classNames"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const PollingContent = dynamic(() => import("../_components/@Polling"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const ContestContent = dynamic(() => import("../_components/@Contest"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})
const TournamentContent = dynamic(() => import("../_components/@Tournament"), {
  ssr: true,
  loading: () => <FavoriteLoading type="full" />,
})

export default function NewPostPage() {
  const { newPost, newPostStatus, content, isEditOn, candidates, thumbnail } = useNewPostStore()

  useEffect(() => {
    const handleBeforeUnloadCallback = (e: any) => {
      handleBeforeUnload(e, newPost, content, candidates, thumbnail, isEditOn)
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("popstate", handleBeforeUnloadCallback)
    }
  }, [newPost, content, candidates, thumbnail, isEditOn])

  return (
    <>
      <div className={cx(style["new-post-page"])}>
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
      </div>
    </>
  )
}
