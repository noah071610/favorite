import { useEffect, useState } from "react"

export const usePreloadImages = (content: string[], noDelay?: boolean) => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState(0)

  useEffect(() => {
    if (imageLoadedCount >= content.length) {
      setTimeout(
        () => {
          setIsImagesLoaded(true)
        },
        noDelay ? 0 : 1200
      )
    }
  }, [content, imageLoadedCount, noDelay])

  useEffect(() => {
    if (!!content.length) {
      content.forEach((imageSrc) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
          setImageLoadedCount((prevCount) => prevCount + 1)
        }
        image.onerror = () => {
          setImageLoadedCount((prevCount) => prevCount + 1)
        }
      })
    }

    // 이미지 로드 카운트 초기화 또는 정리 작업은 필요하지 않으므로 반환되는 함수를 생략합니다.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isImagesLoaded
}
