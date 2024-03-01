import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import { useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SearchBar() {
  const { setModal } = useMainStore()
  const [isFocused, setIsFocused] = useState(false) // 포커스 상태를 저장하는 상태 변수

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
      <input onFocus={handleFocus} onBlur={handleBlur} />
      <div className={cx(style.border, { [style.active]: isFocused })} />
    </div>
  )
}
