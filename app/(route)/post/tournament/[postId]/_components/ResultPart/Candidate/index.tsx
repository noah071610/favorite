"use client"

import { fadeMoveUpAnimation } from "@/_styles/animation"
import { TournamentCandidateChartType } from "@/_types/post/tournament"
import classNames from "classNames"
import CountUp from "react-countup"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const dataArr = [
  { label: "우승 확률", value: "pick" },
  { label: "매치 승리 확률", value: "win" },
  { label: "매치 패배 확률", value: "lose" },
] as const

const delay = 130

export default function Candidate({ candidate, index }: { candidate: TournamentCandidateChartType; index: number }) {
  return (
    <li className={cx(style.candidate)}>
      <div className={cx(style.left)}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
            animation: `${style.rotate} 170ms ${index * delay}ms forwards`,
          }}
          className={cx(style.image)}
        />
      </div>
      <div className={cx(style.right)}>
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
              <div className={cx(style["info-title"])}>
                <div className={cx(style.mark, style[value])}></div>
                <h4>{label}</h4>
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
        </div>
      </div>
    </li>
  )
}
