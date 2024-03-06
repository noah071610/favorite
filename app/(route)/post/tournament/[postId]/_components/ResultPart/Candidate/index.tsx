"use client"

import LoadingBar from "@/_components/@Global/Loading/LoadingBar"
import { getImageUrl } from "@/_data"
import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { TournamentCandidateChartType } from "@/_types/post/tournament"
import classNames from "classNames"
import Info from "./Info"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const dataArr = [
  { label: "우승 확률", value: "pickPercent" },
  { label: "매치 승리 확률", value: "winPercent" },
  { label: "매치 패배 확률", value: "losePercent" },
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
      <div className={cx(style.top)}>
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
            <div className="global-pc-visible">
              <Info uniqueData={uniqueData} candidateLength={candidateLength} index={0} candidate={candidate} />
            </div>
          </div>
        </div>
      </div>

      <div className="global-mobile-visible">
        <Info uniqueData={uniqueData} candidateLength={candidateLength} index={0} candidate={candidate} />
      </div>
    </li>
  )
}
