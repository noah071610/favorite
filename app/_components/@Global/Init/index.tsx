"use client"

import { refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { DarkModeSwitch } from "react-toggle-dark-mode"
import style from "./style.module.scss"

export default function Init() {
  const queryClient = useQueryClient()
  const { setWindowSize } = useMainStore()
  const [isDarkMode, setDarkMode] = useState(false)

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
  }, [])

  useEffect(() => {
    if (typeof window === "object") {
      const curMode = document.querySelector("body")?.className
      setDarkMode(curMode !== "dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const body = document.querySelector("body")
    const curMode = document.querySelector("body")?.className

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
        queryClient.setQueryData(["user"], { msg, user })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button className={style["dark-mode-toggle"]}>
        <DarkModeSwitch
          sunColor="#FFC9A8"
          moonColor="#C0B3C9"
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={120}
        />
      </button>
    </>
  )
}
