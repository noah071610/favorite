"use client"

import { toastSuccess } from "@/_data/toast"
import { login } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function LoginContent({ setContentPart }: { setContentPart: (state: "signUp" | "login") => void }) {
  const queryClient = useQueryClient()
  const { t } = useTranslation(["messages"])
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const { setModal, modalStatus } = useMainStore()
  const [input, setInput] = useState({ email: "", password: "" })
  const [focus, setFocus] = useState<{ email: boolean; password: boolean }>({ email: false, password: false })

  const onChangeInput = (e: any, type: "email" | "password") => {
    if (!focus[type]) setFocus((obj) => ({ ...obj, [type]: true }))
    setInput((obj) => ({ ...obj, [type]: e.target.value }))
  }

  const onFocusOrBlurInput = (isFocus: boolean, type: "email" | "password") => {
    if (!isFocus) {
      if (input[type].trim().length > 0) return
    }
    setFocus((obj) => ({ ...obj, [type]: isFocus }))
  }

  const onKeyDownEmail = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (passwordRef?.current) {
        passwordRef.current.focus()
      }
    }
  }

  const onSubmitFindEmail = async () => {
    const { msg, user } = await login({ email: input.email, password: input.password })
    queryClient.setQueryData(["user"], { msg: "ok", user })

    switch (msg) {
      case "ok":
        if (modalStatus === "login") {
          setModal("none")
          toastSuccess(t("success.login"))
        } else {
          setModal("newPostLoginSuccess")
        }
        break
      default:
        break
    }
  }

  return (
    <div className={cx(style["find-email"])}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitFindEmail()
        }}
        className={cx(style["input-container"])}
      >
        <div className={cx(style.input)}>
          <input
            onFocus={() => onFocusOrBlurInput(true, "email")}
            onBlur={() => onFocusOrBlurInput(false, "email")}
            onChange={(e) => onChangeInput(e, "email")}
            value={input.email}
            onKeyDown={onKeyDownEmail}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className={cx({ [style.active]: focus.email })}
          />
          <label className={cx({ [style.active]: focus.email })}>{t("이메일 입력")}</label>
        </div>
        <div className={cx(style["find-email-btn"])}>
          <button type="submit">
            <span>{t("이메일 찾기")}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
