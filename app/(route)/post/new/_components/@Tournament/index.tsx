"use client"

import { useNewPostStore } from "@/_store/newPost"

import PostInfo from "@/_components/PostInfo"
import classNames from "classNames"
import { nanoid } from "nanoid"
import { useCallback, useRef, useState } from "react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"

// Import Swiper styles
import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"
import { TournamentCandidateType } from "@/_types/post/tournament"

import Dropzone from "../@Contest/Dropzone"

const cx = classNames.bind(style)

export default function TournamentContent() {
  const { newPost } = useNewPostStore()
  const { addCandidate, deleteCandidate, candidates } = useNewPostStore()
  const swiperRef = useRef<any | null>(null)

  const createPollingCandidate = useCallback(() => {
    addCandidate({
      index: candidates.length,
      payload: {
        listId: nanoid(10),
        title: "",
        imageSrc: "",
        win: 0,
        lose: 0,
        pick: 0,
        number: candidates.length + 1,
      } as TournamentCandidateType,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.length])

  const deleteCandidateList = (index: number) => {
    deleteCandidate({ index })
  }

  const clickCandidate = (index: number) => {
    if (swiperRef?.current) {
      swiperRef?.current.swiper.slideTo(index)
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex)
  }

  return (
    newPost && (
      <>
        <div className={cx(style["tournament-post"])}>
          <div className={cx(style["tournament-post-inner"])}>
            <PostInfo title={newPost.title} description={newPost.description} isEdit={true} />
            <div className={cx(style.content)}>
              {candidates.length ? (
                <Swiper
                  ref={swiperRef}
                  slidesPerView={2}
                  freeMode={true}
                  modules={[FreeMode]}
                  className={cx(style.slider)}
                  onSlideChange={handleSlideChange}
                >
                  {candidates.map(({ listId }, index) => (
                    <SwiperSlide key={`tournament_candidate_${listId}`}>
                      <Dropzone index={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className={cx(style["no-candidate"])}>
                  <div>
                    <span>토너먼트 후보를 등록해주세요</span>
                  </div>
                </div>
              )}
            </div>
            <section>
              <h1 className={cx(style["section-title"])}>토너먼트 후보</h1>
              <ul className={cx(style["candidate-list"])}>
                {candidates.map(({ listId, imageSrc }, index) => (
                  <li className={cx(style.candidate)} key={`tournament_candidate_list_${listId}`}>
                    <button
                      className={cx(style.inner, {
                        [style.active]: currentIndex === index || currentIndex + 1 === index,
                      })}
                      onClick={() => clickCandidate(index)}
                    >
                      <div
                        style={{
                          backgroundImage: !!imageSrc ? getImageUrl({ url: imageSrc }) : noImageUrl,
                        }}
                        className={cx(style.image)}
                      ></div>
                      <div onClick={() => deleteCandidateList(index)} className={cx(style.delete)}>
                        <i className={cx("fa-solid", "fa-close")}></i>
                      </div>
                    </button>
                  </li>
                ))}
                <li className={cx(style.candidate, style.add)}>
                  <button className={cx(style.inner)} onClick={createPollingCandidate}>
                    <div className={cx(style.icon)}>
                      <i className={cx("fa-solid", "fa-plus")}></i>
                    </div>
                  </button>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </>
    )
  )
}
