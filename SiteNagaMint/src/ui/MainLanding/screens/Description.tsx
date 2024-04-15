import React from 'react'

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch } from '../../../redux-store';

const Description = () => {
  const dispatch = useAppDispatch();


  function showVideoModal() {
    dispatch(actions.showVideoModal(true))
  }
  
  return (
    <section className="desc">

      <button onClick={showVideoModal} className="desc__open-modal play-open-modal">
        <picture className="play-open-modal-play">
        </picture>
        <picture className="play-open-modal-text">
          <img src="img/press-text.npg.png" alt="" />
        </picture>
      </button>
      
      <h2 className="desc__title">
        <span>CONCEPT OVERVIEW</span>
      </h2>
      <p className="desc__text-content">
        Girand: in the lost city is a AAA (High Budget) 
        <span> Play and Earn game</span>
        based on the Girand universe, with a real market economy and incredible
        <b>3D visualization.</b>
        This is a fascinating and mysterious 
        <span>story of the fall </span>
        of the great kingdom, about the ancient gods and mythical creatures.
      </p>
      <p className="desc__text-content">
        Genre: 
        <span>MOBA</span>
        with Hero defense mechanics in a
        <i>dark fantasy setting.</i>
      </p>
      <div className="desc__arrows arrows"><i></i></div>
      {/* <!-- Гиранд это мобильная Play to Earn игра с невероятной 3D-графикой и глубокой механикой взаимодействия между игроками. Игра представляет собой карточную 3D визуализацию  с элементами стратегии и RPG.  Вы погрузитесь в целую вселенную с захватывающей историей, будущее которой будет зависить только от вас. --> */}
    </section>
  )
}

export default Description