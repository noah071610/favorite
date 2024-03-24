import { faGift, faHeart, faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const LoadingComponent = ({ type, text }: { type: "full" | "component" | "overlay" | "content"; text?: string }) => {
  return (
    <div className={cx(style["loading-wrapper"], { [style[type]]: type })}>
      <div className={cx(style["loading"])}>
        <div className={cx(style["loading-inner"])}>
          <FontAwesomeIcon className={cx(style["loading-icon"])} icon={faGift} />
          <FontAwesomeIcon className={cx(style["loading-icon"])} icon={faHeart} />
          <FontAwesomeIcon className={cx(style["loading-icon"])} icon={faRocket} />
        </div>
        <span>{text ?? "Loading"}</span>
      </div>
    </div>
  )
}

export default function FavoriteLoading({
  type,
  text,
}: {
  type: "full" | "component" | "overlay" | "content"
  text?: string
}) {
  return type === "content" ? (
    <div style={{ position: "relative" }}>
      <LoadingComponent type={type} text={text} />
    </div>
  ) : (
    <LoadingComponent type={type} text={text} />
  )
}
