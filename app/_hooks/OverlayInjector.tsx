"use client"

import Overlay from "@/_components/Overlay"
import { useMainStore } from "@/_store/main"
import "@/_styles/global.scss"

import { useEffect, useState } from "react"

export default function OverlayInjector() {
  const [isFirstRendering, setIsFirstRendering] = useState(true)
  const { modalStatus } = useMainStore()

  useEffect(() => {
    if (isFirstRendering && modalStatus !== "none") {
      setIsFirstRendering(false)
    }
  }, [modalStatus, isFirstRendering])

  return !isFirstRendering && <Overlay />
}
