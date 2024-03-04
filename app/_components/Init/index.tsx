"use client"

import { refreshUser } from "@/_queries/user"
import { useNewPostStore } from "@/_store/newPost"
import { handleBeforeUnload } from "@/_utils/post"
import { useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Init() {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const { candidates, content, newPost, thumbnail, isEditOn, setIsSavedDataForPathChange, isSavedDataForPathChange } =
    useNewPostStore()

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

  return <></>
}
