import { GaugeStyle } from "@/_types/post"
import { useMemo } from "react"
import "./style.scss"

export default function Gauge({ style, postId }: { style: GaugeStyle; postId: string }) {
  const t_num = useMemo(() => 2 + 1, [])
  return (
    <div className="gauge-wrapper">
      <div className="emo-image">
        <img src={`./images/emoji/${style}.png`} alt={style} />
      </div>
      <div className="emo-gauge-outer">
        <div style={{ width: `${t_num * 20}px` }} className="emo-gauge-inner">
          <div className="emo-gauge"></div>
        </div>
      </div>
    </div>
  )
}

// Math.floor(Math.random() * 10) + 1
// style={{ animation: `move_${t_num} 1400ms cubic-bezier(0, 0.97, 1, 1.01) forwards` }}
