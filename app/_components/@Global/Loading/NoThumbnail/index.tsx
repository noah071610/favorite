import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function NoThumbnail({ type, height }: { type: "post-card"; height?: number }) {
  return (
    <div style={height ? { height: height + "px" } : {}} className={cx(style["no-thumbnail"], { [style[type]]: type })}>
      <div>
        <i className={cx("fa-solid", "fa-gift")} />
        <i className={cx("fa-solid", "fa-heart")} />
        <i className={cx("fa-solid", "fa-rocket")} />
      </div>
    </div>
  )
}
