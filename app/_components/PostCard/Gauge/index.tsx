import { randomNum } from "@/_utils/math"
import { useMemo } from "react"
import "./style.scss"
// todo: 지울거임
export default function Gauge({ style, postId }: { style: any; postId: string }) {
  const t_num = useMemo(() => randomNum(1, 10), [])
  return (
    <div className="gauge-wrapper">
      <div className="emo-image">
        <img src={style} alt={style} />
      </div>
      <div className="emo-gauge-outer">
        <div style={{ width: `${t_num * 10}%` }} className="emo-gauge-inner">
          <div className="emo-gauge" />
        </div>
      </div>
    </div>
  )
}
