"use client"

import { useEffect, useState } from "react"
import "./style.scss"

function Card() {
  const [name, setName] = useState("Initial")
  console.log("load card")
  useEffect(() => {
    console.log("card effect")
  }, [])

  const onClickCard = () => {
    setName("ohohoh")
  }

  return (
    <div onClick={onClickCard} className="card">
      카드 컴포넌트 {name}
    </div>
  )
}

export default Card
