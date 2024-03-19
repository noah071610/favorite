import { API } from "@/_data"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getAdminRawData() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    const response = await API.get(`/admin/data`)
    return response.data
  }
}

export async function setAdminPosts(type: "template" | "popular", postIdArr: string[], rawData: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    const response = await API.post(`/admin/data?type=${type}`, { rawData, postIdArr })
    return response.data
  }
}
