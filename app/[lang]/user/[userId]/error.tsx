"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const UserPageError = () => {
  const { push } = useRouter()
  useEffect(() => {
    push("/")
  }, [push])

  return <></>
}

export default UserPageError
