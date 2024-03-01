"use client"

import classNames from "classNames"
import { useState } from "react"
import LoginContent from "./Login"
import SignUpContent from "./Signup"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function LoginModal() {
  const [contentPart, setContentPart] = useState<"login" | "signUp">("login")
  return (
    <div className={cx(style.modal)}>
      <div className={cx(style.inner)}>
        <div className={cx(style["logo-wrapper"])}>
          <img src="" alt="" />
        </div>
        {contentPart === "login" && <LoginContent setContentPart={setContentPart} />}
        {contentPart === "signUp" && <SignUpContent setContentPart={setContentPart} />}
      </div>
    </div>
  )
}
