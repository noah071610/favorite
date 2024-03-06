"use client"

import { useNewPostStore } from "@/_store/newPost"

import InitSection from "../_components/InitSection"
import RendingSection from "../_components/RendingSection"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Confirm from "@/_components/Confirm"
import { useMainStore } from "@/_store/main"
import { handleBeforeUnload } from "@/_utils/post"
import classNames from "classNames"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo } from "react"
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
  const { newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex, loadNewPost, clearNewPost } =
    useNewPostStore()
  const { modalStatus, setModal } = useMainStore()

  const saveData = useMemo(
    () => ({ newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex }),
    [newPost, newPostStatus, content, candidates, thumbnail, selectedCandidateIndex]
  )

  useEffect(() => {
    const handleBeforeUnloadCallback = (e: any) => {
      handleBeforeUnload(e, saveData)
    }
    window.addEventListener("beforeunload", handleBeforeUnloadCallback)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadCallback)
    }
  }, [saveData])

  useEffect(() => {
    const _item = localStorage.getItem("favorite_save_data")
    if (_item) {
      const item = JSON.parse(_item)
      if (!Object.keys(saveData).every((v) => item[v])) return localStorage.removeItem("favorite_save_data")
      setModal("newPostLoad")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <div className={cx(style["new-post-page"])}>
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
      </div>

      {modalStatus === "newPostLoad" && (
        <Confirm
          title="자동 저장된 데이터가 있어요! 🙂<br/>불러올까요?"
          onClickConfirm={onClickConfirm}
          customBtn={{ yes: "데이터 불러오기", no: "새로 만들래요" }}
        />
      )}
    </>
  )
}
