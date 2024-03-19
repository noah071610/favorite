"use client"
import { queryKey } from "@/_data"
import { toastError, toastSuccess } from "@/_data/toast"
import { getAdminRawData, setAdminPosts } from "@/_queries/admin"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { produce } from "immer"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const AdminPage = () => {
  const [input, setInput] = useState([
    { id: 1, rawData: "" },
    { id: 2, rawData: "" },
  ])
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const user = userData?.user

  const { data } = useQuery<{ id: number; rawData: string }[]>({
    queryKey: ["admin"],
    queryFn: () => getAdminRawData(),
    enabled: typeof user?.userId === "number",
  })

  useEffect(() => {
    if (data) {
      setInput(data)
    }
  }, [data])

  const onChangeInput = (e: any, value: "popular" | "template") => {
    setInput((arr) =>
      produce(arr, (draft) => {
        draft[value === "template" ? 0 : 1].rawData = e.target.value
      })
    )
  }

  const onClickUpload = async (value: "popular" | "template") => {
    const rawData = input[value === "template" ? 0 : 1].rawData
    const postIdArr = rawData.split("\n").map((v) => v.trim())

    await setAdminPosts(value, postIdArr, rawData)
      .then(() => {
        toastSuccess(`${value} ㅇㅋ업로드 완료`)
      })
      .catch(() => {
        toastError(`${value} 업로드 실패ㅠ`)
      })
  }

  return (
    <div className={cx(style.admin)}>
      <div className={cx(style.main)}>
        <h1>템플렛 설정</h1>
        <TextareaAutosize
          className={cx(style.textarea)}
          value={input[0].rawData}
          onChange={(e) => onChangeInput(e, "template")}
        />
        <button onClick={() => onClickUpload("template")}>템플릿 업로드</button>
        <h1>인기 콘텐츠 설정</h1>
        <TextareaAutosize
          className={cx(style.textarea)}
          value={input[1].rawData}
          onChange={(e) => onChangeInput(e, "popular")}
        />
        <button onClick={() => onClickUpload("popular")}>인기 콘텐츠 업로드</button>
      </div>
    </div>
  )
}

export default AdminPage
