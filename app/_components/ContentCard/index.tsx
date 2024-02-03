"use client"

import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { ContentCardType } from "@/_types/post"
import { Dispatch, SetStateAction, useState } from "react"
import LoadingBar from "../LoadingBar"
import Gauge from "./Gauge"
import ImageSlider from "./ImageSlider"
import Profile from "./Profile"
import "./style.scss"

function Images({
  src,
  setCurrentSlide,
  index,
}: {
  src: string
  setCurrentSlide: Dispatch<SetStateAction<number | null>>
  index: number
}) {
  const loaded = useProgressiveImage(src)

  const onClickImage = () => {
    setCurrentSlide(index)
  }

  return loaded ? (
    <div className="photo">
      <div
        onClick={onClickImage}
        style={{
          background: `url('${src}') 100% 100% / cover`,
        }}
      />
    </div>
  ) : (
    <div className="loading">
      <LoadingBar />
    </div>
  )
}

export default function ContentCard({ dummyContentCard }: { dummyContentCard: ContentCardType }) {
  const { user, description, postId, images } = dummyContentCard

  const [currentSlide, setCurrentSlide] = useState<number | null>(null)

  return (
    <article className="content-card">
      <ImageSlider currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} images={images} />
      <Profile user={user} />
      <div className="main">
        <h1>{description}</h1>
        <div className="photos">
          {images.map((src, i) => (
            <Images index={i} key={`${postId}_image_${i}`} src={src} setCurrentSlide={setCurrentSlide} />
          ))}
        </div>
        <div className="travel-info">
          <div className="map"></div>
          <div className="todays-happened">
            <h3>How feel?</h3>
            <div className="feelings">
              <Gauge style="happy" postId={postId} />
              <Gauge style="enraged" postId={postId} />
              <Gauge style="flushed" postId={postId} />
              <Gauge style="crying" postId={postId} />
            </div>
            {/* <h3>Spend Money</h3> */}
            {/* <div className="spend-budget">
              <div className="emo-image">
                <img src={`./images/emoji/money.png`} alt="" />
              </div>
              <div className="budget-wrapper">
                <div className="budget-count">
                  <span className="count">
                    <CountUp end={15300} />
                  </span>
                  <span className="suffix"> ₩</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="comment">
          <div className="comment-profile">
            <img src={user.userImage} alt={`user_image_${user.userId}`} />
          </div>
          <div className="comment-text">
            <span>{user.userName}</span>
            <p>나는 코멘트입니다. 안녕하세요! 글 잘 보고있어요~</p>
          </div>
        </div>
      </div>
    </article>
  )
}
