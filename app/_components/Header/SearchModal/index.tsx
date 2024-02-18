"use client"

import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SearchModal() {
  const { modalStatus } = useMainStore()
  return (
    <div className={cx(style.modal, { [style.active]: modalStatus === "search" })}>
      <div className={cx(style.content)} />
    </div>
  )
}
