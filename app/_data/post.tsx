export const contentTypesArr = [
  {
    value: "polling",
    link: "/?query=polling",
    label: "polling",
    color: "rgba(255, 138, 138, 0.8)",
    icon: (style: any = {}) => {
      return <i className={"fa-solid fa-chart-simple " + style["type-icon"]} />
    },
  },
  {
    value: "contest",
    link: "/?query=contest",
    color: "rgba(255, 207, 171, 0.8)",
    label: "contest",
    icon: (style: any = {}) => {
      return <span className={`${style["type-icon"]} ${style["type-icon-contest"]}`}>VS</span>
    },
  },
  {
    value: "tournament",
    link: "/?query=tournament",
    label: "tournament",
    color: "rgba(217, 171, 255, 0.875)",
    icon: (style: any = {}) => {
      return <i className={"fa-solid fa-trophy " + style["type-icon"]} />
    },
  },
]

export const typeSelectors = [
  {
    value: "all",
    link: "/?query=all",
    label: "all",
    icon: (style: any = {}) => (
      <>
        <i className={"fa-solid fa-list " + style["type-icon"]} />
      </>
    ),
  },
  ...contentTypesArr,
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
export const noThumbnailUrl = "/images/post/noThumbnail.png"

export const shareProviders = [
  { value: "twitter", label: "twitter", color: "rgba(29, 161, 242, 0.2)" }, // 트위터 파란색
  { value: "facebook", label: "facebook", color: "rgba(24, 119, 242, 0.2)" }, // 페이스북 파란색
  { value: "kakaoTalk", label: "kakaoTalk", color: "rgba(255, 235, 0, 0.2)" }, // 카카오톡 노란색
  { value: "line", label: "line", color: "rgba(0, 195, 0, 0.2)" }, // 라인 녹색
  { value: "link", label: "link", color: "rgba(0, 0, 0, 0.2)" }, // 특별한 색상이 없음
]
