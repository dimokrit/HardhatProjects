import React from 'react'

const Guild = () => {
  return (
    <section className="guild">
      <h2 className="guild__title">
        guild
        <span className="decor-title">guild</span>
      </h2>
      <div className="guild__text-wrapper text-wrapper">
        <h3>TOURNAMENTS</h3>
        <p>
          Participate in a guild war.  <br />
          Get the biggest reward by pushing your guild to the top of the leaderboard.
        </p>
      </div>
      <picture className="guild__art">
        <img src="img/town-art.png" alt="" />
      </picture>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Guild