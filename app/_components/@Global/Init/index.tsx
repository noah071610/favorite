"use client"

import { refreshUser } from "@/_queries/user"
import { useMainStore } from "@/_store/main"
import { useNewPostStore } from "@/_store/newPost"
import { handleBeforeUnload } from "@/_utils/post"
import { useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { DarkModeSwitch } from "react-toggle-dark-mode"
import style from "./style.module.scss"

export default function Init() {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const {} = useMainStore()
  const { candidates, content, newPost, thumbnail, isEditOn, setIsSavedDataForPathChange, isSavedDataForPathChange } =
    useNewPostStore()
  const [isDarkMode, setDarkMode] = useState(false)

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

  useEffect(() => {
    if (!isSavedDataForPathChange && isEditOn && pathname !== "/post/new") {
      handleBeforeUnload({}, newPost, content, candidates, thumbnail, isEditOn)
      setIsSavedDataForPathChange(true)
    }
    if (pathname === "/post/new" && isSavedDataForPathChange && isEditOn) {
      setIsSavedDataForPathChange(false)
    }
  }, [pathname, isEditOn, isSavedDataForPathChange])

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
