import { API } from "@/_data"
import { LangType } from "@/_types"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getAdminRawData(lang: LangType) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    const response = await API.get(`/admin/data?lang=${lang}`)
    return response.data
  }
}

export async function setAdminPosts(
  type: "template" | "popular",
  postIdArr: string[],
  rawData: string,
  lang: LangType
) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")

  if (cookie) {
    const response = await API.post(`/admin/data?type=${type}&lang=${lang}`, { rawData, postIdArr })
    return response.data
  }
}
