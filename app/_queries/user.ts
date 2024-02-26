import { API } from "@/_data"
import { UserType } from "@/_types/user"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getUser() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    const response = await API.get(`/auth/user`)
    API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

    return response.data
  } else {
    return { msg: "no", user: null }
  }
}

export async function registerUser(user: UserType) {
  const response = await API.post(`/auth/user`, user)
  return response.data
}

export async function refreshUser() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/auth/user/refresh`)
    API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

    return response.data
  } else {
    return { msg: "no", user: null }
  }
}

export async function login(user: { email: string; password: string }) {
  try {
    const response = await API.post(`/auth/login`, user)

    API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

    return response.data
  } catch {
    return { msg: "no", user: null }
  }
}

// export function likeMutate(postId: string, userId?: number, userImage?: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationKey: ["homePosts"],
//     mutationFn: () => registerUser(user),

//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: ["homePosts"] })

//       await queryClient.setQueryData(["homePosts"], (oldData: any) => {
//         const pages = [...oldData.pages.flat()]

//         return {
//           pageParams: oldData.pageParams,
//           pages: sliceArray(
//             pages.map((v: PostCardType) =>
//               produce(v, (draft) => {
//                 if (v.postId === postId) {
//                   draft.info.like++
//                   draft.info.participateCount++
//                   if (draft.info.participateImages.length < 10 && userImage) {
//                     draft.info.participateImages.push(userImage)
//                   }
//                 }
//               })
//             )
//           ),
//         }
//       })
//     },
//   })
