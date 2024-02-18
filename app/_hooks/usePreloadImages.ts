import { useEffect, useState } from "react"

export const usePreloadImages = (content: string[]) => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState<number>(0)

  useEffect(() => {
    if (!!content.length && imageLoadedCount === content.length) {
      // memo: 모든 이미지가 로드된 경우에 수행할 동작
      setTimeout(() => {
        setIsImagesLoaded(true)
      }, 1000)
    }
  }, [content, imageLoadedCount])

  useEffect(() => {
    const handleImageLoad = (image: HTMLImageElement) => {
      if (image.naturalHeight > 0) {
        setImageLoadedCount((n) => n + 1)
      }
    }

    const imageLoadHandlers =
      !!content.length &&
      content.map((imageSrc) => {
        if (imageSrc) {
          const image = new Image()

          image.src = imageSrc
          image.onload = () => handleImageLoad(image)
          image.onerror = () => {
            setImageLoadedCount((n) => n + 1)
          }
          return image
        } else {
          setImageLoadedCount((n) => n + 1)
        }
      })

    return () => {
      if (imageLoadHandlers) {
        setImageLoadedCount(0)
        imageLoadHandlers.forEach((image) => {
          if (image) {
            image.onload = null
            image.onerror = null
          }
        })
      }
    }
  }, [content])

  return isImagesLoaded
}
