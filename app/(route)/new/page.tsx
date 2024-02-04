"use client"

import "./style.scss"

export default function NewPost() {
  return (
    <div className="new-post">
      <div className="editor">
        <section>
          <h3>타이틀 작성</h3>
        </section>
        <section>
          <h3>설명</h3>
        </section>
        <section>
          <h3>배경</h3>
        </section>
        <section>
          <h3>레이아웃 선택</h3>
        </section>
        <section>
          <h3>이미지 업로드</h3>
        </section>
      </div>
      <div className="preview"></div>
    </div>
  )
}
