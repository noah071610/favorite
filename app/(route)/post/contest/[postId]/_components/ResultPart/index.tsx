"use client"

import { ContestCandidateType } from "@/_types/post/contest"
import { calculateVoteRatio } from "@/_utils/math"
import CountUp from "react-countup"

import classNames from "classNames"
import style from "../candidate.module.scss"
const cx = classNames.bind(style)

export default function ResultPart({
  candidates,
  direction,
  selected,
}: {
  candidates: ContestCandidateType[]
  direction: "left" | "right"
  selected: string | null
}) {
  const candidate = candidates[direction === "left" ? 0 : 1]
  const ratio = calculateVoteRatio(candidates[0].pick, candidates[1].pick)[direction]

  return (
    <div
      className={cx(style.candidate, style.result, {
        [style.selected]: selected === candidate.listId,
        [style.unselected]: selected !== candidate.listId,
      })}
    >
      <div className={cx(style.border)}></div>

      {selected === candidate.listId && (
        <div className={cx(style["candidate-background"], style[direction])}>
          <span>LIKE!</span>
        </div>
      )}

      <div className={cx(style["candidate-inner"])}>
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
        <div className={cx(style.description)}>
          <div className={cx(style["title-wrapper"])}>
            <div style={{ width: `calc(${ratio}%)` }} className={cx(style.graph, style[`graph-${direction}`])}>
              <div className={cx(style.gauge)}></div>
            </div>
            <h1 className={cx(style.title)}>{candidate?.title}</h1>
            <p className={cx(style.count)}>
              <span>
                <CountUp prefix="(" suffix="표)" duration={4} end={candidate.pick} />
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
