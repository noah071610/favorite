"use client"

import { useEffect } from "react"

const LoginSuccess = async () => {
  useEffect(() => {
    if (typeof window === "object") {
      window.opener.postMessage({ msg: "ok" }, "*")
    }
  }, [])
}

export default LoginSuccess
