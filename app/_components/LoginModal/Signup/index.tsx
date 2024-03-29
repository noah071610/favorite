import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import { queryKey } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastError, toastSuccess } from "@/_data/toast"
import { hasEmail, registerUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { useTranslation } from "@/i18n/client"
import { useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import style from "../style.module.scss"
const cx = classNames.bind(style)

const label = {
  userName: "userName",
  email: "email",
  password: "password",
  passwordConfirm: "passwordConfirm",
} as const
type InputTypes = keyof typeof label

export default function SignUpContent({ setContentPart }: { setContentPart: (state: "signUp" | "login") => void }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["login", "messages"])
  const { t: message } = useTranslation(lang, ["messages"])
  const queryClient = useQueryClient()
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const { setModal } = useMainStore()
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState({ userName: "", email: "", password: "", passwordConfirm: "" })
  const [inputStatus, setInputStatus] = useState<{
    focus: { [key: string]: boolean }
    errorMessage: { [key: string]: string | null }
  }>({
    focus: {
      userName: false,
      email: false,
      password: false,
      passwordConfirm: false,
    },
    errorMessage: {
      userName: null,
      email: null,
      password: null,
      passwordConfirm: null,
    },
  })

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, type: InputTypes) => {
    setInputStatus((obj) => ({ ...obj, errorMessage: { ...obj.errorMessage, [type]: null } }))
    if (!inputStatus.focus[type]) setInputStatus((obj) => ({ ...obj, focus: { ...obj.focus, [type]: true } }))
    setInput((obj) => ({ ...obj, [type]: e.target.value }))
  }

  const onFocusOrBlurInput = (isFocus: boolean, type: InputTypes) => {
    if (!isFocus && input[type].trim().length > 0) return
    setInputStatus((obj) => ({ ...obj, focus: { ...obj.focus, [type]: isFocus } }))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: InputTypes) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (type === "userName" && emailRef?.current) {
        emailRef.current.focus()
      } else if (type === "email" && passwordRef?.current) {
        passwordRef.current.focus()
      } else if (type === "password" && passwordConfirmRef?.current) {
        passwordConfirmRef.current.focus()
      }
    }
  }

  const sendNewPostError = (target: InputTypes, type: ErrorTypes | null) => {
    if (!type) return
    setInputStatus((obj) => ({
      ...obj,
      errorMessage: { ...obj.errorMessage, [target]: t(errorMessage[type], { ns: "messages" }) },
    }))
  }

  const signUp = async () => {
    let isValidated = true
    const { userName, email, password, passwordConfirm } = input
    if (userName.length > 15) {
      sendNewPostError("userName", "overTenUserName")
      isValidated = false
    }
    if (!userName.trim()) {
      sendNewPostError("userName", "noUserName")
      isValidated = false
    }

    if (!email.match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/)) {
      sendNewPostError("email", "invalidEmail")
      isValidated = false
    }
    if (!email.trim()) {
      sendNewPostError("email", "noEmail")
      isValidated = false
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/)) {
      sendNewPostError("password", "safePassword")
      isValidated = false
    }
    if (!password.trim()) {
      sendNewPostError("password", "noPassword")
      isValidated = false
    }

    if (!passwordConfirm.trim()) {
      sendNewPostError("passwordConfirm", "noPassword")
      isValidated = false
    }
    if (password !== passwordConfirm) {
      sendNewPostError("passwordConfirm", "notSamePassword")
      isValidated = false
    }

    if (!isValidated) return

    const { msg } = await hasEmail(email)
    if (msg === "ok") {
      return sendNewPostError("email", "existEmail")
    }

    setIsLoading(true)

    await registerUser({ email, password, userName })
      .then(({ user }) => {
        setTimeout(async () => {
          await queryClient.setQueryData(queryKey.user, { msg: "ok", user })

          toastSuccess(t("success.login", { ns: "messages" }))
          setModal("none")
        }, 2000)
      })
      .catch((err) => {
        if (err.data === "unknown") {
          toastError(err.msg)
          isValidated = false
        } else {
          sendNewPostError(err.data, err.msg)
          isValidated = false
        }
      })
  }

  return (
    <div className={cx(style.signUp)}>
      {isLoading && <FavoriteLoading type="overlay" />}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          signUp()
        }}
        className={cx(style["input-container"])}
      >
        {Object.entries(input).map(([key, value]) => (
          <div key={key} className={cx(style.input, { [style.error]: !!inputStatus.errorMessage[key] })}>
            <input
              ref={key === "passwordConfirm" ? passwordConfirmRef : key === "password" ? passwordRef : emailRef}
              onFocus={() => onFocusOrBlurInput(true, key as InputTypes)}
              onBlur={() => onFocusOrBlurInput(false, key as InputTypes)}
              onChange={(e) => onChangeInput(e, key as InputTypes)}
              value={value}
              onKeyDown={(e) => onKeyDown(e, key as InputTypes)}
              type={key === "password" || key === "passwordConfirm" ? "password" : key === "email" ? "email" : "text"}
              autoComplete={
                key === "password" || key === "passwordConfirm" ? "new-password" : key === "email" ? "email" : undefined
              }
              className={cx({ [style.active]: inputStatus.focus[key] })}
            />
            <label className={cx({ [style.active]: inputStatus.focus[key] })}>{t(`${label[key as InputTypes]}`)}</label>
            {inputStatus.errorMessage[key] && (
              <div className={cx(style["error-message"])}>
                <span>* {inputStatus.errorMessage[key]}</span>
              </div>
            )}
          </div>
        ))}
        <div className={cx(style["submit-btn"])}>
          <button type="submit">
            <span className={cx(style["btn-text"])}>{t("signup")}</span>
          </button>
        </div>
        <div className={cx(style["sub-btn"])}>
          {/* <button>
            <span>{t("findEmail")}</span>
          </button> */}
          <button
            onClick={() => {
              setContentPart("login")
            }}
          >
            <span>{t("back")}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
