"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { _url, queryKey } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastSuccess } from "@/_data/toast"
import { login, refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { Providers, UserQueryType } from "@/_types/user"
import { useTranslation } from "@/i18n/client"
import { faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import Image from "next/image"
import { useParams } from "next/navigation"
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
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["login", "messages"])
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
    setInputStatus((obj) => ({
      ...obj,
      errorMessage: { ...obj.errorMessage, [target]: t(errorMessage[type], { ns: "messages" }) },
    }))
  }

  const finishLogin = async ({ msg, user }: UserQueryType) => {
    if (msg === "ok") {
      await queryClient.setQueryData(queryKey.user, { msg: "ok", user })
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
        toastSuccess(t("success.login", { ns: "messages" }))
      }, 2000)
    } else {
      setModal("loginInContentSuccess")
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
          <label className={cx({ [style.active]: inputStatus.focus.email })}>{t("enterEmail")}</label>
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
          <label className={cx({ [style.active]: inputStatus.focus.password })}>{t("enterPassword")}</label>
          {inputStatus.errorMessage.password && (
            <div className={cx(style["error-message"])}>
              <span>* {inputStatus.errorMessage.password}</span>
            </div>
          )}
        </div>
        <div className={cx(style["submit-btn"], { [style.error]: !!inputStatus.errorMessage.loginBtn })}>
          <button type="submit">
            <span className={cx(style["btn-text"])}>{t("login")}</span>
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
          <span>{t("이메일 찾기")}</span>
        </button>
        <button>
          <span>{t("비밀번호 찾기")}</span>
        </button> */}
        <button
          onClick={() => {
            setContentPart("signUp")
          }}
        >
          <span>{t("signup")}</span>
        </button>
      </div>
      <div className={cx(style.title)}>
        <span>{t("snsTitle")}</span>
        <FontAwesomeIcon icon={faRocket} />
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
              <Image width={28} height={28} src={`/images/icon/${value}.png`} alt={value} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
