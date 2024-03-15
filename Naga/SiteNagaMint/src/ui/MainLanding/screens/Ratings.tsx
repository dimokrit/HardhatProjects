import React from 'react'

const Ratings = () => {
  return (
    <section className="ratings">
      <picture className="ratings__aku">
        <img src="img/akulrate.png" alt="" />
      </picture>
      <h2 className="ratings__title">Ratings</h2>
      <p className="ratings__und-title">
      History of battles and global rankings. Acquire rating points by finishing the campaign. 
      Everyone who will rise to the top will receive a deserving reward.
      </p>
      <ul className="ratings__list">
        <li className="ratings__item">
          <picture className="ratings__pic1">
            <img src="img/silver.png" alt="" />
          </picture>
          <p>Klander</p>
        </li>
        <li className="ratings__item">
          <picture className="ratings__pic2">
            <img src="img/gold.png" alt="" />
          </picture>
          <p>Medira</p>
        </li>
        <li className="ratings__item">
          <picture className="ratings__pic3">
            <img src="img/bronze.png" alt="" />
          </picture>
          <p>Michael</p>
        </li>
      </ul>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Ratings