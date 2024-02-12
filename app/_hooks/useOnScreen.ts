import { MutableRefObject, useEffect, useState } from "react"

export const useOnScreen = (ref: MutableRefObject<Element | null>) => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Update our state when observer callback fires
      setIntersecting(entry.isIntersecting)
    })

    const currentRef = ref.current // Capture ref.current value

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, []) // Remove .current from dependencies array

  return isIntersecting
}
