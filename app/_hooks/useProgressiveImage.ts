import { useEffect, useState } from "react"

export const useProgressiveImage = (src: string) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      if (img.naturalHeight > 0) setStatus("success")
    }
    img.onerror = () => {
      setStatus("error")
    }
  }, [src])

  return status
}
