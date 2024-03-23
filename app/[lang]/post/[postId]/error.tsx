"use client"
import Image from "next/image"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="global-secret-post">
      <div className="main">
        <Image width={50} height={50} src="/images/emoji/crying.png" alt="crying" />
        <h1>404 Post not found</h1>
        <Link href="/">
          <span>Go main</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
