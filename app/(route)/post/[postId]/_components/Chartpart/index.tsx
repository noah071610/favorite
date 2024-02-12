"use client"

import {
  chartBackgroundColors as _chartBackgroundColors,
  chartBorderColors as _chartBorderColors,
  generationChartData,
  generationChartOption,
  rankingOptions,
} from "@/_data/chart"
import { useNewPostStore } from "@/_store/newPost"
import { usePostStore } from "@/_store/post"
import { scaleUpAnimation } from "@/_styles/animation"
import { ListType } from "@/_types/post"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classnames"
import { useMemo } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import TextareaAutosize from "react-textarea-autosize"
import "./style.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

export default function ChartPart({ candidates, isEdit }: { candidates: ListType[]; isEdit?: boolean }) {
  const { viewCandidateNum } = usePostStore()
  const { newPost, setNewPost } = useNewPostStore()

  const ranking_data = useMemo(
    () => ({
      labels: candidates.map(({ title }) => title),
      data: candidates.map(({ count }) => count),
    }),
    [candidates]
  )

  const onChangeDescription = (event: any) => {
    const text = event.target.value
    setNewPost({ chartDescription: text })
  }

  const { chartBackgroundColors, chartBorderColors } = useMemo(
    () => ({
      chartBackgroundColors: viewCandidateNum
        ? _chartBackgroundColors.map((v, i) => (viewCandidateNum === i + 1 ? v : "rgba(202, 202, 202, 0.2)"))
        : _chartBackgroundColors,
      chartBorderColors: viewCandidateNum
        ? _chartBorderColors.map((v, i) => (viewCandidateNum === i + 1 ? v : "rgba(202, 202, 202, 1)"))
        : _chartBorderColors,
    }),
    [viewCandidateNum]
  )

  const barData = useMemo(
    () => ({
      labels: ranking_data.labels,
      datasets: [
        {
          data: ranking_data.data,
          backgroundColor: chartBackgroundColors,
          borderColor: chartBorderColors,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ranking_data, chartBackgroundColors]
  )

  return (
    <div className="result">
      <div className={classNames("chart-part")}>
        {isEdit && (
          <div className="edit-overlay">
            <span>예시 데이터 입니다</span>
          </div>
        )}
        <section
          className="ranking-chart"
          style={{
            height: `${
              candidates.length <= 5 ? (candidates.length > 1 ? candidates.length * 50 : 200) : candidates.length * 40
            }px`,
          }}
        >
          <Bar options={rankingOptions as any} data={barData} />
        </section>
        <section className="sub-chart">
          <div className="generation">
            <Doughnut options={generationChartOption} data={generationChartData} />
          </div>
          <div className="gender">
            <div style={scaleUpAnimation(500)} className="gender-inner">
              <i
                style={{
                  background: "linear-gradient(180deg, rgba(207,229,255,0.3) 50%, rgba(112,145,255,1) 50%)",
                }}
                className="icon fa-solid fa-person"
              />
              <i
                style={{
                  background: "linear-gradient(180deg, rgba(255,207,207,0.3) 50%, rgba(255,141,141,1) 50%)",
                }}
                className="icon fa-solid fa-person-dress"
              />
            </div>
          </div>
        </section>
      </div>
      <section className="result-description">
        {isEdit ? (
          <TextareaAutosize
            placeholder="투표 결과 설명 입력"
            className="description-input"
            value={newPost?.chartDescription ?? ""}
            onChange={onChangeDescription}
            maxLength={180}
          />
        ) : (
          newPost?.chartDescription && <p>{newPost?.chartDescription}</p>
        )}
      </section>
    </div>
  )
}
