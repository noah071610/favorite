import { useMainStore } from "@/_store/main"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SearchBar() {
  const { modalStatus, setModal } = useMainStore()
  const onClickInput = () => {
    setModal("search")
  }

  return (
    <div className={cx(style["search-bar"])}>
      <input onClick={onClickInput} />
      <div className={cx(style.border, { [style.active]: modalStatus === "search" })} />
    </div>
  )
}
