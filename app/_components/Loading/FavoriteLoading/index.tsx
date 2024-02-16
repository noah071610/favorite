import classNames from "classnames"
import "./style.scss"

export default function FavoriteLoading({ type }: { type: "full" }) {
  return (
    <div className={classNames("favorite-loading-wrapper", { [type]: type })}>
      <div className="favorite-loading">
        <div className="favorite-loading-inner">
          <i className="favorite-loading-icon fa-solid fa-gift" />
          <i className="favorite-loading-icon fa-solid fa-heart" />
          <i className="favorite-loading-icon fa-solid fa-rocket" />
        </div>
        <span>Loading</span>
      </div>
    </div>
  )
}
