"use client"

import LoadingBar from "@/_components/Loading/LoadingBar"
import { getImageUrl } from "@/_data"
import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { TournamentCandidateChartType } from "@/_types/post/tournament"
import classNames from "classNames"
import CountUp from "react-countup"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const dataArr = [
  { label: "우승 확률", value: "pickPercent" },
  { label: "매치 승리 확률", value: "winPercent" },
  { label: "매치 패배 확률", value: "losePercent" },
] as const

const uniqueDataArr = [
  { label: "종합 평가 순위", value: "ratingRank", icon: ["fa-solid", "fa-star"] },
  { label: "우승 순위", value: "pickRank", icon: ["fa-solid", "fa-trophy"] },
  { label: "승리 순위", value: "winRank", icon: ["fa-solid", "fa-hand-back-fist"] },
] as const

const delay = 130

export default function Candidate({
  selected,
  candidate,
  index,
  uniqueData,
  candidateLength,
}: {
  selected: boolean
  candidate: TournamentCandidateChartType
  index: number
  uniqueData?: {
    pickRank: number
    winRank: number
    ratingRank: number
  }
  candidateLength?: number
}) {
  const imageStatus = useProgressiveImage(candidate.imageSrc)

  return (
    <li className={cx(style.candidate, { [style.selected]: selected })}>
      <div className={cx(style.left)}>
        {imageStatus === "success" && (
          <div
            style={{
              backgroundImage: getImageUrl({ url: candidate.imageSrc }),
            }}
            className={cx(style.image)}
          />
        )}
        {imageStatus === "loading" && (
          <div className={cx(style.loading)}>
            <LoadingBar />
          </div>
        )}
      </div>
      <div className={cx(style.right)}>
        <div className={cx(style.title)}>
          <h1>{candidate.title}</h1>
        </div>
        <div className={cx(style.content)}>
          <div className={cx(style.chart)}>
            {dataArr.map(({ value }) => (
              <div key={`${candidate.listId}_${value}`} className={cx(style["gauge-outer"], style[value])}>
                <div style={{ width: `${candidate[value]}%` }} className={cx(style["gauge-inner"])}>
                  <div
                    style={{
                      animation: `${style.move} 700ms ${index * delay}ms cubic-bezier(0, 0.97, 1, 1.01) forwards`,
                    }}
                    className={cx(style["gauge"])}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={cx(style.info)}>
            {dataArr.map(({ value, label }, i) => (
              <div
                style={fadeMoveUpAnimation(1000, index * delay + (i * 100 + 50))}
                key={`${candidate.listId}_${value}`}
                className={cx(style.table)}
              >
                <div className={cx(style["info-label"])}>
                  <div className={cx(style.mark, style[value])}></div>
                  <label>{label}</label>
                </div>
                <div className={cx(style["info-percent"])}>
                  <CountUp
                    suffix="%"
                    duration={4}
                    decimals={2}
                    decimal=","
                    separator=" "
                    end={parseFloat(candidate[value])}
                  />
                </div>
              </div>
            ))}
            {uniqueData &&
              uniqueDataArr.map(({ value, label, icon }, i) => (
                <div
                  style={fadeMoveUpAnimation(1000, index * delay + (i * 100 * 3 + 50))}
                  key={`${candidate.listId}_${value}`}
                  className={cx(style.table)}
                >
                  <div className={cx(style["info-label"])}>
                    <div className={cx(style.icon)}>
                      <i className={cx(icon[0], icon[1])}></i>
                    </div>
                    <label>{label}</label>
                  </div>
                  <div className={cx(style["info-percent"])}>
                    <CountUp duration={4} end={uniqueData[value]} />
                    <span>{" / "}</span>
                    <span>{candidateLength}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </li>
  )
}
