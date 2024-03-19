/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"

export const useIntersectionObserver = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    })

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    // isIntersecting 값이 true가 되면 unobserve
    if (isIntersecting && currentRef) {
      observer.unobserve(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref?.current, isIntersecting])

  return [ref, isIntersecting]
}
