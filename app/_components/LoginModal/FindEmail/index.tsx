"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function LoginContent({ setContentPart }: { setContentPart: (state: "signUp" | "login") => void }) {
  return <div className={cx(style["find-email"])}></div>
}
