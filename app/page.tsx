"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import PostCard from "./_components/PostCard"
import { useIntersectionObserver } from "./_hooks/useIntersectionObserver"
import { getPosts } from "./_queries/post"
import { PostCardType } from "./_types/post"
import "./style.scss"

export default function HomePage() {
  const [cursor, setCursor] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)
  const { data, isFetchingNextPage, fetchNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ["getPosts"],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: () => {
      return cursor + 1
    },
  })

  const [ref, isIntersecting] = useIntersectionObserver()

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && isIntersecting) {
      setCursor((n) => n + 1)
      fetchNextPage()
    }
  }, [isIntersecting, isFetchingNextPage, fetchNextPage, setCursor, hasNextPage])

  useEffect(() => {
    if (data?.pages[data?.pages.length - 1].length === 0) {
      setHasNextPage(false)
    }
  }, [data?.pages])

  return (
    <>
      {data && (
        <div className="home-page">
          <div className="home-page-content">
            {data.pages.flat().map((v: PostCardType) => (
              <PostCard key={v.postId} postCard={v} />
            ))}
          </div>
        </div>
      )}
      <div
        style={{ display: hasNextPage && isSuccess && !isFetchingNextPage ? "block" : "none" }}
        ref={ref as any}
        className="home-infinity-observer"
      />
    </>
  )
}
