import { faGift, faHeart, faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function NoThumbnail({ type, height }: { type: "post-card"; height?: number }) {
  return (
    <div style={height ? { height: height + "px" } : {}} className={cx(style["no-thumbnail"], { [style[type]]: type })}>
      <div>
        <FontAwesomeIcon icon={faGift} />
        <FontAwesomeIcon icon={faHeart} />
        <FontAwesomeIcon icon={faRocket} />
      </div>
    </div>
  )
}
