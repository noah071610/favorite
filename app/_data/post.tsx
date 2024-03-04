export const contentTypesArr = [
  {
    value: "polling",
    link: "/?query=polling",
    label: "투표",
    color: "rgba(255, 138, 138, 0.8)",
    icon: (style: any = {}) => {
      return <i className={"fa-solid fa-chart-simple " + style["type-icon"]} />
    },
  },
  {
    value: "contest",
    link: "/?query=contest",
    color: "rgba(255, 207, 171, 0.8)",
    label: "1:1 대결",
    icon: (style: any = {}) => {
      return <span className={`${style["type-icon"]} ${style["type-icon-contest"]}`}>VS</span>
    },
  },
  {
    value: "tournament",
    link: "/?query=tournament",
    label: "토너먼트",
    color: "rgba(217, 171, 255, 0.875)",
    icon: (style: any = {}) => {
      return <i className={"fa-solid fa-trophy " + style["type-icon"]} />
    },
  },
]

type ContentItem = {
  link: string
  label: string
  icon: (style: any) => JSX.Element
}
type ContentTypesDataObj = {
  [key: string]: ContentItem
}

export const contentTypesObj: ContentTypesDataObj = contentTypesArr.reduce((acc, item) => {
  acc[item.value] = {
    link: item.link,
    label: item.label,
    icon: item.icon,
  }
  return acc
}, {} as ContentTypesDataObj)

export const getThumbnail = (thumbnail: string) => {
  const arr = !!thumbnail ? thumbnail.split("${}$") : []
  return arr
}

export const noImageUrl = "url('/images/post/no-image.png')"

export const shareProviders = [
  { value: "twitter", label: "트위터로 공유", color: "rgba(29, 161, 242, 0.2)" }, // 트위터 파란색
  { value: "facebook", label: "페이스북으로 공유", color: "rgba(24, 119, 242, 0.2)" }, // 페이스북 파란색
  { value: "kakaoTalk", label: "카카오톡으로 공유", color: "rgba(255, 235, 0, 0.2)" }, // 카카오톡 노란색
  { value: "line", label: "라인으로 공유", color: "rgba(0, 195, 0, 0.2)" }, // 라인 녹색
  { value: "link", label: "링크 복사", color: "rgba(0, 0, 0, 0.2)" }, // 특별한 색상이 없음
]
