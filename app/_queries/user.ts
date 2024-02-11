import { server } from "./provider/reactQueryProvider"

export async function getUser(userId: number) {
  const response = await server.get(`/user/${userId}`)

  return response.data
}
