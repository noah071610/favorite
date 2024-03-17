"use client"

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from "swiper/react"
import FavoriteLoading from "./_components/@Global/Loading/FavoriteLoading"
import PostCard from "./_components/PostCard"
import { queryKey } from "./_data"
import { useIntersectionObserver } from "./_hooks/useIntersectionObserver"
import { getPopularPosts, getPosts } from "./_queries/posts"
import { PostCardType, PostFindQuery } from "./_types/post"
import style from "./style.module.scss"

const breakpoints = {
  // when window width is >= 0px
  0: {
    slidesPerView: 2,
    spaceBetween: 5,
  },
  // when window width is >=450px
  450: {
    slidesPerView: 3,
    spaceBetween: 20,
  },
}

export default function HomePage() {
  const { t } = useTranslation(["title"])
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
    queryKey: queryKey.posts[query ?? "all"],
    queryFn: ({ pageParam }) => getPosts({ pageParam, query: query ?? "all" }),
    initialPageParam: 0,
    getNextPageParam: () => {
      return cursor + 1
    },
  })
  const { data: popularPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.posts["popular"],
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

  return (
    <>
      <div className={"global-page"}>
        <div className={"global-page-content"}>
          {posts && popularPosts ? (
            <>
              {(query === "all" || !query) && (
                <>
                  <div className={"global-page-title"}>
                    <h1>
                      <Image width={35} height={35} src="/images/emoji/fire.png" alt="fire" />
                      <span>{t("popular")}</span>
                    </h1>

                    <div className={"global-page-arrows"}>
                      <button className={"arrow prev"} onClick={handlePrev}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button className={"arrow next"} onClick={handleNext}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </div>
                  </div>
                  <div className={"global-page-popular"}>
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={3}
                      slidesPerGroup={3}
                      navigation={true}
                      className={"slider"}
                      ref={sliderRef}
                      breakpoints={breakpoints}
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
              <div className={"global-page-title"}>
                <h1>
                  <Image width={35} height={35} src="/images/emoji/rocket.png" alt="rocket" />
                  <span>{t(query ?? "all")}</span>
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
