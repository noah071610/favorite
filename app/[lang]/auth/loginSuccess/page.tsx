"use client"

import { useEffect } from "react"

const LoginSuccess = () => {
  useEffect(() => {
    if (typeof window === "object") {
      window.opener.postMessage({ msg: "ok" }, "*")
    }
  }, [])
  return <></>
}

export default LoginSuccess
