"use client"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import FavoriteLoading from "./_components/@Global/Loading/FavoriteLoading"
import PostCard from "./_components/PostCard"
import { queryKey } from "./_data"
import { contentTypesObj } from "./_data/post"
import { useIntersectionObserver } from "./_hooks/useIntersectionObserver"
import { getPopularPosts, getPosts } from "./_queries/post"
import { PostCardType, PostFindQuery } from "./_types/post/post"
import style from "./style.module.scss"

export default function HomePage() {
  const { get } = useSearchParams()
  const query = get("query") as PostFindQuery

  const [cursor, setCursor] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(true)
  const {
    data: posts,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: queryKey.home[query ?? "all"],
    queryFn: ({ pageParam }) => getPosts({ pageParam, query: query ?? "all" }),
    initialPageParam: 0,
    getNextPageParam: () => {
      return cursor + 1
    },
  })
  const { data: popularPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.home["popular"],
    queryFn: getPopularPosts,
  })

  useEffect(() => {
    setCursor(0)
  }, [query])

  const [ref, isIntersecting] = useIntersectionObserver()

  const sliderRef = useRef(null)
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return
    ;(sliderRef.current as any).swiper.slidePrev()
  }, [])
  const handleNext = useCallback(() => {
    if (!sliderRef.current) return
    ;(sliderRef.current as any).swiper.slideNext()
  }, [])

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && isIntersecting) {
      setCursor((n) => n + 1)
      fetchNextPage()
    }
  }, [isIntersecting, isFetchingNextPage, fetchNextPage, setCursor, hasNextPage])

  useEffect(() => {
    if (posts?.pages[posts?.pages.length - 1].length === 0) {
      setHasNextPage(false)
    }
  }, [posts?.pages])

  const titleLabel = contentTypesObj[query]?.label

  return (
    <>
      <div className={"global-page"}>
        <div className={"content"}>
          {posts && popularPosts ? (
            <>
              {(query === "all" || !query) && (
                <>
                  <div className={"title"}>
                    <h1>
                      <img src="/images/emoji/fire.png" />
                      <span>지금 인기에요!</span>
                    </h1>

                    <div className={"arrows"}>
                      <button className={"arrow prev"} onClick={handlePrev}>
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button className={"arrow next"} onClick={handleNext}>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className={"popular"}>
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={3}
                      slidesPerGroup={3}
                      navigation={true}
                      className={"slider"}
                      ref={sliderRef}
                    >
                      {popularPosts.map((v: PostCardType) => (
                        <SwiperSlide className={"slide"} key={`popular_${v.postId}`}>
                          <PostCard postCard={v} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </>
              )}
              <div className={"title"}>
                <h1>
                  <img src="/images/emoji/rocket.png" />
                  <span>{titleLabel ? (query === "all" ? "모두 보기" : titleLabel + " 콘텐츠") : "모두 보기"}</span>
                </h1>
              </div>
              <div className={style.grid}>
                {posts.pages.flat().map((v: PostCardType) => (
                  <PostCard key={v.postId} postCard={v} />
                ))}
              </div>
            </>
          ) : (
            <FavoriteLoading type="full" />
          )}
        </div>
      </div>
      <div
        style={{ display: hasNextPage && isSuccess && !isFetchingNextPage ? "block" : "none" }}
        ref={ref as any}
        className={style.observer}
      />
    </>
  )
}
