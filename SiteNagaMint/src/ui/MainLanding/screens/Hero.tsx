import { useNavigate } from 'react-router-dom';

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';

const Hero = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state['user']).currentUser;

  // function showLoginModal() {
  //   if (currentUser) {
  //     navigate('/personal')
  //   } else {
  //     dispatch(actions.showMobileNavbar(false))
  //     dispatch(actions.showLoginModal(true))
  //   }
  // }

  function goToPersonalPage() {
    navigate('/personal')
  }

  return (
    <section className="hero__landing">
      <h2 className="hero__landing__title">
        Create to earn
        <span className="decor-title">create to earn</span>
      </h2>
      <p className="hero__landing__und-title">Craft and Mint your NFT</p>
      <div className="hero__landing__delph-wrapper">
        <div className="hero__landing__text-wrapper1 text-wrapper">
          <h3>NFT Hero</h3>
          <p>
            Unique 3D NFTs - collect a unique collection of NFT heroes and skills. We created the most realistic characters in a unique antique dark fantasy setting. Each NFT hero has not only a unique appearance, but also a set of characteristics, marks, abilities and properties.
          </p>
          <button
            className="hero__landing__btn pixel-btn"
            onClick={goToPersonalPage}
          >
            BECOME A HERO
          </button>
        </div>
        <picture className="hero__landing__pic-delphy">
          <img src="img/delph.png" alt="" />
        </picture>
      </div>
      
      <div className="hero__landing__card-wrapper">
        <video className="hero__landing__card-pic" playsInline loop={true} muted autoPlay>
          <source src="img/soul.mp4" type="video/mp4" />
        </video>
        <div className="hero__landing__text-wrapper2 text-wrapper">
          <h3>Torgan guardian</h3>
          <p>
          Torgans are the spirits of fallen warriors who have returned to the world of the living to protect the kingdom. Each player has their own Torgan guardian. It can be tuned and customized by the player to enhance the abilities of the hero.
          </p>
        </div>
      </div>

      <div className="hero__landing__card-wrapper hero__landing__card-wrapper--axe">
        <div className="hero__landing__text-wrapper2 text-wrapper">
          <h3>NFT Weapons</h3>
          <p>
            Develop and improve your weapons, increase parameters. Craft new legendary weapons in the forge. Each race and class has its own unique weapon.
          </p>
        </div>
        <video className="hero__landing__card-pic" src="img/axe1.mp4" playsInline loop={true} muted autoPlay>
          <source src="img/axe1.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Hero