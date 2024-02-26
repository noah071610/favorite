"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useEffect, useState } from "react"
import PostCard from "./_components/PostCard"
import { useIntersectionObserver } from "./_hooks/useIntersectionObserver"
import { getPosts } from "./_queries/post"
import { PostCardType } from "./_types/post/post"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function HomePage() {
  const [cursor, setCursor] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)
  const { data, isFetchingNextPage, fetchNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ["homePosts"],
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
        <div className={cx(style["home-page"])}>
          <div className={cx(style.content)}>
            {data.pages.flat().map((v: PostCardType) => (
              <PostCard key={v.postId} postCard={v} />
            ))}
          </div>
        </div>
      )}
      <div
        style={{ display: hasNextPage && isSuccess && !isFetchingNextPage ? "block" : "none" }}
        ref={ref as any}
        className={cx(style.observer)}
      />
    </>
  )
}
