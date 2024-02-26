"use client"

import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { login } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import { useState } from "react"
import { toast } from "react-toastify"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const socials = [
  {
    value: "google",
  },
  {
    value: "instagram",
  },
  {
    value: "twitter",
  },
  {
    value: "facebook",
  },
]

export default function LoginModal() {
  const queryClient = useQueryClient()
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

  const onClickLogin = async () => {
    const { msg, user } = await login({ email: input.email, password: input.password })
    queryClient.setQueryData(["user"], { msg: "ok", user })

    switch (msg) {
      case "ok":
        if (modalStatus === "login") {
          setModal("none")
          toast.success(successMessage["login"], successToastOptions("login"))
        } else {
          setModal("newPostLoginSuccess")
        }
        break
      default:
        break
    }
  }

  return (
    <div className={cx(style.modal)}>
      <div className={cx(style.inner)}>
        <div className={cx(style["logo-wrapper"])}>
          <img src="" alt="" />
        </div>
        <div className={cx(style["input-container"])}>
          <div className={cx(style.input)}>
            <input
              onFocus={() => onFocusOrBlurInput(true, "email")}
              onBlur={() => onFocusOrBlurInput(false, "email")}
              onChange={(e) => onChangeInput(e, "email")}
              value={input.email}
              type="email"
              className={cx({ [style.active]: focus.email })}
            />
            <label className={cx({ [style.active]: focus.email })}>이메일 입력</label>
          </div>
          <div className={cx(style.input)}>
            <input
              onFocus={() => onFocusOrBlurInput(true, "password")}
              onBlur={() => onFocusOrBlurInput(false, "password")}
              onChange={(e) => onChangeInput(e, "password")}
              value={input.password}
              type="password"
              className={cx({ [style.active]: focus.password })}
            />
            <label className={cx({ [style.active]: focus.password })}>패스워드 입력</label>
          </div>
        </div>
        <div className={cx(style.login)}>
          <button onClick={onClickLogin}>
            <span>로그인</span>
          </button>
        </div>
        <div className={cx(style.register)}>
          <button>
            <span>이메일 찾기</span>
          </button>
          <button>
            <span>비밀번호 찾기</span>
          </button>
          <button>
            <span>회원가입</span>
          </button>
        </div>
        <div className={cx(style.title)}>
          <span>SNS로 3초만에 로그인</span>
          <i className={cx("fa-solid", "fa-rocket")}></i>
        </div>
        <div className={cx(style.sns)}>
          {socials.map(({ value }) => (
            <button key={value} className={cx(style.btn, style[value])}>
              <div className={cx(style.image)}>
                <img src={`/images/icon/${value}.png`} alt={value} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
