import React from 'react'

const Invest = () => {
  return (
    <section className="invest">
      <h2 className="invest__title">
        Invest to earn
        <span className="decor-title">invest to earn</span>
      </h2>
      <div className="invest__wrapper">
        <picture className="invest__pic">
          <img src="img/invest1.png" alt="" />
        </picture>
        <div className="invest__text-wrapper text-wrapper text-wrapper--long">
          <h3>Staking and Farming</h3>
          <p>
            GLC token holders will participate in the distribution of the game's income, as well as manage the universe through participation in the DAO.
          </p>
        </div>
      </div>
      <picture className="invest__coin-pic">
        <img src="img/coin-inv.png" alt="" />
      </picture>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <div className="invest__arrows arrows"><i></i></div>
    </section>
  )
}

export default Invest