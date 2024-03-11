"use client"

import { fadeMoveUpAnimation } from "@/_styles/animation"
import { TournamentCandidateChartType } from "@/_types/post/tournament"
import { faHandBackFist, faStar, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const dataArr = [
  { label: "info.pickPercent", value: "pickPercent" },
  { label: "info.winPercent", value: "winPercent" },
  { label: "info.losePercent", value: "losePercent" },
] as const

const uniqueDataArr = [
  { label: "info.ratingRank", value: "ratingRank", icon: faStar },
  { label: "info.pickRank", value: "pickRank", icon: faTrophy },
  { label: "info.winRank", value: "winRank", icon: faHandBackFist },
] as const

const delay = 130

export default function Info({
  candidate,
  index,
  uniqueData,
  candidateLength,
  isIntersecting,
}: {
  candidate: TournamentCandidateChartType
  index: number
  uniqueData?: {
    pickRank: number
    winRank: number
    ratingRank: number
  }
  candidateLength?: number
  isIntersecting: boolean
}) {
  const { t } = useTranslation(["content"])
  return (
    <div className={cx(style.info)}>
      {dataArr.map(({ value, label }, i) => (
        <div
          style={isIntersecting ? fadeMoveUpAnimation(1000, index * delay + (i * 100 + 50)) : {}}
          key={`${candidate.listId}_${value}`}
          className={cx(style.table)}
        >
          <div className={cx(style["info-label"])}>
            <div className={cx(style.mark, style[value])}></div>
            <label>{t(label)}</label>
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
            style={isIntersecting ? fadeMoveUpAnimation(1000, index * delay + (i * 100 * 3 + 50)) : {}}
            key={`${candidate.listId}_${value}`}
            className={cx(style.table)}
          >
            <div className={cx(style["info-label"])}>
              <div className={cx(style.icon)}>
                <FontAwesomeIcon icon={icon} />
              </div>
              <label>{t(label)}</label>
            </div>
            <div className={cx(style["info-percent"])}>
              <CountUp duration={4} end={uniqueData[value]} />
              <span>{" / "}</span>
              <span>{candidateLength}</span>
            </div>
          </div>
        ))}
    </div>
  )
}
