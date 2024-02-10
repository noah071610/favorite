import "./style.scss"

export default function FavoriteLoading() {
  return (
    <div className="favorite-loading-wrapper">
      <div className="favorite-loading">
        <div className="favorite-loading-inner">
          <i className="favorite-loading-icon fa-solid fa-gift"></i>
          <i className="favorite-loading-icon fa-solid fa-heart"></i>
          <i className="favorite-loading-icon fa-solid fa-rocket"></i>
        </div>
        <span>Loading</span>
      </div>
    </div>
  )
}
