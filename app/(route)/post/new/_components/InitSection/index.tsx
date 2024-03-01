"use client"

import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { PostContentType } from "@/_types/post/post"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useCallback, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const typeSelectors = [
  //todo:
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
    label: "토너먼트",
    children: (
      <>
        <i className={cx("fa-solid", "fa-trophy")} />
      </>
    ),
  },
]

export default function InitSection() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const { error } = useMainStore()
  const { newPost, clearNewPost, setNewPost, setIsEditOn, setStatus, setIsSavedDataForPathChange } = useNewPostStore()
  const { modalStatus, setModal } = useMainStore()
  const [typeSave, setTypeSave] = useState<PostContentType | null>(null)

  const onClickTypeSelect = (value: PostContentType) => {
    if (newPost?.type) {
      if (newPost?.type !== value) {
        setTypeSave(value)
        setModal("changePostType")
      }
    } else {
      setIsEditOn(true)
      setIsSavedDataForPathChange(false)
      clearNewPost(value)
      setNewPost({ type: "type", payload: value })
      setStatus("edit")
    }
  }

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk && typeSave) {
        setIsEditOn(true)
        setIsSavedDataForPathChange(false)
        clearNewPost(typeSave)
        setNewPost({ type: "type", payload: typeSave })
        setStatus("edit")
      }
      setModal("none")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeSave, userData?.user?.userId]
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
