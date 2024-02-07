import { server } from "./provider/reactQueryProvider"

export async function getUser(userId: number) {
  const response = await server.get(`/user/1`) //todo: 더미 느낌...

  return response.data
}
