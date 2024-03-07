"use client"

import { useNewPostStore } from "@/_store/newPost"

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

import { uploadImage } from "@/_queries/newPost"
import { useDropzone } from "react-dropzone"
import Dropzone from "../../../../../_components/Dropzone"

const cx = classNames.bind(style)

export default function TournamentContent() {
  const { newPost } = useNewPostStore()
  const { addCandidate, setNewPost, deleteCandidate, candidates } = useNewPostStore()
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

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ type, payload: e.target.value })
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file: any) => {
      const formData = new FormData()
      formData.append("image", file)

      const { msg, imageSrc } = await uploadImage(formData)
      if (msg === "ok") {
        addCandidate({
          index: candidates.length,
          payload: {
            listId: nanoid(10),
            title: "",
            imageSrc,
            win: 0,
            lose: 0,
            pick: 0,
            number: candidates.length + 1,
          } as TournamentCandidateType,
        })
      }
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
  })

  return (
    newPost && (
      <>
        <div className={cx("main")}>
          <div className={cx("editor")}>
            <section className={cx("styler-section")}>
              <h1>제목 입력</h1>
              <input
                className={"title-input"}
                placeholder="제목 입력"
                value={newPost.title ?? ""}
                onChange={(e) => onChangeInput(e, "title")}
              />
            </section>
            <section className={cx("styler-section")}>
              <h1>설명 입력</h1>
              <input
                className={"description-input"}
                placeholder="설명 입력 (옵션)"
                value={newPost.description ?? ""}
                onChange={(e) => onChangeInput(e, "description")}
              />
            </section>
            <section className={cx("styler-section")}>
              <h1>후보 설정</h1>
              <div className={cx(style["slide-section"])}>
                {candidates.length ? (
                  <div className={cx(style.slider)}>
                    <Swiper
                      ref={swiperRef}
                      slidesPerView={1}
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
                  </div>
                ) : (
                  <div className={cx(style["no-candidate"])}>
                    <div>
                      <span>토너먼트 후보를 등록해주세요</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
            <section className={cx("styler-section")}>
              <h1>후보 보기 및 추가</h1>
              <ul className={cx(style["candidate-list"])}>
                {candidates.map(({ listId, imageSrc }, index) => (
                  <li className={cx(style.candidate)} key={`tournament_candidate_list_${listId}`}>
                    <button
                      className={cx(style.inner, {
                        [style.active]: currentIndex === index,
                      })}
                      onClick={() => {
                        clickCandidate(index)
                      }}
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
                {candidates.length > 0 ? (
                  <li {...getRootProps()} className={cx(style.candidate, style.add)}>
                    <input {...getInputProps()} />
                    <button className={cx(style.inner)}>
                      <div className={cx(style.icon)}>
                        <i className={cx("fa-solid", "fa-plus")}></i>
                      </div>
                    </button>
                  </li>
                ) : (
                  <div {...getRootProps()} className={cx(style["no-list"])}>
                    <input {...getInputProps()} />
                    <div className={cx(style["no-list-inner"])}>
                      <i className={cx("fa-solid", "fa-download")}></i>
                      <span>여러개 사진 추가</span>
                    </div>
                  </div>
                )}
              </ul>
            </section>
          </div>
        </div>
      </>
    )
  )
}
