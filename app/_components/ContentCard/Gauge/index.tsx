import "./style.scss"

export default function Gauge({ postId }: { postId: string }) {
  return (
    <div className="emo-gauge-outer">
      <div className="emo-gauge-inner">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`${postId}_gauge_${i}`} className="emo-gauge"></div>
        ))}
      </div>
    </div>
  )
}
