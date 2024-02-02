"use client"

import { ContentCardType } from "@/_types/post"
import { generateRandomDescription } from "@/_utils/random_kr"
import classNames from "classnames"
import Link from "next/link"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import "./style.scss"

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
    listId: "1",
    image_src:
      "https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp",
    title: "카마도 탄지로",
    description: `가족은 아버지(탄쥬로), 어머니(키에), 남동생 셋(타케오, 시게루, 로쿠타), 여동생 둘(네즈코,
    하나코)이 있다. 이들은 먼저 세상을 떠난 아버지와 네즈코를 제외하고는 모두 키부츠지 무잔의 습격으로
    사망한다. 이후 탄지로는 도깨비가 되어버린 네즈코를 인간으로 되돌리기 위해 귀살대에 입단하게 된다.`,
  },
  {
    listId: "2",
    image_src:
      "https://i.namu.wiki/i/7GNlLmMO79bx0nouEdyv8kmpD2GKR3CiUo0UQCV9BjQigagw7Rohhy7sj8AMjfIEzQROn6l2J7QsJ3vta0aM_Q.webp",
    title: "렌고쿠 쿄주로",
    description: `귀살대 9명의 주 중 하나이며 이명은 염주(炎柱). 전집중 기본 5대 계파 중 하나인 화염의 호흡을 사용한다. 이름 한자를 풀이하면 달굴 연(煉), 옥 옥(獄), 살구 행(杏), 목숨 수(寿), 사내 랑(郞). 그의 전반적인 성격이 잘 표현된 이름 자라고 볼 수 있다.`,
  },
  {
    listId: "3",
    image_src:
      "https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp",
    title: "코쵸우 시노부",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
  },
  {
    listId: "4",
    image_src:
      "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDVfOTcg/MDAxNjA3MTY4MzkyMzA0.PpLENY3SQkm4SHYiH2pF8-nqda4IJcYjSxBCp5QHJ04g.eUvGPczp6Elcoi9dsW1j9VH6Bb4kURCsffF0fiob7pcg.JPEG.ty177/610e645b9cc11ff14a09331da06b0167.jpg?type=w800",
    title: "젠이츠",
    description: `최종 선별에서 살아남은 5인 중 하나로[9] 이때부터 줄곧 자신은 죽을 거라며 부정적인 말을 습관처럼 되뇌는 것이 특징이다. 까마귀를 무서워해 대신 참새를 지급받거나[10], 탄지로와 겐야의 사소한 신경전에도 겁먹는 등 소심하고 유약한 성격의 소유자임이 부각된다.`,
  },
  {
    listId: "5",
    image_src:
      "data:image/jpeg;base64,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",
    title: "츠유리 카나오",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
  },
]

const sorted_candidates = [
  {
    listId: "4",
    image_src:
      "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDVfOTcg/MDAxNjA3MTY4MzkyMzA0.PpLENY3SQkm4SHYiH2pF8-nqda4IJcYjSxBCp5QHJ04g.eUvGPczp6Elcoi9dsW1j9VH6Bb4kURCsffF0fiob7pcg.JPEG.ty177/610e645b9cc11ff14a09331da06b0167.jpg?type=w800",
    title: "젠이츠",
    description: `최종 선별에서 살아남은 5인 중 하나로[9] 이때부터 줄곧 자신은 죽을 거라며 부정적인 말을 습관처럼 되뇌는 것이 특징이다. 까마귀를 무서워해 대신 참새를 지급받거나[10], 탄지로와 겐야의 사소한 신경전에도 겁먹는 등 소심하고 유약한 성격의 소유자임이 부각된다.`,
  },
  {
    listId: "3",
    image_src:
      "https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp",
    title: "코쵸우 시노부",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
  },
  {
    listId: "1",
    image_src:
      "https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp",
    title: "카마도 탄지로",
    description: `가족은 아버지(탄쥬로), 어머니(키에), 남동생 셋(타케오, 시게루, 로쿠타), 여동생 둘(네즈코,
    하나코)이 있다. 이들은 먼저 세상을 떠난 아버지와 네즈코를 제외하고는 모두 키부츠지 무잔의 습격으로
    사망한다. 이후 탄지로는 도깨비가 되어버린 네즈코를 인간으로 되돌리기 위해 귀살대에 입단하게 된다.`,
  },
  {
    listId: "2",
    image_src:
      "https://i.namu.wiki/i/7GNlLmMO79bx0nouEdyv8kmpD2GKR3CiUo0UQCV9BjQigagw7Rohhy7sj8AMjfIEzQROn6l2J7QsJ3vta0aM_Q.webp",
    title: "렌고쿠 쿄주로",
    description: `귀살대 9명의 주 중 하나이며 이명은 염주(炎柱). 전집중 기본 5대 계파 중 하나인 화염의 호흡을 사용한다. 이름 한자를 풀이하면 달굴 연(煉), 옥 옥(獄), 살구 행(杏), 목숨 수(寿), 사내 랑(郞). 그의 전반적인 성격이 잘 표현된 이름 자라고 볼 수 있다.`,
  },
  {
    listId: "5",
    image_src:
      "data:image/jpeg;base64,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",
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
  const isResultPage = searchParams.get("result")

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
              {(isResultPage ? sorted_candidates : candidates).map((candidate, index) => (
                <li
                  onClick={() => {
                    setSelectedCandidate(candidate)
                  }}
                  style={{
                    animation: `fade-move-up ${600 + index * 60}ms ${index * 100}ms cubic-bezier(0,1.1,.78,1) forwards`,
                  }}
                  key={`${isResultPage ? "result_" : ""}${candidate.listId}`}
                  className={classNames("candidate-card", {
                    selected: !isResultPage && selectedCandidate?.listId === candidate.listId,
                  })}
                >
                  <div className="candidate-card-inner">
                    <div className="candidate-image-wrapper">
                      <div
                        style={{
                          background: `url('${candidate.image_src}') center / cover`,
                        }}
                        className="candidate-image"
                      />
                    </div>
                    <div className="candidate-description">
                      <h3>{candidate.title}</h3>
                      <p>{candidate.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="right">
            {selectedCandidate ? (
              <div key={selectedCandidate.listId} className="submit">
                <div
                  style={{
                    background: `url('${selectedCandidate.image_src}') center / cover`,
                    animation: "scale-up 250ms ease-out forwards",
                  }}
                  className="submit-image"
                ></div>
                <div className="submit-description">
                  <h2
                    style={{
                      animation: "fade-move-up 500ms 100ms cubic-bezier(0,1.1,.78,1) forwards",
                    }}
                  >
                    {selectedCandidate.title}
                  </h2>
                  <p
                    style={{
                      animation: "fade-move-up 510ms 150ms cubic-bezier(0,1.1,.78,1) forwards",
                    }}
                  >
                    {selectedCandidate.description}
                  </p>
                </div>
                <div className="submit-btn">
                  <Link
                    style={{
                      animation: "fade-move-up 530ms 210ms cubic-bezier(0,1.1,.78,1) forwards",
                    }}
                    href={`/post/${postId}?result=${selectedCandidate.listId}`}
                  >
                    <span>{selectedCandidate.title} 선택</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="thumbnail">
                <span>후보를 선택해주세요</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Post
