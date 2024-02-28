"use client"

import { useNewPostStore } from "@/_store/newPost"

import InitSection from "./_components/InitSection"
import RendingSection from "./_components/RendingSection"

import Confirm from "@/_components/Confirm"
import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { useMainStore } from "@/_store/main"
import { useContestStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { useTournamentStore } from "@/_store/newPost/tournament"
import { ContestContentType } from "@/_types/post/contest"
import { PollingContentType } from "@/_types/post/polling"
import { NewPostType } from "@/_types/post/post"
import { TournamentContentType } from "@/_types/post/tournament"
import { checkNewPostType } from "@/_utils/post"
import classNames from "classNames"
import dynamic from "next/dynamic"
import { useCallback, useEffect } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

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

const handleBeforeUnload = (event: any, newPost: NewPostType | null, content: any) => {
  if (newPost) {
    localStorage.setItem("favorite_save_data", JSON.stringify({ ...newPost, content }))
    event.returnValue = "Are you sure you want to leave?"
  }
}

export default function NewPostPage() {
  const { newPost, newPostStatus, createNewPost, clearNewPost, setStatus } = useNewPostStore()
  const { clearPollingContent, loadPollingContent, pollingContent } = usePollingStore()
  const { clearContestContent, loadContestContent, contestContent } = useContestStore()
  const { clearTournamentContent, loadTournamentContent, tournamentContent } = useTournamentStore()
  const { modalStatus, setModal } = useMainStore()

  useEffect(() => {
    const content = () => {
      switch (newPost?.type) {
        case "polling":
          return pollingContent
        case "contest":
          return contestContent
        case "tournament":
          return tournamentContent
        default:
          return "{}"
      }
    }
    window.addEventListener("popstate", (e) => handleBeforeUnload(e, newPost, content()))
    window.addEventListener("beforeunload", (e) => handleBeforeUnload(e, newPost, content()))

    return () => {
      window.removeEventListener("beforeunload", (e) => handleBeforeUnload(e, newPost, content()))
      window.removeEventListener("popstate", (e) => handleBeforeUnload(e, newPost, content()))
    }
  }, [contestContent, newPost, pollingContent, tournamentContent])

  useEffect(() => {
    if (!newPost) {
      const _item = localStorage.getItem("favorite_save_data")
      if (_item) {
        const item = JSON.parse(_item)

        if (checkNewPostType(item)) {
          setModal("newPostLoad")
        } else {
          localStorage.removeItem("favorite_save_data")
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk) {
        const item = localStorage.getItem("favorite_save_data")
        const { content, ..._newPost } = JSON.parse(item ?? "")
        createNewPost({ ..._newPost })
        switch (_newPost?.type) {
          case "polling":
            loadPollingContent(content as PollingContentType)
            break
          case "contest":
            loadContestContent(content as ContestContentType)
            break
          case "tournament":
            loadTournamentContent(content as TournamentContentType)
            break
          default:
            break
        }
        setStatus("edit")
      } else {
        localStorage.removeItem("favorite_save_data")
        clearNewPost()
        clearContestContent()
        clearPollingContent()
        clearTournamentContent()
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
