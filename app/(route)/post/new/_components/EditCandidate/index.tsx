"use client"

import "@/(route)/post/[postId]/_components/Voting/style.scss"
import { scaleUpAnimation } from "@/_styles/animation"
import TextareaAutosize from "react-textarea-autosize"

import { uploadImage } from "@/_queries/post"
import { usePostingStore } from "@/_store/posting"
import { CandidateType } from "@/_types/post"
import classNames from "classnames"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import "./style.scss"

export default function EditCandidate({
  selectedCandidate: { count, listId, title, description, imageSrc },
}: {
  selectedCandidate: CandidateType
}) {
  const { changeCandidate } = usePostingStore()

  const onChangeInput = (event: any, type: "title" | "description") => {
    const text = event.target.value
    if (type === "title" && text.length > 19) return
    changeCandidate(listId, { [type]: text })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        uploadImage(file)
      })
    },
    [changeCandidate, listId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div key={listId} className="voting">
      <div
        style={{
          background: `url('${imageSrc}') center / cover`,
          ...scaleUpAnimation(250),
        }}
        className={classNames("voting-image", { active: isDragActive })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
      </div>
      <div className="voting-description">
        <input
          placeholder="후보명 입력 (필수)"
          className="title-input"
          value={title}
          onChange={(e) => onChangeInput(e, "title")}
        />

        <TextareaAutosize
          placeholder="후보 설명 입력 (옵션)"
          className="description-input"
          value={description}
          onChange={(e) => onChangeInput(e, "description")}
          maxLength={180}
        />
      </div>
    </div>
  )
}
