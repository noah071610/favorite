"use client"

import { faPerson, faPersonDress } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"
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
        // Include a dollar sign in the ticks
        callback: function (value: string) {
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

const labels = ["January", "February", "March", "January", "February", "January", "February", "March"]

export const data = {
  labels,
  datasets: [
    {
      data: labels.map(() => Math.floor(Math.random() * 7) + 1),
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

export default function Result({}: {}) {
  return (
    <div className="result">
      <div className="ranking" style={{ height: `${labels.length <= 5 ? labels.length * 50 : labels.length * 40}px` }}>
        <Bar options={options as any} data={data} />
      </div>
      <div className="test">
        <div>
          <Doughnut
            options={{
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                bar: {
                  borderWidth: 0,
                },
              },
            }}
            data={d_data}
          />
        </div>
        <div>
          <div className="icon-wrapper">
            <FontAwesomeIcon
              className="icon girl"
              style={{
                background: "linear-gradient(to right, #ff6e7f, #bfe9ff) !important", // 그라데이션 색상을 조절하세요.
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundClip: "text", // 수정된 부분
              }}
              icon={faPerson}
            />
          </div>
          <div className="icon-wrapper">
            <FontAwesomeIcon className="icon girl" icon={faPersonDress} />
          </div>
        </div>
      </div>
    </div>
  )
}
