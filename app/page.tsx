"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import FavoriteLoading from "./_components/Loading/FavoriteLoading"
import PostCard from "./_components/PostCard"
import { useIntersectionObserver } from "./_hooks/useIntersectionObserver"
import { getPosts } from "./_queries/post"
import { PostCardType, PostFindQuery } from "./_types/post/post"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function HomePage() {
  const { get } = useSearchParams()
  const query = get("query") as PostFindQuery

  const [cursor, setCursor] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)
  const { data, isFetchingNextPage, fetchNextPage, isSuccess, refetch } = useInfiniteQuery({
    queryKey: ["mainPosts", query],
    queryFn: ({ pageParam }) => getPosts({ pageParam, query: query ?? "all" }),
    initialPageParam: 0,
    getNextPageParam: () => {
      return cursor + 1
    },
  })

  useEffect(() => {
    setCursor(0)
  }, [query])

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

  const [number, setNumber] = useState(1)
  useEffect(() => {
    setNumber((n) => n + 1)
    console.log(number)
  }, [])

  console.log(number)

  return (
    <>
      <div className={cx(style["home-page"])}>
        <div className={cx(style.content)}>
          {data ? (
            <div className={cx(style.grid)}>
              {data.pages.flat().map((v: PostCardType) => (
                <PostCard key={v.postId} postCard={v} />
              ))}
            </div>
          ) : (
            <FavoriteLoading type="full" />
          )}
        </div>
      </div>
      <div
        style={{ display: hasNextPage && isSuccess && !isFetchingNextPage ? "block" : "none" }}
        ref={ref as any}
        className={cx(style.observer)}
      />
    </>
  )
}
