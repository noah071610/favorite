"use client"

import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"

import { FreeMode } from "swiper/modules"

import { candidates } from "@/_utils/faker"
import "./style.scss"

export default function CommentPart() {
  return (
    <section className="comment">
      <div className="comment-nav">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {candidates.map(({ listId, title, image_src }) => (
            <SwiperSlide key={`${listId}_comment_nav`}>
              <button>
                <div className="image-wrapper">
                  <div
                    style={{
                      background: `url('${image_src}') center / cover`,
                    }}
                  />
                </div>
                <span>{title}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
