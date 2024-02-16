"use client"

import { uploadImage } from "@/_queries/newPost"
import { useNewPostStore } from "@/_store/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import { calculateVoteRatio, randomNum } from "@/_utils/math"
import classNames from "classnames"
import { useCallback, useEffect, useMemo } from "react"
import CountUp from "react-countup"
import { useDropzone } from "react-dropzone"
import TextareaAutosize from "react-textarea-autosize"

const ContestResultImage = ({ direction, ratio }: { direction: "left" | "right"; ratio: string }) => {
  const { leftCandidate, rightCandidate } = useContestTypeStore()
  const candidate = direction === "left" ? leftCandidate : rightCandidate

  return (
    <div className="contest-candidate contest-result">
      <div className={classNames("image-wrapper")}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={classNames("image")}
        />
        <div className="description">
          {/* <div className={`graph-wrapper graph-wrapper-${direction}`}></div> */}

          <div className="title-wrapper">
            <div style={{ width: `calc(${ratio}%)` }} className={`graph graph-${direction}`}>
              <div className="gauge"></div>
            </div>
            <h1 className="title">{candidate?.title.trim() ? candidate.title : "후보명을 입력해주세요"}</h1>
            <p className="count">
              <span>
                <CountUp prefix="(" suffix="표)" duration={4} end={candidate.count} />
              </span>
              {" / "}
              <span>
                <CountUp prefix="(" suffix="%)" separator=" " decimals={2} decimal="," end={parseFloat(ratio)} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Dropzone = ({ direction }: { direction: "left" | "right" }) => {
  const { leftCandidate, rightCandidate, setCandidate } = useContestTypeStore()
  const candidate = direction === "left" ? leftCandidate : rightCandidate

  const onChangeInput = (e: any) => {
    if (e.target.value.length >= 40) return
    setCandidate(direction, {
      title: e.target.value,
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setCandidate(direction, { imageSrc })
        }
      })
    },
    [direction]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })
  return (
    <>
      <div className="contest-candidate">
        <div
          style={{
            background: `url('${candidate.imageSrc}') center / cover`,
          }}
          className={classNames("thumbnail", { active: isDragActive })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
        </div>
        <div className="description">
          <div className="title-wrapper">
            <TextareaAutosize
              placeholder="후보명 입력 (필수)"
              className=" title-input"
              value={candidate.title}
              onChange={onChangeInput}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function ContestContent() {
  const { newPostStatus } = useNewPostStore()
  const { leftCandidate, rightCandidate, setCandidate } = useContestTypeStore()
  const isResultPage = newPostStatus === "result"

  const ratio = useMemo(
    () => (isResultPage ? calculateVoteRatio(leftCandidate.count, rightCandidate.count) : { left: "0", right: "0" }),
    [isResultPage]
  )

  useEffect(() => {
    setCandidate("left", {
      title: "",
      imageSrc: "",
      count: randomNum(20, 100),
    })
    setCandidate("right", {
      title: "",
      imageSrc: "",
      count: randomNum(20, 100),
    })
  }, [])

  return (
    <div className={classNames("content", "contest")}>
      {(["left", "right"] as Array<"left" | "right">).map((dr) => (
        <div key={dr} className={dr}>
          {isResultPage ? (
            <ContestResultImage ratio={dr === "left" ? ratio.left : ratio.right} direction={dr} />
          ) : (
            <Dropzone direction={dr} />
          )}
        </div>
      ))}
    </div>
  )
}
