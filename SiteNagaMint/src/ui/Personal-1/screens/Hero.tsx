import React from 'react'
import { actions as actionsWallet } from '../../../logic/Wallet'
import { actions as actionsPersonal } from '../../../logic/Personal'
import { useAppDispatch, useAppSelector } from '../../../redux-store'
import { delay } from '../../../App'

const HeroScreen = () => {
  const state = useAppSelector(state => state['personal'])
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(state => state.user).currentUser;

  async function goToMainScreen() {
    dispatch(actionsPersonal.setStatusGate('closed'))
    await delay(1300)
    dispatch(actionsPersonal.setStatusGate('opened'))
    dispatch(actionsPersonal.setCurrentScreen('main'))
  }

  function openWallet() {
    if (currentUser) {
      dispatch(actionsWallet.getDepositAdressesByUserId(currentUser.id));
      dispatch(actionsWallet.getTransactionsByUserId(currentUser.id));
      dispatch(actionsWallet.getUserBalance());
      dispatch(actionsWallet.setStatusWalet('opened'))
    }
  }

  return (
    <section className={`hero${state.currentScreen === 'hero' ? ' active' : ''}`} id="js--hero-window">

      <picture className="sphere__light">
        <img src="img/light1.png" alt="" />
      </picture>

      <div className="hero__corner corner" id="js--hero-corner">
        <picture className="corner__main">
          <img src="img/gold-corner.png" alt="" />
        </picture>
        <button className="corner__link" id="js--hero-window-close" onClick={goToMainScreen}>
          <span className="visually-hidden">return to Hreidmar</span>
          <picture className="corner__layer1">
            <img src="img/gold-corner-layer1.png" alt="" />
          </picture>
          <picture className="corner__layer2">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer3">
            <img src="img/gold-corner-layer3.png" alt="" />
          </picture>
          <picture className="corner__layer4">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer5">
            <img src="img/gold-corner-layer5.png" alt="" />
          </picture>
        </button>
      </div>

      <button className="hero__question question-btn" id="js--hero-question">
        <picture><img src="img/ql-1.png" alt="" /></picture>
        <picture><img src="img/ql-2.png" alt="" /></picture>
        <picture><img src="img/ql-3.png" alt="" /></picture>
        <picture><img src="img/ql-4.png" alt="" /></picture>
      </button>

      <ul className="hero__races races-bar" id="js--hero-races">
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/dark-elf.png" alt="" />
            </picture>
            <span>DARK ELF</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>GOLEM</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>DELPHI</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>HUMAN</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>DWARF</span>
          </button>
        </li>
      </ul>

      <div className="hero__slider-wrapper active" id="js--slider-wrapper-m">
        <button className="hero__slider-left slider-left js--hslider-m-left">
          <span className="vusially-hidden">switch to left</span>
        </button>
        <div className="hero__slider-listwrapper">
          <ul className="hero__slider js--hslider-m">
            <li className="hero__slide js--hslide-m" data-class="warrior">
              <picture>
                <img src="img/hero.png" alt="" />
              </picture>
            </li>
            <li className="hero__slide js--hslide-m" data-class="ranger">
              <picture>
                <img src="img/hero.png" alt="" />
              </picture>
            </li>
            <li className="hero__slide js--hslide-m" data-class="mage">
              <picture>
                <img src="img/hero.png" alt="" />
              </picture>
            </li>
          </ul>
        </div>
        <button className="hero__slider-right slider-right js--hslider-m-right">
          <span className="vusially-hidden">switch to right</span>
        </button>
      </div>

      <div className="hero__slider-wrapper" id="js--slider-wrapper-f">
        <button className="hero__slider-left slider-left js--hslider-f-left">
          <span className="vusially-hidden">switch to left</span>
        </button>
        <div className="hero__slider-listwrapper">
          <ul className="hero__slider js--hslider-f">
            <li className="hero__slide js--hslide-f" data-class="warrior">
              <picture>
                <img src="img/hero-g.png" alt="" />
              </picture>
            </li>
            <li className="hero__slide js--hslide-f" data-class="ranger">
              <picture>
                <img src="img/hero-g.png" alt="" />
              </picture>
            </li>
            <li className="hero__slide js--hslide-f" data-class="mage">
              <picture>
                <img src="img/hero-g.png" alt="" />
              </picture>
            </li>
          </ul>
        </div>
        <button className="hero__slider-right slider-right js--hslider-f-right">
          <span className="vusially-hidden">switch to right</span>
        </button>
      </div>

      <div className="hero__top" id="js--hero-top">
        <h2 className="hero__title">SELECT NFT HERO</h2>
        <div className="hero__tabs swtabs" id="js--hero-tabs">
          <button className="swtabs__tab" id="js--hero-left-tab">Male</button>
          <button className="swtabs__tab" id="js--hero-right-tab">Female</button>
        </div>
        <p>
          <span id="js--race-text">DARK ELF </span>
          <span id="js--class-text">WARIOR</span>
        </p>
      </div>

      <div className="hero__timer timer" id="js--hero-timer">
        <picture><img src="img/sandclock.png" alt="" /></picture>
        <h3>PRICE WILL INCREASES AFTER</h3>
        <p>
          00 : 00 : 24
          <span>min</span>
        </p>
      </div>

      <div className="smoke">
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
      </div>

      <div className="hero__bottom botbuttons" id="js--hero-bottom">
        <div className="botbuttons__left">
          <p className="botbuttons__text">
            Available for sale
          </p>
          <span className="botbuttons__btn dark-wide-button">
            <span>12000 HERO</span>
          </span>
        </div>
        <div className="botbuttons__center">
          <p className="botbuttons__text botbuttons__text--white">
            Total price: 100 USDT
          </p>
          <button className="botbuttons__btn golden-wide-button" id="js--generate-nft">
            <span>GENERATE NFT</span>
          </button>
        </div>
        <div className="botbuttons__right">
          <p className="botbuttons__text">
            Сhance for rare
          </p>
          <span className="botbuttons__btn dark-wide-button">
            <span>10%  CHANСE</span>
          </span>
        </div>
      </div>

      <div className="hero__infor infor" id="js--hero-infor">
        <picture>
          <img src="img/dark-elf.png" alt="" />
        </picture>
        <h2>Dark Elf</h2>
        <p className="infor__description active" id="js--infor-desc-hero">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at quam luctus, accumsan enim sed, blandit libero. Sed, blandit.</p>
        <p className="infor__full-description" id="js--infor-full-desc-hero">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt odit ut blanditiis quam consectetur quidem accusamus quod earum perspiciatis inventore vel officia velit repudiandae autem eos obcaecati sapiente dignissimos unde reprehenderit at nulla, nemo ullam animi? Distinctio amet cum veritatis at vitae totam autem beatae delectus nostrum possimus, nobis eos pariatur odit? Qui repellendus consequuntur ipsam consequatur, placeat amet necessitatibus repellat sapiente harum ab quaerat aut nulla vitae et dolores natus. Aut delectus atque ducimus reiciendis, voluptas deserunt est unde natus et eaque illo qui commodi quam, voluptates nobis dolor facere saepe. Sapiente nam pariatur libero perspiciatis. Enim, ex minus!
        </p>
        <button id="js--infor-wide-hero">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="infor__infor-more" d="M3 15L11 7L19 15" />
          </svg>
        </button>
      </div>

      <div className="hero__bottom-corner corner" id="js--hero-bottom-corner">
        <picture className="corner__main">
          <img src="img/gold-corner.png" alt="" />
        </picture>
        <button className="corner__link js--open-wallet" onClick={openWallet}>
          <span className="corner__text">WALLET</span>
          <span className="visually-hidden">to main page</span>
          <picture className="corner__layer1">
            <img src="img/gold-corner-layer1.png" alt="" />
          </picture>
          <picture className="corner__layer2">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer4">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer5">
            <img src="img/gold-corner-layer5.png" alt="" />
          </picture>
        </button>
      </div>

      <div className="hero__generated" id="js--hero-generated">
        <h2>CONGRATULATIONS!</h2>
        <p>DARK ELF WARIOR</p>
        <div className="hero__generated-wrapper">
          <div className="hero__generated-front">
            <picture className="hero__generated-front-race">
              <img src="img/hero-card-race.png" alt="" />
            </picture>
            <picture className="hero__generated-front-hero">
              <img src="img/hero.png" alt="" />
            </picture>
            <picture className="hero__generated-front-border">
              <img src="img/hero-card-front.png" alt="" />
            </picture>
          </div>
          <picture className="hero__generated-back">
            <img src="img/hero-card-back.png" alt="" />
          </picture>
        </div>
        <button>go to chest</button>
      </div>

      <div className="hero__glow round-glow" id="js--hero-glow">
        <picture>
          <img src="img/round-glow2.png" alt="" />
        </picture>
      </div>

    </section>
  )
}

export default HeroScreen