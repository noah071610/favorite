"use client"

import { ContestContentType } from "@/_types/post/post"
import { calculateVoteRatio } from "@/_utils/math"
import classNames from "classnames"
import CountUp from "react-countup"

export default function ResultPart({
  content,
  direction,
  selected,
}: {
  content: ContestContentType
  direction: "left" | "right"
  selected: "left" | "right" | null
}) {
  const candidate = content[direction]
  const ratio = calculateVoteRatio(content.left.count, content.right.count)[direction]

  return (
    <div
      className={classNames("contest-candidate", "isResultPage", {
        selected: selected === direction,
        unselected: selected !== direction,
      })}
    >
      <div className="border"></div>
      <div className={classNames("card")}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
          className={classNames("thumbnail")}
        ></div>
        <div
          onClick={() => console.log("gg")}
          className="thumbnail-overlay"
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
        ></div>
        <div className="description">
          {/* <div className={`graph-wrapper graph-wrapper-${direction}`}></div> */}

          <div className="title-wrapper">
            <div style={{ width: `calc(${ratio}%)` }} className={`graph graph-${direction}`}>
              <div className="gauge"></div>
            </div>
            <h1 className="title">{candidate?.title}</h1>
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
