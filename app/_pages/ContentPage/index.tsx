"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Pagination from "@/_components/Pagination"
import PostCard from "@/_components/PostCard"
import { queryKey } from "@/_data"
import { getAllPostsCount, getPopularPosts, getPosts } from "@/_queries/posts"
import { LangType } from "@/_types"
import { PostCardType, PostFindQuery, PostSortOptions } from "@/_types/post"
import { useTranslation } from "@/i18n/client"
import { faChevronLeft, faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
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

const sortOptions = [{ value: "createdAt" }, { value: "lastPlayedAt" }, { value: "popular" }] as const

function CategoryPostsComponent({ query, lang }: { query: PostFindQuery; lang: LangType }) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { t } = useTranslation(lang, ["posts-page"])
  const searchParams = useSearchParams()
  const sortOption = (searchParams.get("sort") ?? "createdAt") as PostSortOptions
  const cursor = searchParams.get("cursor")
  const postsRef = useRef<HTMLDivElement | null>(null)
  const { data: posts } = useQuery<PostCardType[]>({
    queryKey: queryKey.posts[query](cursor ?? "0", sortOption),
    queryFn: () => getPosts({ cursor: cursor ?? "0", query, lang: lang as LangType, sort: sortOption }),
  })
  const { data: postCount } = useQuery<number>({
    queryKey: queryKey.posts.count(query),
    queryFn: () => getAllPostsCount({ query }),
  })

  const setQuery = useCallback(
    ({ sort, _cursor = 0, scroll }: { sort: PostSortOptions; _cursor?: number; scroll?: boolean }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      current.set("sort", sort)
      current.set("cursor", String(_cursor))
      const search = current.toString()
      // or const query = `${'?'.repeat(search.length && 1)}${search}`;
      const query = search ? `?${search}` : ""

      replace(`${pathname}${query}`, {
        scroll: false,
      })
      if (scroll && postsRef?.current) {
        postsRef?.current.scrollIntoView()
      }
    },
    [pathname, replace, searchParams]
  )

  const handlePageClick = (event: any) => {
    setQuery({ sort: sortOption, _cursor: event.selected, scroll: true })
  }

  const onClickSort = (value: PostSortOptions) => {
    setQuery({ sort: value, scroll: true })
  }

  useEffect(() => {
    if (!sortOption || !cursor) {
      setQuery({ sort: "createdAt" })
    }
  }, [sortOption, cursor, setQuery])

  return (
    <>
      <div className={"global-page-title global-page-title-sort"}>
        <div className="global-page-title-observer" ref={postsRef}></div>
        <h1>
          <Image width={35} height={35} src="/images/emoji/rocket.png" alt="rocket" />
          <span>{t(query)}</span>
        </h1>

        <div className={"global-page-sort"}>
          {sortOptions.map(({ value }) => (
            <button
              key={`sort-btn-${value}`}
              onClick={() => onClickSort(value)}
              className={value === sortOption ? "active" : ""}
            >
              <span>{t(value, { ns: "nav" })}</span>
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          ))}
        </div>
      </div>
      {posts && typeof postCount === "number" ? (
        <>
          <div className={style.grid}>
            {posts.map((v: PostCardType) => (
              <PostCard key={v.postId} postCard={v} />
            ))}
          </div>
          <Pagination
            cursor={cursor}
            handlePageClick={handlePageClick}
            itemsPerPage={18}
            postCount={postCount <= 0 ? 1 : postCount}
          />
        </>
      ) : (
        <div className={style["loading-wrapper"]}>
          <FavoriteLoading type="full" />
          <div style={{ paddingBottom: "2000px" }} />
        </div>
      )}
    </>
  )
}

export default function ContentPage({ query }: { query: PostFindQuery }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["posts-page"])

  const { data: popularPosts } = useQuery<PostCardType[]>({
    queryKey: queryKey.posts["popular"],
    queryFn: () => getPopularPosts(lang as LangType),
  })

  const sliderRef = useRef(null)
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return
    ;(sliderRef.current as any).swiper.slidePrev()
  }, [])
  const handleNext = useCallback(() => {
    if (!sliderRef.current) return
    ;(sliderRef.current as any).swiper.slideNext()
  }, [])

  return (
    <>
      <div className={"global-page"}>
        <div className={"global-page-content"}>
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
            {popularPosts ? (
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
            ) : (
              <div className={style["loading-wrapper"]}>
                <FavoriteLoading type="full" />
              </div>
            )}
          </div>

          <Suspense
            fallback={
              <>
                <div className={"global-page-title global-page-title-sort"}>
                  <div className="global-page-title-observer"></div>
                  <h1>
                    <Image width={35} height={35} src="/images/emoji/rocket.png" alt="rocket" />
                    <span>{t(query)}</span>
                  </h1>

                  <div className={"global-page-sort"}>
                    {sortOptions.map(({ value }) => (
                      <button key={`sort-btn-${value}`}>
                        <span>{t(value, { ns: "nav" })}</span>
                        <FontAwesomeIcon icon={faChevronUp} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className={style["loading-wrapper"]}>
                  <FavoriteLoading type="full" />
                  <div style={{ paddingBottom: "2000px" }} />
                </div>
              </>
            }
          >
            <CategoryPostsComponent lang={lang as LangType} query={query} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
