import { API } from "@/_data"
import { UserQueryType } from "@/_types/user"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getUser() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    if (API.defaults.headers.common["Authorization"]?.toString().includes("Bearer ")) {
      // 완벽. 가져와
      const response = await API.get(`/auth/user`)

      return response.data
    } else {
      // 잉? 리프레쉬 해줘야겠네
      const { msg, user } = await refreshUser()
      if (msg === "ok") {
        return { msg: "ok", user: user }
      } else {
        // 왜 안돼.. 일단 그냥 no
        return { msg: "no", user: null }
      }
    }
  } else {
    // 아예 초기 유저인듯
    return { msg: "no", user: null }
  }
}

export async function registerUser(data: { email: string; password: string; userName: string }) {
  const response = await API.post(`/auth/user`, { ...data, provider: "local" })

  return response.data
}

export async function hasEmail(email: string) {
  const response = await API.post(`/auth/find-email`, { email })
  return response.data.data
}

export async function refreshUser(): Promise<UserQueryType> {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/auth/user/refresh`)
    API.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken

    return { msg: "ok", user: response.data.user }
  } else {
    return { msg: "no", user: null }
  }
}

export async function login(user: { email: string; password: string }) {
  return await API.post(`/auth/login`, { ...user, provider: "local" })
    .then((res) => {
      API.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken

      return res.data
    })
    .catch((error) => {
      return error
    })
}
