"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

const SecretPostPage = () => {
  const { back } = useRouter()
  return (
    <div className="global-secret-post">
      <div className="main">
        <Image width={50} height={50} src="/images/emoji/rocket.png" alt="rocket" />
        <h1>Preparing content now! see you soon</h1>
        <button
          onClick={() => {
            back()
          }}
        >
          <span>Go main</span>
        </button>
      </div>
    </div>
  )
}

export default SecretPostPage
