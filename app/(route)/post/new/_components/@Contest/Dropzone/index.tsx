"use client"

import { uploadImage } from "@/_queries/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

import style from "@/(route)/post/contest/[postId]/candidate.module.scss"
import { useTournamentStore } from "@/_store/newPost/tournament"
import classNames from "classNames"
import _style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Dropzone({ direction }: { direction: "left" | "right" | number }) {
  const { leftCandidate, rightCandidate, setCandidate } = useContestTypeStore()
  const { tournamentCandidates, changeCandidate } = useTournamentStore()
  const candidate =
    typeof direction === "string"
      ? direction === "left"
        ? leftCandidate
        : rightCandidate
      : tournamentCandidates[direction]

  const onChangeInput = (e: any) => {
    if (e.target.value.length >= 40) return
    if (typeof direction === "string") {
      setCandidate(direction, {
        title: e.target.value,
      })
    } else {
      changeCandidate(direction, {
        title: e.target.value,
      })
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          if (typeof direction === "string") {
            setCandidate(direction, { imageSrc })
          } else {
            changeCandidate(direction, {
              imageSrc,
            })
          }
        }
      })
    },
    [changeCandidate, direction, setCandidate]
  )

  const onClickDeleteImage = () => {
    if (typeof direction === "string") {
      setCandidate(direction, { imageSrc: "" })
    } else {
      changeCandidate(direction, {
        imageSrc: "",
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })
  return (
    <>
      <div className={cx(style.candidate, style[direction])}>
        <div className={cx(style["candidate-inner"])}>
          {candidate.imageSrc ? (
            <>
              <button onClick={onClickDeleteImage} className={cx(_style.close)}>
                <i className={cx("fa-solid", "fa-close")}></i>
              </button>
              <div
                style={{
                  backgroundImage: `url('${candidate.imageSrc}')`,
                }}
                className={cx(style.thumbnail)}
              ></div>
              <div
                className={cx(style["thumbnail-overlay"])}
                style={{
                  backgroundImage: `url('${candidate.imageSrc}')`,
                }}
              ></div>
            </>
          ) : (
            <div
              style={{
                background: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU') center / cover`,
              }}
              className={cx(_style["thumbnail-drop-zone"])}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
            </div>
          )}
          <div className={cx(style.description)}>
            <div className={cx(style["title-wrapper"])}>
              <TextareaAutosize
                placeholder="후보명 입력 (필수)"
                className={cx(_style["title-input"])}
                value={candidate.title}
                onChange={onChangeInput}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
