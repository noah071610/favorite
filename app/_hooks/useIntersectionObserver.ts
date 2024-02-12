/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"

export const useIntersectionObserver = () => {
  const ref = useRef<HTMLDivElement | null>()
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    })

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref?.current])

  return [ref, isIntersecting]
}
