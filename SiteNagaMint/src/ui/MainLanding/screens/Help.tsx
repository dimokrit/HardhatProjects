import React from 'react'

const Help = () => {
  return (
    <section className="help">
      <picture className="help__fish">
        <img src="img/fish.png" alt="" />
      </picture>
      <h2 className="help__title">
        Help to earn
        <span className="decor-title">help to earn</span>
      </h2>
      <div className="help__text-wrapper1 text-wrapper">
        <h3>Promote the game</h3>
        <p>
          Promote the game, earn special achievements that increase your profitability in the game and the chance to get rare NFTs.
        </p>
      </div>
      <div className="help__bottom-wrapper">
        <picture className="help__hands-pic">
          <img src="img/hands1.png" alt="" />
        </picture>
        <div className="help__text-wrapper2 text-wrapper">
          <h3>Assistance for newcomers </h3>
          <p>
            Support for new players is a social part of the gameplay in Girand, which helps novice players to immerse themselves in the gameplay faster and more efficiently.
          </p>
        </div>
      </div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Help