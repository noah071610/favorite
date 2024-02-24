"use client"

import { chartBackgroundColors, chartBorderColors } from "@/_data/chart"
import { TournamentCandidateChartType, TournamentCandidateType } from "@/_types/post/tournament"
import classNames from "classNames"
import { cloneDeep } from "lodash"
import { useMemo, useState } from "react"
import CountUp from "react-countup"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const getTotals = (candidates: TournamentCandidateType[]) => {
  return candidates.reduce(
    (acc, { win, lose, pick }) => {
      acc.win = acc.win + win
      acc.lose = acc.lose + lose
      acc.pick = acc.pick + pick
      return acc
    },
    { win: 0, lose: 0, pick: 0 }
  )
}

const chartDataArr = [
  { label: "우승 확률", value: "pick" },
  { label: "매치 승리 확률", value: "win" },
  { label: "매치 패배 확률", value: "lose" },
] as const

const Candidate = ({ candidate }: { candidate: TournamentCandidateChartType }) => {
  return (
    <li className={cx(style.candidate)}>
      <div className={cx(style.left)}>
        <div style={{ backgroundImage: `url('${candidate.imageSrc}')` }} className={cx(style.image)} />
      </div>
      <div className={cx(style.right)}>
        <div className={cx(style.chart)}>
          {chartDataArr.map(({ value }, i) => (
            <div key={`${candidate.listId}_${value}`} className={cx(style["gauge-outer"])}>
              <div
                style={{ width: `${candidate[value]}%`, background: chartBackgroundColors[2 - i] }}
                className={cx(style["gauge-inner"])}
              >
                <div
                  style={{ border: `1px solid ${chartBorderColors[2 - i]}`, background: chartBackgroundColors[2 - i] }}
                  className={cx(style["gauge"])}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={cx(style.info)}>
          {chartDataArr.map(({ value, label }) => (
            <div key={`${candidate.listId}_${value}`} className={cx(style.table)}>
              <div className={cx(style["info-title"])}>
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

export default function ResultPart({ candidates }: { candidates: TournamentCandidateType[] }) {
  const [sortedStatus, setSortedStatus] = useState<"pick" | "win" | "lose">("pick")
  const total = getTotals(candidates)
  const sorted: TournamentCandidateChartType[] = useMemo(() => {
    const target = cloneDeep(candidates)
    switch (sortedStatus) {
      case "pick":
        target.sort((a, b) => b.pick - a.pick)
        break
      case "win":
        target.sort((a, b) => b.win - a.win)
        break
      case "lose":
        target.sort((a, b) => b.lose - a.lose)
        break
      default:
        target.sort((a, b) => b.number - a.number)
        break
    }

    return target.map((v) => {
      const total_match = v.win + v.lose
      return {
        ...v,
        win: ((v.win / total_match) * 100).toFixed(3),
        lose: ((v.lose / total_match) * 100).toFixed(3),
        pick: ((v.pick / total.pick) * 100).toFixed(3),
      }
    })
  }, [sortedStatus])
  return (
    <div className={cx(style.result)}>
      <section className={cx(style["tournament-chart"])}>
        <div className={cx(style["tournament-chart-inner"])}>
          {sorted.map((v, i) => (
            <Candidate candidate={v} key={`${v.listId}_${i}`} />
          ))}
        </div>
      </section>
    </div>
  )
}
