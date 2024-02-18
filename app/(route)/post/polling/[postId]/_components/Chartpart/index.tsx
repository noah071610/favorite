"use client"

import {
  chartBackgroundColors,
  chartBorderColors,
  generationChartData,
  generationChartOption,
  rankingOptions,
} from "@/_data/chart"
import { useNewPostStore } from "@/_store/newPost"
import { scaleUpAnimation } from "@/_styles/animation"
import { PollingCandidateType } from "@/_types/post/polling"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import classNames from "classNames"
import { useMemo } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = classNames.bind(style)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

export default function ChartPart({
  candidates,
  chartDescription,
  isEdit,
}: {
  chartDescription?: string
  candidates: PollingCandidateType[]
  isEdit?: boolean
}) {
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
    setNewPost({ type: "chartDescription", payload: text })
  }

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

  const description = isEdit ? newPost?.content.chartDescription : chartDescription

  return (
    <>
      <div className={cx(style["chart-part"])}>
        {isEdit && (
          <div className={cx(style["overlay"])}>
            <span>예시 데이터 입니다</span>
          </div>
        )}
        <section
          className={cx(style["polling-chart"])}
          style={{
            height: `${
              candidates.length <= 5 ? (candidates.length > 1 ? candidates.length * 50 : 200) : candidates.length * 40
            }px`,
          }}
        >
          <Bar options={rankingOptions as any} data={rankingData} />
        </section>
        <section className={cx(style["sub-chart"])}>
          <div className={cx(style.generation)}>
            <Doughnut options={generationChartOption} data={generationChartData} />
          </div>
          <div className={cx(style["gender-chart"])}>
            <div style={scaleUpAnimation(500)} className={cx(style["inner"])}>
              <i
                style={{
                  background: "linear-gradient(180deg, rgba(207,229,255,0.3) 50%, rgba(112,145,255,1) 50%)",
                }}
                className={cx(style.icon, "fa-solid", "fa-person")}
              />
              <i
                style={{
                  background: "linear-gradient(180deg, rgba(255,207,207,0.3) 50%, rgba(255,141,141,1) 50%)",
                }}
                className={cx(style.icon, "fa-solid", "fa-person-dress")}
              />
            </div>
          </div>
        </section>
      </div>
      <section className={cx(style["chart-description"])}>
        {isEdit ? (
          <TextareaAutosize
            placeholder="투표 결과 설명 입력"
            className={cx(style["description-input"])}
            value={description ?? ""}
            onChange={onChangeDescription}
            maxLength={180}
          />
        ) : (
          description && <p>{description}</p>
        )}
      </section>
    </>
  )
}
