"use client"

import { useNewPostStore } from "@/_store/newPost"

import classNames from "classNames"
import { nanoid } from "nanoid"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"

import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"
import { TournamentCandidateType } from "@/_types/post/tournament"

import NewPostLayout from "@/_components/NewPostLayout"
import { uploadImage } from "@/_queries/newPost"
import { useDropzone } from "react-dropzone"
import Dropzone from "../../../../../_components/Dropzone"

const cx = classNames.bind(style)

export default function TournamentContent() {
  const { t } = useTranslation(["newPost"])
  const { newPost } = useNewPostStore()
  const { addCandidate, setNewPost, deleteCandidate, candidates } = useNewPostStore()
  const swiperRef = useRef<any | null>(null)

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
    maxSize: 8000000,
  })

  return (
    newPost && (
      <NewPostLayout>
        <section className={cx("styler-section")}>
          <h1>{t("editCandidate")}</h1>
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
                  <span>{t("noCandidates")}</span>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className={cx("styler-section")}>
          <h1>{t("candidatePreviewAndAdd")}</h1>
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
                  <span>{t("addMultiplePictures")}</span>
                </div>
              </div>
            )}
          </ul>
        </section>
      </NewPostLayout>
    )
  )
}
