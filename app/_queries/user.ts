import { server } from "@/_data"

export async function getUser(userId: number) {
  const response = await server.get(`/user/${userId}`)

  return response.data
}
