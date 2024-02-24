"use client"

import Confirm from "@/_components/Confirm"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { useContestStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { useTournamentStore } from "@/_store/newPost/tournament"
import { PostContentType } from "@/_types/post/post"
import { UserType } from "@/_types/user"
import classNames from "classNames"
import { nanoid } from "nanoid"
import { useCallback, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const typeSelectors = [
  {
    value: "polling",
    label: "투표",
    children: (
      <>
        <i className={cx("fa-solid", "fa-chart-simple", style.symbol)} />
      </>
    ),
  },
  {
    value: "contest",
    label: "1:1 대결",
    children: (
      <>
        <span className={cx(style.symbol, style.contest)}>VS</span>
      </>
    ),
  },
  {
    value: "tournament",
    label: "월드컵",
    children: (
      <>
        <i className={cx("fa-solid", "fa-trophy")} />
      </>
    ),
  },
]

export default function InitSection({ user }: { user: UserType }) {
  const { newPost, createNewPost, setStatus, error } = useNewPostStore()
  const { modalStatus, setModal } = useMainStore()
  const { clearPollingContent } = usePollingStore()
  const { clearContestContent } = useContestStore()
  const { clearTournamentContent } = useTournamentStore()
  const [type, setType] = useState<PostContentType | null>(null)

  const onClickTypeSelect = (value: PostContentType) => {
    if (user) {
      if (newPost?.type) {
        setType(value)
        setModal("changePostType")
      } else {
        createNewPost({
          postId: nanoid(10),
          type: value,
          thumbnail: "",
          title: "",
          description: "",
          format: "default",
          user,
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
        setStatus("edit")
      }
    }
  }

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk) {
        createNewPost({
          postId: nanoid(10),
          type,
          thumbnail: "",
          title: "",
          description: "",
          format: "default",
          user,
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
        clearContestContent()
        clearPollingContent()
        clearTournamentContent()
        setStatus("edit")
      }
      setModal("none")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, user]
  )
  return (
    <div className={cx(style.init)}>
      <div className={cx(style["type-wrapper"])}>
        <h1 className={cx({ [style.error]: error.type === "selectType" })}>콘텐츠 타입을 선택해주세요</h1>
        <div className={cx(style["type-list"])}>
          {typeSelectors.map(({ value, children, label }) => (
            <button
              onClick={() => onClickTypeSelect(value as PostContentType)}
              key={`type_selector_${value}`}
              className={cx(`type-${value}`, { [style.active]: newPost?.type === value })}
            >
              <div>{children}</div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      {modalStatus === "changePostType" && (
        <Confirm
          title="콘텐츠 타입 변경 시 모든 데이터는 삭제되요. <br/>괜찮으세요?"
          onClickConfirm={onClickConfirm}
          customBtn={{ yes: "네 괜찮아요", no: "취소" }}
        />
      )}
    </div>
  )
}
