import React from 'react'

const Trade = () => {
  return (
    <section className="trade">
      <h2 className="trade__title">
        Trade to earn
        <span className="decor-title">trade to earn</span>
      </h2>
      <div className="trade__text-card">
        <h3>MARKETPLACE</h3>
        <p>
        Meet the dwarf Hreydmar, the owner of the shop where trading operations between players take place. The store is already launched, the marketplace is under development. <br />
        Hreidmar is the main taxpayer of the kingdom. Both the marketplace and the store play an important role in shaping the market economy.
        </p>
      </div>
      <picture className="trade__pic">
        <img src="img/gnome.png" alt="" />
      </picture>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Trade