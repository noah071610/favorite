"use client"

import { chartBackgroundColors as _chartBackgroundColors, chartBorderColors as _chartBorderColors } from "@/_data"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { scaleUpAnimation } from "@/_styles/animation"
import { PostType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { useParams } from "next/navigation"
import { useMemo } from "react"
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
      backgroundColor: _chartBackgroundColors,
      borderColor: _chartBorderColors,
      borderWidth: 1,
    },
  ],
}
const ranking_options = {
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

export default function ChartPart() {
  const { postId } = useParams<{ postId: string }>()
  const { data: post } = useQuery<PostType>({
    queryKey: ["getPost"],
    queryFn: () => getPost(postId),
  })

  const { viewCandidate } = usePostStore()

  const ranking_data = useMemo(
    () => ({
      labels: post?.content.map(({ title }) => title),
      data: post?.content.map(({ count }) => count),
    }),
    [post]
  )

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
    post && (
      <>
        <section
          className="ranking"
          style={{ height: `${post.content.length <= 5 ? post.content.length * 50 : post.content.length * 40}px` }}
        >
          <Bar
            options={ranking_options as any}
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
        <section className="chart">
          <div className="generation">
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
        </section>
      </>
    )
  )
}
