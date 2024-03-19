"use client"

import Confirm from "@/_components/Confirm"
import { queryKey } from "@/_data"
import { contentTypesArr } from "@/_data/post"
import { toastError } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { LangType } from "@/_types"
import { PostContentType } from "@/_types/post"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function InitSection() {
  const { t, i18n } = useTranslation(["newPost", "modal", "content", "messages"])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
  })
  const { push } = useRouter()
  const { postId } = useParams()
  const { error } = useMainStore()
  const { type, setStatus, clearNewPost } = useNewPostStore()
  const { modalStatus, setModal } = useMainStore()
  const [typeSave, setTypeSave] = useState<PostContentType | null>(null)

  const onClickTypeSelect = (value: PostContentType) => {
    if (type === "none") {
      // 새로운 타입 선택 (init)
      if (!postId || typeof postId !== "string") {
        push("/")
        toastError(t("error.unknown", { ns: "messages" }))
        return
      }
      clearNewPost(postId, value, i18n.language as LangType)
      setStatus("edit")
    } else {
      if (type !== value) {
        // 다른 타입 선택 (modal)
        setTypeSave(value)
        setModal("changePostType")
      }

      // 같은 타입 선택 무시
    }
  }

  const onClickConfirm = useCallback(
    (isOk: boolean) => {
      if (isOk && typeSave) {
        if (!postId || typeof postId !== "string") {
          push("/")
          toastError(t("error.unknown", { ns: "messages" }))
          return
        }
        clearNewPost(postId, typeSave, i18n.language as LangType)
        setStatus("edit")
      }
      setModal("none")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeSave, userData?.user?.userId, postId, i18n.language]
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
              className={cx(`type-${value}`, { [style.active]: type === value })}
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
          customBtn={{ yes: t("itIsFine", { ns: "modal" }), no: t("cancel", { ns: "modal" }) }}
        />
      )}
    </div>
  )
}
