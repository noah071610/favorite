"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { _url } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastSuccess } from "@/_data/toast"
import { login, refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { Providers, UserQueryType } from "@/_types/user"
import { useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import { useRef, useState } from "react"
import style from "../style.module.scss"

const cx = classNames.bind(style)

const socials = [
  {
    value: "google",
    disable: false,
    share: "https://www.facebook.com/sharer/sharer.php",
  },
  {
    value: "kakaoTalk",
    disable: true,
  },
  {
    value: "instagram",
    disable: true,
  },
  {
    value: "facebook",
    disable: true,
    share: "https://www.facebook.com/sharer/sharer.php",
  },
]

export default function LoginContent({ setContentPart }: { setContentPart: (state: "signUp" | "login") => void }) {
  const queryClient = useQueryClient()
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setModal, modalStatus } = useMainStore()
  const [input, setInput] = useState({ email: "", password: "" })
  const [inputStatus, setInputStatus] = useState<{
    focus: { [key: string]: boolean }
    errorMessage: { [key: string]: string | null }
  }>({
    focus: {
      email: false,
      password: false,
    },
    errorMessage: {
      email: null,
      password: null,
      loginBtn: null,
    },
  })

  const onChangeInput = (e: any, type: "email" | "password") => {
    setInputStatus((obj) => ({ ...obj, errorMessage: { ...obj.errorMessage, [type]: null, loginBtn: null } }))
    if (!inputStatus.focus[type]) setInputStatus((obj) => ({ ...obj, focus: { ...obj.focus, [type]: true } }))
    setInput((obj) => ({ ...obj, [type]: e.target.value }))
  }

  const onFocusOrBlurInput = (isFocus: boolean, type: "email" | "password") => {
    if (!isFocus) {
      if (input[type].trim().length > 0) return
    }
    setInputStatus((obj) => ({ ...obj, focus: { ...obj.focus, [type]: isFocus } }))
  }

  const onKeyDownEmail = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (passwordRef?.current) {
        passwordRef.current.focus()
      }
    }
  }

  const sendNewPostError = (target: "email" | "password" | "loginBtn", type: ErrorTypes | null) => {
    if (!type) return
    setInputStatus((obj) => ({ ...obj, errorMessage: { ...obj.errorMessage, [target]: errorMessage[type] } }))
  }

  const finishLogin = ({ msg, user }: UserQueryType) => {
    if (msg === "ok") {
      queryClient.setQueryData(["user"], { msg: "ok", user })
    } else {
      setTimeout(() => {
        setIsLoading(false)
        sendNewPostError("loginBtn", "loginFailBadRequest")
      }, 2000)
      return
    }

    if (modalStatus === "login") {
      setTimeout(() => {
        setModal("none")
        toastSuccess("login")
      }, 2000)
    } else {
      setModal("newPostLoginSuccess")
    }
  }

  const onSubmitLogin = async () => {
    let isValidated = true
    const { email, password } = input

    if (!email.match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/)) {
      sendNewPostError("email", "invalidEmail")
      isValidated = false
    }
    if (!email.trim()) {
      sendNewPostError("email", "noEmail")
      isValidated = false
    }

    if (!password.trim()) {
      sendNewPostError("password", "noPassword")
      isValidated = false
    }

    if (!isValidated) return

    setIsLoading(true)

    const data = await login({ email: input.email, password: input.password })
    finishLogin(data)
  }

  const onClickSocialLogin = (provider: Providers) => {
    const newWindow = window.open(`${_url.server}/auth/${provider}`, "_blank")

    setIsLoading(true)
    window.addEventListener("message", async (event) => {
      // 받은 메시지가 B페이지에서 보낸 것인지 확인합니다.
      if (event.source === newWindow) {
        // B페이지에서 전달받은 정보를 처리하는 함수를 호출합니다.
        if (event.data.msg === "ok") {
          if (newWindow) {
            newWindow.close()
          }

          // const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
          const data = await refreshUser()
          finishLogin(data)
        }
      }
    })
  }

  return (
    <div className={cx(style.login)}>
      {isLoading && <FavoriteLoading type="overlay" />}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitLogin()
        }}
        className={cx(style["input-container"])}
      >
        <div className={cx(style.input, { [style.error]: !!inputStatus.errorMessage.email })}>
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
            className={cx({ [style.active]: inputStatus.focus.email })}
          />
          <label className={cx({ [style.active]: inputStatus.focus.email })}>이메일 입력</label>
          {inputStatus.errorMessage.email && (
            <div className={cx(style["error-message"])}>
              <span>* {inputStatus.errorMessage.email}</span>
            </div>
          )}
        </div>
        <div className={cx(style.input, { [style.error]: !!inputStatus.errorMessage.password })}>
          <input
            ref={passwordRef}
            onFocus={() => onFocusOrBlurInput(true, "password")}
            onBlur={() => onFocusOrBlurInput(false, "password")}
            onChange={(e) => onChangeInput(e, "password")}
            value={input.password}
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            className={cx({ [style.active]: inputStatus.focus.password })}
          />
          <label className={cx({ [style.active]: inputStatus.focus.password })}>패스워드 입력</label>
          {inputStatus.errorMessage.password && (
            <div className={cx(style["error-message"])}>
              <span>* {inputStatus.errorMessage.password}</span>
            </div>
          )}
        </div>
        <div className={cx(style["submit-btn"], { [style.error]: !!inputStatus.errorMessage.loginBtn })}>
          <button type="submit">
            <span className={cx(style["btn-text"])}>로그인</span>
          </button>
          {inputStatus.errorMessage.loginBtn && (
            <div className={cx(style["error-message"])}>
              <span>* {inputStatus.errorMessage.loginBtn}</span>
            </div>
          )}
        </div>
      </form>
      <div className={cx(style["sub-btn"])}>
        {/* <button>
          <span>이메일 찾기</span>
        </button>
        <button>
          <span>비밀번호 찾기</span>
        </button> */}
        <button
          onClick={() => {
            setContentPart("signUp")
          }}
        >
          <span>회원가입</span>
        </button>
      </div>
      <div className={cx(style.title)}>
        <span>SNS로 3초만에 로그인</span>
        <i className={cx("fa-solid", "fa-rocket")}></i>
      </div>
      <div className={cx(style.sns)}>
        {socials.map(({ value, disable }) => (
          <button
            disabled={disable}
            onClick={() => onClickSocialLogin(value as Providers)}
            key={value}
            className={cx(style.btn, style[value])}
          >
            <div className={cx(style.image)}>
              <img src={`/images/icon/${value}.png`} alt={value} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
