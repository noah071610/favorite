"use client"

import { useNewPostStore } from "@/_store/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import { calculateVoteRatio, randomNum } from "@/_utils/math"
import { useEffect, useMemo } from "react"
import CountUp from "react-countup"
import Dropzone from "./Dropzone"

import style from "@/(route)/post/contest/[postId]/style.module.scss"
import classNames from "classNames"
const cx = classNames.bind(style)

const ContestResultImage = ({ direction, ratio }: { direction: "left" | "right"; ratio: string }) => {
  const { leftCandidate, rightCandidate } = useContestTypeStore()
  const candidate = direction === "left" ? leftCandidate : rightCandidate

  return (
    <div className={cx(style["contest-candidate"], style["contest-result"])}>
      <div className={cx(style["image-wrapper"])}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={cx(style.image)}
        />
        <div className={cx(style.description)}>
          {/* <div className={`graph-wrapper graph-wrapper-${direction}`}></div> */}

          <div className={cx(style["title-wrapper"])}>
            <div style={{ width: `calc(${ratio}%)` }}>
              <div className={cx(style.gauge)}></div>
            </div>
            <h1 className={cx(style.title)}>{candidate?.title.trim() ? candidate.title : "후보명을 입력해주세요"}</h1>
            <p className={cx(style.count)}>
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
      count: randomNum(20, 100),
    })
    setCandidate("right", {
      count: randomNum(20, 100),
    })
  }, [])

  return (
    <div className={cx(style.content, "contest")}>
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
