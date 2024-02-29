import { API } from "@/_data"

export async function getPosts({ pageParam = 0 }) {
  const response = await API.get(`/post/all?cursor=${pageParam}`)

  return response.data
}

export async function getPost(postId: string) {
  const response = await API.get(`/post?postId=${postId}`)

  return response.data
}

export async function commenting(data: { userId: number; postId: string; text: string }) {
  const response = await API.post(`/post/comment`, data)

  return response.data
}

export async function finishTournament(postId: string, data: { win: number; lose: number; pick: number }[]) {
  const response = await API.patch(`/post/tournament?postId=${postId}`, data)

  return response.data
}

export async function finishContest(postId: string, direction: "left" | "right") {
  const response = await API.patch(`/post/contest?postId=${postId}&direction=${direction}`)

  return response.data
}

export async function finishPolling(postId: string, listId: string) {
  const response = await API.patch(`/post/polling?postId=${postId}&listId=${listId}`)

  return response.data
}

export async function likePost(userId?: number, postId?: string) {
  const response = await API.patch(`/post/like?postId=${postId}&userId=${userId}`)

  return response.data
}
