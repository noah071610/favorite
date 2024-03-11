"use client"

import { useNewPostStore } from "@/_store/newPost"

import InitSection from "../_components/InitSection"
import RendingSection from "../_components/RendingSection"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Confirm from "@/_components/Confirm"
import { useMainStore } from "@/_store/main"
import { handleBeforeUnload } from "@/_utils/post"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation(["modal"])
  const {
    newPost,
    newPostStatus,
    content,
    candidates,
    thumbnail,
    selectedCandidateIndex,
    loadNewPost,
    clearNewPost,
    isEditOn,
  } = useNewPostStore()
  const { modalStatus, setModal } = useMainStore()

  const saveData = useMemo(
    () => ({ newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex }),
    [newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex]
  )

  useEffect(() => {
    const handleBeforeUnloadCallback = (e: any) => {
      handleBeforeUnload(saveData, e)
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    }
  }, [saveData])

  useEffect(() => {
    const _item = localStorage.getItem("favorite_save_data")
    if (_item && !isEditOn) {
      const item = JSON.parse(_item)
      if (!Object.keys(saveData).every((v) => item[v])) return localStorage.removeItem("favorite_save_data")
      setModal("newPostLoad")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditOn])

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk) {
        const item = localStorage.getItem("favorite_save_data")
        const newPostFromLocalStorage = JSON.parse(item ?? "")
        loadNewPost(newPostFromLocalStorage)
      } else {
        localStorage.removeItem("favorite_save_data")
        clearNewPost("all")
      }
      setModal("none")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      {/* INIT SECTION */}
      {newPostStatus === "init" && <InitSection />}

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

      {modalStatus === "newPostLoad" && (
        <Confirm
          title={t("newPostLoad")}
          onClickConfirm={onClickConfirm}
          customBtn={{ yes: t("load"), no: t("makeNewPost") }}
        />
      )}
    </>
  )
}
