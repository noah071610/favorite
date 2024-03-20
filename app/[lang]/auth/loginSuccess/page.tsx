"use client"

import { useEffect } from "react"

const LoginSuccess = async () => {
  useEffect(() => {
    !(async () => {
      window.opener.postMessage({ msg: "ok" }, "*")
    })()
  }, [])
}

export default LoginSuccess
