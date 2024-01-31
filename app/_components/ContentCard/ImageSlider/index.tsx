import Slider from "react-slick"

import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef } from "react"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "./style.scss"

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
}

export default function ImageSlider({
  images,
  currentSlide,
  setCurrentSlide,
}: {
  images: string[]
  currentSlide: number | null
  setCurrentSlide: Dispatch<SetStateAction<number | null>>
}) {
  const sliderRef = useRef(null)

  useEffect(() => {
    if (sliderRef?.current && currentSlide !== null) {
      ;(sliderRef.current as any).slickGoTo(currentSlide, true)
    }
  }, [sliderRef, currentSlide])

  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as any).className === "image-viewer" && currentSlide !== null) {
      setCurrentSlide(null)
    }
  }

  return (
    <div
      style={{
        animation: `${currentSlide !== null ? "fade-in" : "fade-out"}-1 300ms forwards`,
      }}
      onClick={onClickOverlay}
      className="image-viewer"
    >
      <div
        style={{
          animation: `${currentSlide !== null ? "scale-in" : "scale-out"}-1 300ms forwards`,
        }}
        className="inner"
      >
        <Slider ref={sliderRef} {...settings}>
          {images.map((src, i) => (
            <div className="image-wrapper" key={`image_slide_${i}`}>
              <div style={{ background: `url('${src}') 100% 100% / cover` }} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
