"use client"

import { useMainStore } from "@/_store/main"
import { ModalStatus } from "@/_types"
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import classNames from "classNames"
import { usePathname } from "next/navigation"
import { MouseEvent, useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Overlay() {
  const pathname = usePathname()
  const [curPathname, setCurPathname] = useState("")
  const [overlayAnimation, setOverlayAnimation] = useState("overlay_animation")
  const { modalStatus, setModal } = useMainStore()
  const [curState, setCurState] = useState<ModalStatus>(modalStatus)

  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (modalStatus === "newPostLoad" || modalStatus === "roundSelect") return
    if (e.currentTarget.className.includes("overlay") && modalStatus !== "none") {
      setModal("none")
      const body: HTMLBodyElement | null = document.querySelector("body")
      if (body) enableBodyScroll(body)
    }
  }

  useEffect(() => {
    const body: HTMLBodyElement | null = document.querySelector("body")
    if (body && modalStatus !== "none") {
      disableBodyScroll(body)
      setCurState(modalStatus)
    }

    return () => {
      clearAllBodyScrollLocks()
    }
  }, [modalStatus])

  useEffect(() => {
    if (!!curPathname) {
      if (pathname !== curPathname) {
        setModal("none")
      }
    }
    setCurPathname(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, curPathname])

  const animation = useMemo(() => {
    if (modalStatus === "aside" || modalStatus === "search") {
      setOverlayAnimation(`${modalStatus}_overlay_animation`)
    } else {
      setOverlayAnimation("overlay_animation")
    }
  }, [modalStatus])

  return (
    <div
      onClick={onClickOverlay}
      style={{
        animation:
          modalStatus !== "none"
            ? style[overlayAnimation] + " 400ms forwards"
            : style[
                (curState === "aside" || curState === "search" ? curState + "_" : "") + "overlay_animation_rollback"
              ] + " 400ms forwards",
      }}
      className={cx(style["global-overlay"])}
    />
  )
}
