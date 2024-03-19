"use client"
import { queryKey } from "@/_data"
import { toastError, toastSuccess } from "@/_data/toast"
import { getAdminRawData, setAdminPosts } from "@/_queries/admin"
import { LangType } from "@/_types"
import { UserQueryType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const AdminPage = () => {
  const { i18n } = useTranslation()
  const [templateRawData, setTemplateRawData] = useState("")
  const [popularRawData, setPopularRawData] = useState("")
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user.login,
  })
  const user = userData?.user

  const { data } = useQuery<{ name: "template" | "popular"; rawData: string }[]>({
    queryKey: ["admin"],
    queryFn: () => getAdminRawData(i18n.language as LangType),
    enabled: typeof user?.userId === "number",
  })

  useEffect(() => {
    if (data) {
      data.forEach(({ name, rawData }) => {
        switch (name) {
          case "template":
            setTemplateRawData(rawData)
            break
          case "popular":
            setPopularRawData(rawData)
            break
        }
      })
    }
  }, [data])

  const onChangeInput = (e: any, value: "popular" | "template") => {
    switch (value) {
      case "template":
        setTemplateRawData(e.target.value)
        break
      case "popular":
        setPopularRawData(e.target.value)
        break
    }
  }

  const onClickUpload = async (value: "popular" | "template") => {
    const rawData = value === "template" ? templateRawData : popularRawData
    const postIdArr = rawData.split("\n").map((v) => v.trim())

    await setAdminPosts(value, postIdArr, rawData, i18n.language as LangType)
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
        <h1>현재 언어 : {i18n.language}</h1>
        <h1>템플렛 설정</h1>
        <TextareaAutosize
          className={cx(style.textarea)}
          value={templateRawData}
          onChange={(e) => onChangeInput(e, "template")}
        />
        <button onClick={() => onClickUpload("template")}>템플릿 업로드</button>
        <h1>인기 콘텐츠 설정</h1>
        <TextareaAutosize
          className={cx(style.textarea)}
          value={popularRawData}
          onChange={(e) => onChangeInput(e, "popular")}
        />
        <button onClick={() => onClickUpload("popular")}>인기 콘텐츠 업로드</button>
      </div>
    </div>
  )
}

export default AdminPage
