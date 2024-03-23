"use client"

import { backgroundColors, borderColors } from "@/_data/colors"
import { CandidateType } from "@/_types/post"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classNames"
import { useMemo } from "react"
import { Bar } from "react-chartjs-2"
import style from "./style.module.scss"
const cx = classNames.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

const rankingOptions = {
  indexAxis: "y" as const,
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        min: 0,
        precision: 0,
        beginAtZero: true,
        callback: function (value: number) {
          return value
        },
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
}

export default function ChartPart({
  candidates,
  resultDescription,
}: {
  resultDescription?: string
  candidates: CandidateType[]
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
        backgroundColor: backgroundColors,
        borderColor: borderColors,
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
      {resultDescription && (
        <section className={cx(style["chart-description"])}>
          <p>{resultDescription}</p>
        </section>
      )}
    </>
  )
}
