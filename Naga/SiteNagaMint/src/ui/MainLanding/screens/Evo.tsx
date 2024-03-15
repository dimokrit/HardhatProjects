import React from 'react'

const Evo = () => {
  return (
    <section className="evo">
      <h2 className="evo__title">
        Upgrade to earn
        <span className="decor-title">upgrade to earn</span>
      </h2>
      <div className="evo__wrapper1">
        <div className="evo__text-wrapper text-wrapper text-wrapper--short">
          <h3>Upgrade artifacts</h3>
          <p>
            Upgrade artifacts and sharpen your weapons, but remember that the item may be destroyed. If you succeed in the upgrade, you will become the owner of a rare and valuable NFT.
          </p>
        </div>
        <picture className="evo__wrap1-pic">
          <img src="img/bsmith1.png" alt="" />
        </picture>
      </div>
      <div className="evo__wrapper2">
        <div className="evo__text-wrapper text-wrapper text-wrapper--long">
          <h3>Titles and <br /> Achievements</h3>
          <p>
            In the Girand Metaverse, an achievement system will be created to reward the player. For each achievement, the player will receive experience, resources and passive game bonuses.
          </p>
          <p>
            Titles provide heroes with unique gameplay options and provide access to the voting system. The Girand title will be awarded for meritorious service to the city, outstanding gaming activity and the best gaming records.
          </p>
        </div>
        <picture className="evo__wrap2-pic">
          <img src="img/helmet.png" alt="" />
        </picture>
      </div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Evo