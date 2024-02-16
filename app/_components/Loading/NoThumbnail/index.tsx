import classNames from "classnames"
import "./style.scss"

export default function NoThumbnail({ type }: { type: "postCard" }) {
  return (
    <div className={classNames("no-thumbnail", { [type]: type })}>
      <div>
        <i className="fa-solid fa-gift" />
        <i className="fa-solid fa-heart" />
        <i className="fa-solid fa-rocket" />
      </div>
    </div>
  )
}
