"use client"

import LoginModal from "@/_components/LoginModal"
import { queryKey } from "@/_data"
import { refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DarkModeSwitch } from "react-toggle-dark-mode"
import style from "./style.module.scss"

export default function Init() {
  const { lang } = useParams()
  const queryClient = useQueryClient()
  const { setWindowSize } = useMainStore()
  const [isDarkMode, setDarkMode] = useState(false)
  const { modalStatus } = useMainStore()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 950) {
        setWindowSize("full")
      } else if (window.innerWidth > 800) {
        setWindowSize("large")
      } else if (window.innerWidth > 450) {
        setWindowSize("medium")
      } else {
        setWindowSize("mobile")
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === "object") {
      const body = document.querySelector("body")
      const curMode = document.querySelector("body")?.className
      if (!curMode) {
        const selectMode = localStorage.getItem("color-mode")
        if (!selectMode) {
          body?.classList.add("light")
          setDarkMode(false)
        } else {
          body?.classList.add(selectMode)
          setDarkMode(selectMode === "dark")
        }
        return
      }
      setDarkMode(curMode !== "dark")
    }
  }, [lang])

  const toggleDarkMode = () => {
    const body = document.querySelector("body")
    const curMode = document.querySelector("body")?.className

    if (!curMode) {
      const selectMode = localStorage.getItem("color-mode")
      if (!selectMode || selectMode === "light") {
        body?.classList.add("dark")
        localStorage.setItem("color-mode", "dark")
        setDarkMode(true)
      } else {
        body?.classList.add("light")
        localStorage.setItem("color-mode", "light")
        setDarkMode(false)
      }
      return
    }
    if (curMode === "light") {
      localStorage.setItem("color-mode", "dark")
      body?.classList.replace("light", "dark")
      setDarkMode(false)
    } else {
      localStorage.setItem("color-mode", "light")
      body?.classList.replace("dark", "light")
      setDarkMode(true)
    }
  }

  useEffect(() => {
    !(async function () {
      const { msg, user } = await refreshUser()
      if (user) {
        await queryClient.setQueryData(queryKey.user, { msg, user })
      } else {
        await queryClient.setQueryData(queryKey.user, { msg: "no", user: null })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button className={style["dark-mode-toggle"]}>
        <DarkModeSwitch sunColor="#FFC9A8" moonColor="#C0B3C9" checked={isDarkMode} onChange={toggleDarkMode} />
      </button>
      {(modalStatus === "login" || modalStatus === "loginNewPost" || modalStatus === "loginInContent") && (
        <LoginModal />
      )}
    </>
  )
}
