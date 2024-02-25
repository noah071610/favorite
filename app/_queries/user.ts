import { API } from "@/_data"
import { UserType } from "@/_types/user"

export async function getUser() {
  const response = await API.get(`/auth/user`)

  return response.data
}

export async function registerUser(user: UserType) {
  const response = await API.post(`/auth/user`, user)
  return response.data
}

export async function refreshUser() {
  const response = await API.get(`/auth/user/refresh`)
  API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

  return response.data
}

export async function login(user: { email: string; password: string }) {
  const response = await API.post(`/auth/login`, user)

  API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

  return response.data
}

// export function likeMutate(postId: string, userId?: number, userImage?: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationKey: ["getPosts"],
//     mutationFn: () => registerUser(user),

//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: ["getPosts"] })

//       await queryClient.setQueryData(["getPosts"], (oldData: any) => {
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
