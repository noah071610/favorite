import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)
export default function Nav() {
  return (
    <div className={cx(style.nav)}>
      <div>네비</div>
    </div>
  )
}
