"use client"

import { ContentCardType } from "@/_types/post"
import { generateRandomDescription } from "@/_utils/random_kr"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import "./style.scss"

import CandidateCard from "./_components/CandidateCard"
import Result from "./_components/Result"

export const options = {
  responsive: true,
}

const dummyContentCards: ContentCardType[] = Array.from({ length: 10 }, (_, index) => ({
  title: `Card ${index + 1}`,
  description: generateRandomDescription(),
  images: Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(
    (_, i) => `https://picsum.photos/id/${index * 10 + i * 10}/1200/800`
  ),
  postId: `${index + 1}`,
  user: {
    userId: `user${index + 1}`,
    userName: `User ${index + 1}`,
    userImage: `https://placekitten.com/50/5${index + 1}`,
  },
}))

const candidates = [
  {
    listId: "1efwf",
    image_src:
      "https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp",
    title: "카마도 탄지로",
    description: `가족은 아버지(탄쥬로), 어머니(키에), 남동생 셋(타케오, 시게루, 로쿠타), 여동생 둘(네즈코,
    하나코)이 있다. 이들은 먼저 세상을 떠난 아버지와 네즈코를 제외하고는 모두 키부츠지 무잔의 습격으로
    사망한다. 이후 탄지로는 도깨비가 되어버린 네즈코를 인간으로 되돌리기 위해 귀살대에 입단하게 된다.`,
  },
  {
    listId: "fewf2",
    image_src:
      "https://i.namu.wiki/i/7GNlLmMO79bx0nouEdyv8kmpD2GKR3CiUo0UQCV9BjQigagw7Rohhy7sj8AMjfIEzQROn6l2J7QsJ3vta0aM_Q.webp",
    title: "렌고쿠 쿄주로",
    description: `귀살대 9명의 주 중 하나이며 이명은 염주(炎柱). 전집중 기본 5대 계파 중 하나인 화염의 호흡을 사용한다. 이름 한자를 풀이하면 달굴 연(煉), 옥 옥(獄), 살구 행(杏), 목숨 수(寿), 사내 랑(郞). 그의 전반적인 성격이 잘 표현된 이름 자라고 볼 수 있다.`,
  },
  {
    listId: "3few",
    image_src:
      "https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp",
    title: "코쵸우 시노부",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
  },
  {
    listId: "4azsew",
    image_src:
      "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDVfOTcg/MDAxNjA3MTY4MzkyMzA0.PpLENY3SQkm4SHYiH2pF8-nqda4IJcYjSxBCp5QHJ04g.eUvGPczp6Elcoi9dsW1j9VH6Bb4kURCsffF0fiob7pcg.JPEG.ty177/610e645b9cc11ff14a09331da06b0167.jpg?type=w800",
    title: "젠이츠",
    description: `최종 선별에서 살아남은 5인 중 하나로[9] 이때부터 줄곧 자신은 죽을 거라며 부정적인 말을 습관처럼 되뇌는 것이 특징이다. 까마귀를 무서워해 대신 참새를 지급받거나[10], 탄지로와 겐야의 사소한 신경전에도 겁먹는 등 소심하고 유약한 성격의 소유자임이 부각된다.`,
  },
  {
    listId: "5ggg",
    image_src:
      "https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp",
    title: "츠유리 카나오",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
  },
]

function Post() {
  const {
    postId,
    title,
    description,
    user: { userName, userImage, userId },
  } = dummyContentCards[0]

  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null)

  const searchParams = useSearchParams()
  const isResultPage = !!searchParams.get("result")

  return (
    <main className="post-wrapper">
      <div className="post">
        <div className="post-info">
          <div className="post-info-title">
            <h1>귀멸의칼날에서 가장 강한 캐릭터 통계</h1>
            <p>당신이 생각하는 귀멸의칼날 원탑 칼잡이 싸무라이는?</p>
          </div>
          <div className="post-info-profile">
            <button className="user-image">
              <img src={userImage} alt={`user_image_${userId}`} />
            </button>
            <div>
              <h3>{userName}</h3>
              <span>작성일: 2024/01/13</span>
            </div>
          </div>
        </div>
        <div className="post-content">
          <div className="left">
            <ul className="candidate-list">
              {candidates.map((candidate, index) => (
                <li key={candidate.listId}>
                  <CandidateCard
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={setSelectedCandidate}
                    candidate={candidate}
                    isResultPage={isResultPage}
                    index={index}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="right">
            <Result />
            {/* {selectedCandidate ? (
              isResultPage ? (
                <Result />
              ) : (
                <Submit postId={postId} selectedCandidate={selectedCandidate} />
              )
            ) : (
              <div className="thumbnail">
                <span>후보를 선택해주세요</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Post
