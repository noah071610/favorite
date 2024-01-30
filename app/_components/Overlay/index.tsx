"use client"

import { useModalStore } from "@/_store"
import classNames from "classnames"
import { MouseEvent } from "react"
import "./style.scss"

export default function Overlay() {
  const { modalStatus, setModal } = useModalStore()

  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.className.includes("overlay") && modalStatus !== "none") {
      setModal("none")
    }
  }

  return (
    <div
      onClick={onClickOverlay}
      className={classNames("overlay", {
        active: modalStatus !== "none",
      })}
    />
  )
}
