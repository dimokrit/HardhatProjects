import React from 'react'

const Ebox = () => {
  return (
    <section className="ebox">
      <div className="ebox__wrapper">
        <picture className="ebox__pic">
          <img src="img/sunduchello.png" alt="" />
        </picture>
        <div className="ebox__text-wrapper text-wrapper">
          <h3>Mystery Chest</h3>
          <p>
            Mystery chests contain rare and legendary NFT heroes. You can get the hero's NFT by purchasing the Mystic Chest from Hreidmar's shop.
          </p>
        </div>
      </div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Ebox