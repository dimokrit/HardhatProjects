import React from 'react'

const Pe2 = () => {
  return (
    <section className="p2e">
      <h2 className="p2e__title">
        play and earn
        <span className="decor-title">play and earn</span>
      </h2>
      <picture className="p2e__jaba">
        <img src="img/jaba-bg.png" alt="" />
      </picture>
      <div className="p2e__wrapper">
        <div className="p2e__right">
          <div className="p2e__card">
            <picture className="p2e__card-pic">
              <img src="img/pve.png" alt="" />
            </picture>
            <h3 className="p2e__card-title">PVE</h3>
            <p className="p2e__card-text">
              Explore the area outside the dome to mine NFTs, tokens, and other rare treasures. And remember, the further you move away from the dome into the ominous darkness, the more dangerous the monsters are, and this is where rare treasures are stored.
            </p>
          </div>
          <div className="p2e__card">
            <picture className="p2e__card-pic">
              <img src="img/pvp.png" alt="" />
            </picture>
            <h3 className="p2e__card-title">Dome defense</h3>
            <p className="p2e__card-text p2e__card-text--mobile">
              Defend the dome from enemies that have breached the breaches and earn gratitude from the city's residents and the kingdom's council. The more monsters you kill, the higher your reward will be.
            </p>
          </div>
        </div>
      </div>
      <picture className="p2e__axe1">
        <img src="img/axe1.png" alt="" />
      </picture>
      <picture className="p2e__axe2">
        <img src="img/axe2.png" alt="" />
      </picture>
      <picture className="p2e__abst">
        <img src="img/abstr.png" alt="" />
      </picture>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <div className="p2e__arrows arrows"><i></i></div>
    </section>
  )
}

export default Pe2