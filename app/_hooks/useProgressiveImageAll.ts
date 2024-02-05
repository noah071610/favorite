import { useEffect, useState } from "react"

export const useProgressiveImageAll = (srcArr: string[]) => {
  const [sourceLoadedArr, setSourceLoadedArr] = useState<boolean[]>(srcArr.map(() => false))

  useEffect(() => {
    srcArr.forEach((v, i) => {
      const img = new Image()
      img.src = v

      img.onload = () => {
        setSourceLoadedArr((arr) => arr.map((b, t) => (t === i ? true : b)))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return sourceLoadedArr.every((v) => v)
}
