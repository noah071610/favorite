import { PostContentType, PostSortOptions } from "@/_types/post"
import { Query, QueryKey } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

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

API.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 에러 발생 시 처리할 코드 작성

    // 에러를 다시 throw하여 다른 처리기에 전달
    return error.response
  }
)

export const getImageUrl = ({ isCenter, url }: { url: string; isCenter?: boolean }) => {
  if (isCenter) {
    return `url('${url}') center / cover`
  } else {
    return `url('${url}')`
  }
}

export const queryKey = {
  posts: {
    all: (cursor: string, sort: PostSortOptions) => ["posts", "allPosts", sort, cursor],
    tournament: (cursor: string, sort: PostSortOptions) => ["posts", "tournamentPosts", sort, cursor],
    polling: (cursor: string, sort: PostSortOptions) => ["posts", "pollingPosts", sort, cursor],
    contest: (cursor: string, sort: PostSortOptions) => ["posts", "contestPosts", sort, cursor],
    count: (query: PostContentType | "user" | "all") => ["posts", `${query}Count`],
    popular: ["posts", "popular"],
    template: ["posts", "template"],
    user: (cursor: string) => ["posts", "userPosts", cursor],
  },
  post: (postId: string) => ["post", postId],
  comment: ["post", "comment"],
  play: ["post", "play"],
  user: ["user"],
}

export const getPredicatePostsByType = (type: PostContentType | "user" | "all") => ({
  predicate: (v: Query<unknown, Error, unknown, QueryKey>) =>
    v.queryKey.includes("allPosts") ||
    v.queryKey.includes(`${type}Posts`) ||
    v.queryKey.includes("userPosts") ||
    v.queryKey.includes("allCount") ||
    v.queryKey.includes(`${type}Count`) ||
    v.queryKey.includes("userCount"),
})

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
