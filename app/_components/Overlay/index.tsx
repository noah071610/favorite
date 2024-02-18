"use client"

import { useMainStore } from "@/_store/main"
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import classNames from "classNames"
import { MouseEvent, useEffect } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Overlay() {
  const { modalStatus, setModal } = useMainStore()

  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.className.includes("overlay") && modalStatus !== "none") {
      setModal("none")
      const body: HTMLBodyElement | null = document.querySelector("body")
      if (body) enableBodyScroll(body)
    }
  }

  useEffect(() => {
    const body: HTMLBodyElement | null = document.querySelector("body")
    if (body && modalStatus !== "none") disableBodyScroll(body)

    return () => {
      clearAllBodyScrollLocks()
    }
  }, [modalStatus])

  return (
    <div
      onClick={onClickOverlay}
      style={{
        animation:
          modalStatus !== "none" ? "overlay_animation 400ms forwards" : "overlay_animation_rollback 400ms forwards",
      }}
      className={cx(style["global-overlay"])}
    />
  )
}
