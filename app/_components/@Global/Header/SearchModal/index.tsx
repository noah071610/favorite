"use client"

import { contentTypesObj } from "@/_data/post"
import { useMainStore } from "@/_store/main"
import { usePostStore } from "@/_store/post"
import classNames from "classNames"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SearchModal() {
  const { t } = useTranslation(["search"])
  const { searchPosts, isSearching, searchQuery } = usePostStore()
  const { modalStatus } = useMainStore()

  const highlightText = (title: string) => {
    if (!title || !searchQuery) return searchQuery
    const index = title.indexOf(searchQuery)
    if (index === -1) return title
    return (
      <>
        {title.substring(0, index)}
        <span>{searchQuery}</span>
        {title.substring(index + searchQuery.length)}
      </>
    )
  }

  return (
    <div className={cx(style.search, { [style.open]: modalStatus === "search" })}>
      <div className={cx(style["search-inner"])}>
        {!isSearching ? (
          // 검색중이 아님
          searchPosts.length > 0 ? (
            <ul className={cx(style["search-list"])}>
              {searchPosts.map((v) => {
                const typeData = contentTypesObj[v.type]
                return (
                  <li className={cx(style.card)} key={v.postId}>
                    <Link href={`/post/${v.type}/${v.postId}`}>
                      <div className={cx(style["badge-main"], style[v.type])}>
                        <span>
                          {typeData.icon(style)}
                          <span className={cx(style.label)}>{typeData.label}</span>
                        </span>
                      </div>
                      <h1>{highlightText(v.title)}</h1>
                      {!!v.description && <h2>{highlightText(v.description)}</h2>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={cx(style["no-content"])}>
              <span>{"¯\\_(ツ)_/¯"}</span>
              <span>{t("emptySearchResult")}</span>
            </div>
          )
        ) : (
          <div className={cx(style["no-content"])}>
            <span>{"¯\\_(ツ)_/¯"}</span>
            <span>{t("emptySearchResult")}</span>
          </div>
        )}
      </div>
    </div>
  )
}
