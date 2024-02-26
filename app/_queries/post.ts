import { API } from "@/_data"

export async function getPosts({ pageParam = 0 }) {
  const response = await API.get(`/post/all?cursor=${pageParam}`)

  return response.data
}

export async function getPost(postId: string) {
  const response = await API.get(`/post?postId=${postId}`)

  return response.data
}

export async function likePost(userId?: number, postId?: string) {
  const response = await API.patch(`/post/like?postId=${postId}&userId=${userId}`)

  return response.data
}

// export function create(postId: string, userId?: number, userImage?: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationKey: ["homePosts"],
//     mutationFn: () => likePost(userId, postId),

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
// }
