import React from 'react'
import JoinCommunity from '../components/JoinCommunity'

const Play = () => {
  return (
    <section className="play">
      <h2 className="play__title">THE FIRST AAA <br /> P&E GAME <br /> ON THE <br/> BLOCKCHAIN </h2>
      <p className="play__text">
        Become a part of the great
        <span>history of the Kingdom</span>
      </p>
      <JoinCommunity />
      <picture className="play__circle-text">
        <img src="img/circle-text.png" alt="" />
      </picture>
      <picture className="play__play">
        <img src="img/play-btn.png" alt="" />
      </picture>
      <picture className="play__buble1 buble1">
        <img src="img/bubble-one-v2.png" alt="" />
      </picture>
      <picture className="play__buble2 buble2">
        <img src="img/bubble-two-v2.png" alt="" />
      </picture>
      <picture className="play__buble3 buble1">
        <img src="img/bubble-one-v2.png" alt="" />
      </picture>
      <picture className="play__buble4 buble2">
        <img src="img/bubble-two-v2.png" alt="" />
      </picture>
      <picture className="play__stone">
        <img src="img/stone.png" alt="" />
      </picture>
      <div className="play__arrows arrows"><i></i></div>
    </section>
  )
}

export default Play