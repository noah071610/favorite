import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function NoThumbnail({ type }: { type: "post-card" }) {
  return (
    <div className={cx(style["no-thumbnail"], { [style[type]]: type })}>
      <div>
        <i className={cx("fa-solid", "fa-gift")} />
        <i className={cx("fa-solid", "fa-heart")} />
        <i className={cx("fa-solid", "fa-rocket")} />
      </div>
    </div>
  )
}
