"use client"

import { candidates } from "@/_utils/faker"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classnames"
import { useState } from "react"
import ChartPart from "./_components/Chartpart"
import CommentPart from "./_components/CommentPart"
import "./style.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

export const d_data = {
  labels: ["10대", "20대", "30대", "40~50대", "60대 이상"],
  datasets: [
    {
      label: "표",
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
}
export const options = {
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
          return value + "표"
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

export const data = {
  labels: candidates.map(({ title }) => title),
  datasets: [
    {
      data: candidates.map(({ count }) => count),
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
    },
  ],
}

export default function ResultPage({}: {}) {
  const [currentSection, setCurrentSection] = useState<"analytics" | "comments">("analytics")

  const onClickNav = (type: "analytics" | "comments") => {
    setCurrentSection(type)
  }
  return (
    <div className="result">
      <div className="result-nav">
        <button
          className={classNames({ active: currentSection === "analytics" })}
          onClick={() => onClickNav("analytics")}
        >
          통계
        </button>
        <button
          className={classNames({ active: currentSection === "comments" })}
          onClick={() => onClickNav("comments")}
        >
          코멘트
        </button>
        <div className={classNames("follower-div", {})}></div>
      </div>
      {currentSection === "analytics" ? <ChartPart /> : <CommentPart />}
    </div>
  )
}
