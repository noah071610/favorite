"use client"

import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { contentTypesArr } from "@/_data/post"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { PostContentType } from "@/_types/post/post"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function InitSection() {
  const { t } = useTranslation(["newPost", "modal", "content"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const { error } = useMainStore()
  const { newPost, clearNewPost, setNewPost, setStatus } = useNewPostStore()
  const { modalStatus, setModal } = useMainStore()
  const [typeSave, setTypeSave] = useState<PostContentType | null>(null)

  const onClickTypeSelect = (value: PostContentType) => {
    if (newPost?.type) {
      if (newPost?.type !== value) {
        setTypeSave(value)
        setModal("changePostType")
      }
    } else {
      clearNewPost(value)
      setNewPost({ type: "type", payload: value })
      setStatus("edit")
    }
  }

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk && typeSave) {
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
        <h1 className={cx({ [style.error]: error.type === "selectType" })}>
          {t("selectContentType", { ns: "newPost" })}
        </h1>
        <div className={cx(style["type-list"])}>
          {contentTypesArr.map(({ value, icon, label }) => (
            <button
              onClick={() => onClickTypeSelect(value as PostContentType)}
              key={`type_selector_${value}`}
              className={cx(`type-${value}`, { [style.active]: newPost?.type === value })}
            >
              <div>{icon(style)}</div>
              <span> {t(label, { ns: "content" })}</span>
            </button>
          ))}
        </div>
      </div>
      {modalStatus === "changePostType" && (
        <Confirm
          title={t("changePostType", { ns: "modal" })}
          onClickConfirm={onClickConfirm}
          customBtn={{ yes: t("itIsFine", { ns: "modal" }), no: t("changePostType", { ns: "cancel" }) }}
        />
      )}
    </div>
  )
}
