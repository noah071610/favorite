"use client"

import {
  chartBackgroundColors as _chartBackgroundColors,
  chartBorderColors as _chartBorderColors,
  generationChartData,
  generationChartOption,
  rankingOptions,
} from "@/_data"
import { usePostStore } from "@/_store/post"
import { usePostingStore } from "@/_store/posting"
import { scaleUpAnimation } from "@/_styles/animation"
import { CandidateType } from "@/_types/post"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { useMemo } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import TextareaAutosize from "react-textarea-autosize"
import "./style.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement)

export default function ChartPart({ candidates, isEdit }: { candidates: CandidateType[]; isEdit?: boolean }) {
  const { viewCandidate } = usePostStore()
  const { newPost, setNewPost } = usePostingStore()

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
      chartBackgroundColors: viewCandidate
        ? _chartBackgroundColors.map((v, i) => (viewCandidate?.number === i + 1 ? v : "rgba(202, 202, 202, 0.2)"))
        : _chartBackgroundColors,
      chartBorderColors: viewCandidate
        ? _chartBorderColors.map((v, i) => (viewCandidate?.number === i + 1 ? v : "rgba(202, 202, 202, 1)"))
        : _chartBorderColors,
    }),
    [viewCandidate]
  )

  return (
    <>
      <section
        className="ranking-chart"
        style={{
          height: `${
            candidates.length <= 5 ? (candidates.length ? candidates.length * 50 === 0 : 200) : candidates.length * 40
          }px`,
        }}
      >
        <Bar
          options={rankingOptions as any}
          data={{
            labels: ranking_data.labels,
            datasets: [
              {
                data: ranking_data.data,
                backgroundColor: chartBackgroundColors,
                borderColor: chartBorderColors,
              },
            ],
          }}
        />
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
            ></i>
            <i
              style={{
                background: "linear-gradient(180deg, rgba(255,207,207,0.3) 50%, rgba(255,141,141,1) 50%)",
              }}
              className="icon fa-solid fa-person-dress"
            ></i>
          </div>
        </div>
      </section>
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
          <p>
            {`트위터의 드립 문화를 일컫는 유행어. 글자 그대로 아무 말이나 마구 하는 모양새를 일컫는 말로, 아무렇게나 말을
      내뱉기 편한 트위터의 특성을 그대로 표현하고 있다. 아래의 코너가 방송된 이후로 트위터 내에서는 인싸들이 우리
      동네 유행어를 가져다 쓴다는 푸념이 몇 번 등장했다. 유튜브의 자막 기능 중 자동생성의 경우 동영상의 음성을
      인식하여 자막으로 변환하는 기능인데 여전히 영어 이외의 언어, 특히 한국어 인식 정확도는 최악이라서 이 기능을
      사용하면 말 그대로 아무말 대잔치가 나온다. 내부가 딥러닝으로 되어있는데, 학습 데이터로 TV 뉴스를 썼는지
      그쪽에서 많이 쓸 법한 단어 위주로 나오며 이후로는 문장과 문장 사이에 개연성이라곤 찾아볼 수 없는 완전히 다른
      주제의 문장들이 줄줄이 나온다던가 인과 관계가 맞지 않는 문장을 뇌를 거치지 않고 줄줄 내뱉는 모양새를 보고 아무
      말 대잔치라고 부르기도 한다.`}
          </p>
        )}
      </section>
    </>
  )
}
