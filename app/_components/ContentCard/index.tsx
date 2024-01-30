"use client"

import { ContentCardType } from "@/_types/post"
import { useEffect, useState } from "react"
import Gauge from "./Gauge"
import "./style.scss"

const useProgressiveImage = (src) => {
  const [sourceLoaded, setSourceLoaded] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setSourceLoaded(src)
  }, [src])

  return sourceLoaded
}

export default function ContentCard({ dummyContentCard }: { dummyContentCard: ContentCardType }) {
  const {
    user: { userId, userImage, userName },
    description,
    postId,
    images,
  } = dummyContentCard

  return (
    <article className="content-card">
      <div className="profile">
        <div className="user-image">
          <img src={userImage} alt={`user_image_${userId}`} />
        </div>
        <span>{userName}</span>
      </div>
      <div className="main">
        <p>{description}</p>
        <div className="photos">
          {images.map((src, i) => {
            const loaded = useProgressiveImage(src)
            return loaded ? (
              <div
                key={`${postId}_image_${i}`}
                className="photo"
                style={{ background: `url('${src}') 100% 100% / cover` }}
              />
            ) : (
              <div className="loading" key={`${postId}_image_loading_${i}`}>
                <div className="lds-ripple">
                  <div></div>
                  <div></div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="travel-info">
          <div className="map"></div>
          <div className="todays-happened">
            <div className="feelings">
              <div className="emo-happy">
                <div className="emo-image">
                  <img src="./images/emoji/smile_heart.png" alt="" />
                </div>
                <Gauge postId={postId} />
              </div>
              <div className="emo-angry">
                <div className="emo-image">
                  <img src="./images/emoji/smile_heart.png" alt="" />
                </div>
                <Gauge postId={postId} />
              </div>
              <div className="emo-surprise">
                <div className="emo-image">
                  <img src="./images/emoji/smile_heart.png" alt="" />
                </div>
                <Gauge postId={postId} />
              </div>
              <div className="emo-sad">
                <div className="emo-image">
                  <img src="./images/emoji/smile_heart.png" alt="" />
                </div>
                <Gauge postId={postId} />
              </div>
            </div>
            <div className="spend-money"></div>
          </div>
        </div>
      </div>
    </article>
  )
}
