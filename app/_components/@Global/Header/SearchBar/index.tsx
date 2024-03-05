import { getSearchPosts } from "@/_queries/post"
import { useMainStore } from "@/_store/main"
import { usePostStore } from "@/_store/post"
import classNames from "classNames"
import { debounce } from "lodash"
import { useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SearchBar() {
  const { setModal } = useMainStore()
  const { setSearchPosts, setIsSearching, setSearchQuery, searchQuery } = usePostStore()
  const [isFocused, setIsFocused] = useState(false) // 포커스 상태를 저장하는 상태 변수

  // debounce 함수를 사용하여 검색어 입력이 멈춘 후에만 API 요청을 보내도록 설정
  const debouncedSearch = debounce(async (searchQuery) => {
    setIsSearching(true)
    await getSearchPosts(searchQuery).then((posts) => {
      setSearchPosts(posts ?? [])
      setTimeout(() => {
        setIsSearching(false)
      }, 500)
    })
  }, 500) // 300ms 지연

  const handleSearchInput = (e: any) => {
    const searchQuery = e.target.value
    setSearchQuery(searchQuery)
    // 검색어가 변경될 때마다 debounce된 함수를 호출하여 API 요청 보내기
    if (!searchQuery.trim() || searchQuery.length < 2) return setSearchPosts([])

    searchQuery.length >= 2 && debouncedSearch(searchQuery)
  }

  // input 요소의 포커스 이벤트를 처리하는 핸들러 함수
  const handleFocus = () => {
    setModal("search")
    setIsFocused(true) // 포커스가 되면 isFocused 상태를 true로 변경합니다.
  }

  // input 요소의 포커스 아웃 이벤트를 처리하는 핸들러 함수
  const handleBlur = () => {
    setIsFocused(false) // 포커스가 해제되면 isFocused 상태를 false로 변경합니다.
  }

  return (
    <div className={cx(style["search-bar"])}>
      <input value={searchQuery} onChange={handleSearchInput} onFocus={handleFocus} onBlur={handleBlur} />
      <div className={cx(style.border, { [style.active]: isFocused })} />
    </div>
  )
}
