"use client"

import { chartBackgroundColors, chartBorderColors, rankingOptions } from "@/_data/chart"
import { PollingCandidateType } from "@/_types/post/polling"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classNames"
import { useMemo } from "react"
import { Bar } from "react-chartjs-2"
import style from "./style.module.scss"
const cx = classNames.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

export default function ChartPart({
  candidates,
  chartDescription,
}: {
  chartDescription?: string
  candidates: PollingCandidateType[]
}) {
  const ranking_data = useMemo(
    () => ({
      labels: candidates.map(({ title }) => title),
      data: candidates.map(({ pick }) => pick),
    }),
    [candidates]
  )

  const rankingData = {
    labels: ranking_data.labels,
    datasets: [
      {
        data: ranking_data.data,
        backgroundColor: chartBackgroundColors,
        borderColor: chartBorderColors,
      },
    ],
  }

  return (
    <>
      <div className={cx(style["chart-part"])}>
        <section
          className={cx(style["polling-chart"])}
          style={{
            height: `${
              candidates.length <= 4 ? (candidates.length > 2 ? candidates.length * 60 : 180) : candidates.length * 40
            }px`,
          }}
        >
          <Bar options={rankingOptions as any} data={rankingData} />
        </section>
      </div>
      {chartDescription && (
        <section className={cx(style["chart-description"])}>
          <p>{chartDescription}</p>
        </section>
      )}
    </>
  )
}
