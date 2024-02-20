"use client"

import { useEffect } from "react"

import { getUser } from "@/_queries/user"
import { useQuery } from "@tanstack/react-query"

import { useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/user"
import { nanoid } from "nanoid"

import ContestContent from "./_components/@Contest"
import PollingContent from "./_components/@Polling"
import InitSection from "./_components/InitSection"
import RendingSection from "./_components/RendingSection"

import classNames from "classNames"
import TournamentContent from "./_components/@Tournament"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function NewPostPage() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser", "edit"],
    queryFn: () => getUser(1),
    select: ({ userId, userName, userImage }) => ({ userId, userName, userImage }), // 여기서 data는 전체 데이터 객체입니다.
  })

  const { newPost, newPostStatus, createNewPost, setNewPost } = useNewPostStore()

  useEffect(() => {
    // todo: 불러오기 로직 추가
    if (!newPost && user) {
      createNewPost({
        postId: nanoid(10),
        type: null,
        thumbnail: "",
        title: "",
        description: "",
        format: "default",
        userId: user.userId,
        info: {
          participateImages: [],
          shareCount: 0,
          like: 0,
          participateCount: 0,
          isNoComments: 0,
          thumbnailType: "custom",
        },
        content: null,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, newPost])

  return (
    <div className={cx(style["new-post-page"])}>
      {/* INIT SECTION */}
      {newPostStatus === "init" && <InitSection />}

      {/* EDIT & RESULT SECTION */}
      {newPostStatus === "edit" && (
        <>
          {newPost?.type === "polling" && user && <PollingContent user={user} />}
          {newPost?.type === "contest" && user && <ContestContent user={user} />}
          {newPost?.type === "tournament" && user && <TournamentContent user={user} />}
        </>
      )}

      {/* RENDING SECTION */}
      {newPostStatus === "rending" && <RendingSection />}
    </div>
  )
}
