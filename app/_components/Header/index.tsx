"use client"

import SearchBar from "./SearchBar"
import SearchModal from "./SearchModal"
import "./style.scss"

function Center() {
  return (
    <div className="center">
      <SearchBar />
      <SearchModal />
    </div>
  )
}

export default function Header() {
  return (
    <div className="header">
      <div className="left">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png"></img>
      </div>

      <Center />

      <div className="right">
        <a>
          <span>로그인</span>
        </a>
      </div>
    </div>
  )
}
