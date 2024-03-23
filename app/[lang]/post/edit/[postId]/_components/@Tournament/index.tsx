"use client"

import { useNewPostStore } from "@/_store/newPost"

import { useTranslation } from "@/i18n/client"
import classNames from "classNames"
import { nanoid } from "nanoid"
import { useCallback, useRef, useState } from "react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"

import { getImageUrl } from "@/_data"
import { noImageUrl } from "@/_data/post"

import Dropzone from "@/_components/Dropzone"
import NewPostLayout from "@/_components/NewPostLayout"
import { uploadImage } from "@/_queries/newPost"
import { faClose, faDownload, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useParams } from "next/navigation"
import { useDropzone } from "react-dropzone"

const cx = classNames.bind(style)

export default function TournamentContent() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const {
    addCandidate,
    deleteCandidate,
    content: { candidates },
  } = useNewPostStore()
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, data: imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          addCandidate({
            payload: {
              listId: nanoid(10),
              title: "",
              description: "",
              imageSrc,
              win: 0,
              lose: 0,
              pick: 0,
              number: candidates.length + 1,
            },
          })
        }
      })
    },
    [addCandidate, candidates.length]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  return (
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
                  <FontAwesomeIcon icon={faClose} />
                </div>
              </button>
            </li>
          ))}
          {candidates.length > 0 ? (
            <li {...getRootProps()} className={cx(style.candidate, style.add)}>
              <input {...getInputProps()} />
              <button className={cx(style.inner)}>
                <div className={cx(style.icon)}>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </button>
            </li>
          ) : (
            <div {...getRootProps()} className={cx(style["no-list"])}>
              <input {...getInputProps()} />
              <div className={cx(style["no-list-inner"])}>
                <FontAwesomeIcon icon={faDownload} />
                <span>{t("addMultiplePictures")}</span>
              </div>
            </div>
          )}
        </ul>
      </section>
    </NewPostLayout>
  )
}
