/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useState } from "react"

const useIntersectionObserver = (targetRef: MutableRefObject<HTMLElement | null>) => {
  const [isIntersecting, setIsIntersecting] = useState(true)

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting)
      })
    }

    const observer = new IntersectionObserver(callback)

    if (targetRef?.current) {
      observer.observe(targetRef?.current)
    }

    return () => {
      if (targetRef?.current) {
        observer.unobserve(targetRef?.current)
      }
    }
  }, [])

  return isIntersecting
}

export default useIntersectionObserver
