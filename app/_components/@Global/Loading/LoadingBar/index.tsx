import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function LoadingBar() {
  return (
    <div className={cx(style["lds-ripple"])}>
      <div />
      <div />
    </div>
  )
}
