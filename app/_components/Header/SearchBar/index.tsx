import { useMainStore } from "@/_store/main"
import classNames from "classnames"
import "./style.scss"

export default function SearchBar() {
  const { modalStatus, setModal } = useMainStore()
  const onClickInput = () => {
    setModal("search")
  }

  return (
    <div className="search-bar">
      <input onClick={onClickInput} />
      <div className={classNames("border", { active: modalStatus === "search" })} />
    </div>
  )
}
