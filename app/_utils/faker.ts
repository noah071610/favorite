import { chartBorderColors } from "@/_data"
import { CommentType, PostCardType, UserType } from "@/_types/post"
import { randomNum } from "./math"
import { generateRandomDescription } from "./random_kr"

export const dummyUser: UserType = {
  userId: `my_user`,
  userName: `노아짱`,
  userImage: `https://placekitten.com/50/320`,
}

export const candidates = [
  {
    number: 1,
    listId: "1efwf",
    imageSrc:
      "https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp",
    title: "카마도 탄지로",
    description: `가족은 아버지(탄쥬로), 어머니(키에), 남동생 셋(타케오, 시게루, 로쿠타), 여동생 둘(네즈코,
        하나코)이 있다. 이들은 먼저 세상을 떠난 아버지와 네즈코를 제외하고는 모두 키부츠지 무잔의 습격으로
        사망한다. 이후 탄지로는 도깨비가 되어버린 네즈코를 인간으로 되돌리기 위해 귀살대에 입단하게 된다.`,
    count: 8,
  },
  {
    number: 2,
    listId: "fewf2",
    imageSrc:
      "https://i.namu.wiki/i/7GNlLmMO79bx0nouEdyv8kmpD2GKR3CiUo0UQCV9BjQigagw7Rohhy7sj8AMjfIEzQROn6l2J7QsJ3vta0aM_Q.webp",
    title: "렌고쿠 쿄주로",
    description: `귀살대 9명의 주 중 하나이며 이명은 염주(炎柱). 전집중 기본 5대 계파 중 하나인 화염의 호흡을 사용한다. 이름 한자를 풀이하면 달굴 연(煉), 옥 옥(獄), 살구 행(杏), 목숨 수(寿), 사내 랑(郞). 그의 전반적인 성격이 잘 표현된 이름 자라고 볼 수 있다.`,
    count: 12,
  },
  {
    number: 3,
    listId: "3few",
    imageSrc:
      "https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp",
    title: "코쵸우 시노부",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    count: 2,
  },
  {
    number: 4,
    listId: "4azsew",
    imageSrc:
      "https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDVfOTcg/MDAxNjA3MTY4MzkyMzA0.PpLENY3SQkm4SHYiH2pF8-nqda4IJcYjSxBCp5QHJ04g.eUvGPczp6Elcoi9dsW1j9VH6Bb4kURCsffF0fiob7pcg.JPEG.ty177/610e645b9cc11ff14a09331da06b0167.jpg?type=w800",
    title: "젠이츠",
    description: `최종 선별에서 살아남은 5인 중 하나로[9] 이때부터 줄곧 자신은 죽을 거라며 부정적인 말을 습관처럼 되뇌는 것이 특징이다. 까마귀를 무서워해 대신 참새를 지급받거나[10], 탄지로와 겐야의 사소한 신경전에도 겁먹는 등 소심하고 유약한 성격의 소유자임이 부각된다.`,
    count: 22,
  },
  {
    number: 5,
    listId: "5ggg",
    imageSrc: "https://blog.kakaocdn.net/dn/WGp8A/btqD1NJN902/lkK4e34JIBVG5VsrczH3h1/img.jpg",
    title: "츠유리 카나오",
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    count: 9,
  },
]

export const dummyPostCards: PostCardType[] = Array.from({ length: 10 }, (_, index) => ({
  title: `Card ${index + 1}`,
  description: generateRandomDescription(),
  thumbnail: `https://picsum.photos/id/${index * 10}/1200/800`,
  postId: `${index + 1}`,
  like: randomNum(0, 120),
  shareCount: randomNum(0, 120),
  user: {
    userId: `user${index + 1}`,
    userName: `User ${index + 1}`,
    userImage: `https://placekitten.com/50/5${index + 1}`,
  },
  participate: Array.from({ length: randomNum(0, 20) }, (_, t) => `https://placekitten.com/50/5${t + 1}`),
}))

export const candidatesTitleMap = Object.fromEntries(
  candidates.map(({ listId, title, number }) => [listId, `${number}. ${title}`])
) // todo: 서버에서 해줄거

export const dummyComments: CommentType[] = candidates.map(({ listId }, i) => ({
  text: generateRandomDescription(),
  like: randomNum(1, 10),
  favorite: {
    id: listId,
    color: chartBorderColors[i],
    number: i + 1,
  }, // todo: 이걸 과연 쓸까?
  user: {
    userId: `my_user2`,
    userName: `코멘터${i + 1}`,
    userImage: `https://placekitten.com/50/320`,
  },
}))
