import { randomNum } from "@/_utils/math"
import { useMemo } from "react"
// todo: 지울거임
export default function Gauge({ style, postId }: { style: any; postId: string }) {
  const t_num = useMemo(() => randomNum(1, 10), [])
  return (
    <div className={cx(style["gauge-wrapper"])}>
      <div className={cx(style["emo-image"])}>
        <img src={style} alt={style} />
      </div>
      <div className={cx(style["emo-gauge-outer"])}>
        <div style={{ width: `${t_num * 10}%` }} className={cx(style["emo-gauge-inner"])}>
          <div className={cx(style["emo-gauge"])} />
        </div>
      </div>
    </div>
  )
}
