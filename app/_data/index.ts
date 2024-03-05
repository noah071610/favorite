import axios from "axios"

export const _url = {
  client: process.env.NEXT_PUBLIC_CLIENT_URL,
  server: process.env.NEXT_PUBLIC_SERVER_URL,
}

export const API = axios.create({
  withCredentials: true,
  baseURL: _url.server,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export const getImageUrl = ({ isCenter, url }: { url: string; isCenter?: boolean }) => {
  if (isCenter) {
    return `url('${url}') center / cover`
  } else {
    return `url('${url}')`
  }
}

export const queryKey = {
  home: {
    all: ["home", "all"],
    tournament: ["home", "tournament"],
    polling: ["home", "polling"],
    contest: ["home", "contest"],
    popular: ["home", "popular"],
    template: ["home", "template"],
  },
  new: {
    create: ["new", "create"],
  },
  user: ["user"],
} as const

export const shares = [
  {
    value: "twitter",
    share: ({ text, url }: { text: string; url: string }) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  },
  {
    value: "facebook",
    share: ({ text, url }: { text: string; url: string }) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    value: "line",
    share: ({ text, url }: { text: string; url: string }) =>
      `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
  },
]

export const getShareUrl = {
  twitter: ({ text, url }: { text: string; url: string }) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  facebook: ({ text, url }: { text: string; url: string }) =>
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
  line: ({ text, url }: { text: string; url: string }) =>
    `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
}

export const kakaoShare = ({
  title,
  description,
  imageUrl,
  link,
}: {
  title: string
  description: string
  imageUrl: string
  link: string
}) => {
  if ((window as any).Kakao) {
    const kakao = (window as any).Kakao

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
      social: {
        likeCount: 286,
        commentCount: 45,
        sharedCount: 845,
      },
      buttons: [
        {
          title: "지금 플레이하러 가기",
          link: {
            mobileWebUrl: link,
            webUrl: link,
          },
        },
      ],
    })
  }
}
