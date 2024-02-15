import React, { useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { delay } from '../../../App'
import { actions as actionsWallet } from '../../../logic/Wallet'
import { actions as actionsPersonal } from '../../../logic/Personal'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

const SphereScreen = () => {
  const [swiper, setSwiper] = useState<any>(null)

  function onClickPrevArrow() {
    swiper?.slidePrev()
  }

  function onClickNextArrow() {
    swiper.slideNext()
  }

  const state = useAppSelector(state => state['personal'])
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(state => state.user).currentUser;
  const hideCondition = state.statusGetSphere === 'activated'

  function openWallet() {
    if (currentUser) {
      dispatch(actionsWallet.getDepositAdressesByUserId(currentUser.id));
      dispatch(actionsWallet.getTransactionsByUserId(currentUser.id));
      dispatch(actionsWallet.getUserBalance());
      dispatch(actionsWallet.setStatusWalet('opened'))
    }
  }

  function onSlideChange({ activeIndex }: { activeIndex: number }) {
    dispatch(actionsPersonal.setCurrentSphere(state.listSphere[activeIndex + 1]))
  }

  function openSphereInfo() {
    if (state.statusSphereInfo === 'closed') {
      dispatch(actionsPersonal.setStatusSphereInfo('opened'))
    }
    if (state.statusSphereInfo === 'opened') {
      dispatch(actionsPersonal.setStatusSphereInfo('closed'))
    }
  }

  function activateSphere() {
    dispatch(actionsPersonal.setStatusGetSphere('activated'))
  }

  async function goToMainScreen() {
    dispatch(actionsPersonal.setStatusGate('closed'))
    await delay(1300)
    dispatch(actionsPersonal.setStatusGate('opened'))
    dispatch(actionsPersonal.setCurrentScreen('main'))
  }

  return (
    <section className={`sphere${state.currentScreen === 'sphere' ? ' active' : ''}`} id="js--sphere-window">

      <picture className="sphere__light">
        <img src="img/light1.png" alt="" />
      </picture>

      <h2 className={`sphere__title ${hideCondition && 'hide'}`} id="js--sphere-title">
        {state.currentSphere.name.toUpperCase()}
      </h2>

      <div className={`sphere__corner corner ${hideCondition && 'hide'}`} id="js--sphere-corner">
        <picture className="corner__main">
          <img src="img/gold-corner.png" alt="" />
        </picture>
        <button className="corner__link" id="js--sphere-window-close" onClick={goToMainScreen}>
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

      <div className="smoke">
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
      </div>

      <div className="sphere__list-wrapper">
        <button
          style={hideCondition ? { display: 'none' } : {}}
          className="sphere__slider-left slider-left"
          onClick={onClickPrevArrow}
        >
          <span className="vusially-hidden">switch to left</span>
        </button>

        <div className="sphere__listoverflow">
          <div className="sphere__list">
            <Swiper
              spaceBetween={0}
              slidesPerView={3}
              onSlideChange={onSlideChange}
              onSwiper={setSwiper}
              allowSlideNext
              allowSlidePrev
              loopFillGroupWithBlank
            // centeredSlides={true}
            >
              {
                state.listSphere.map((sphere, index) => {
                  return <SwiperSlide key={index.toString()} style={{ display: 'flex', justifyContent: 'center' }}>
                    {({ isNext, isActive, isPrev }) => {
                      const centerIndexSphere = state.listSphere.findIndex((e) => e.id === state.currentSphere.id)
                      const isCenter = isNext;
                      const isLeft = isActive;
                      const isRight = index === centerIndexSphere + 1;

                      const hideCondition = ((!isLeft && !isRight && !isCenter) && state.statusGetSphere === 'activated')
                      const fromLeftCondition = (isLeft && state.statusGetSphere === 'activated')
                      const fromRightCondition = (isRight && state.statusGetSphere === 'activated')
                      const bigCondition = ((isCenter) && state.statusGetSphere === 'activated')

                      return (
                        <div
                          className={`sphere__item ${isCenter && 'active'} ${hideCondition && 'hide'} ${bigCondition && 'bigger'} ${fromLeftCondition && 'from-left-hide'} ${fromRightCondition && 'from-right-hide'}`}
                          data-title={sphere.name} >
                          <picture>
                            <img src={sphere.imgPath} alt="" />
                          </picture>
                        </div>
                      )
                    }}

                  </SwiperSlide>
                })
              }
            </Swiper>
          </div>
        </div>

        <button
          style={hideCondition ? { display: 'none' } : {}}
          className="sphere__slider-right slider-right"
          onClick={onClickNextArrow}
        >
          <span className="vusially-hidden">switch to right</span>
        </button>
      </div>

      <div className={`sphere__timer timer ${hideCondition && 'hide'}`} id="js--sphere-timer">
        <picture><img src="img/sandclock.png" alt="" /></picture>
        <h3>NEXT SHPERE AFTER</h3>
        <p>
          00 : 00 : 24
          <span>min</span>
        </p>
      </div>

      <div className={`sphere__bottom botbuttons ${hideCondition && 'hide'}`} id="js--sphere-bottom">
        <div className="botbuttons__left">
          <p className="botbuttons__text">
            Available for sale
          </p>
          <span className="botbuttons__btn dark-wide-button">
            <span>1 SPHERE</span>
          </span>
        </div>
        <div className="botbuttons__center">
          <p className="botbuttons__text botbuttons__text--white">
            Total price: 25 USDT
          </p>
          <button className="botbuttons__btn golden-wide-button" id="js--get-sphere" onClick={activateSphere}>
            <span>GET SPHERE</span>
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

      <button className={`sphere__question question-btn ${hideCondition && 'hide'}`} id="js--sphere-question">
        <picture><img src="img/ql-1.png" alt="" /></picture>
        <picture><img src="img/ql-2.png" alt="" /></picture>
        <picture><img src="img/ql-3.png" alt="" /></picture>
        <picture><img src="img/ql-4.png" alt="" /></picture>
      </button>

      <div
        className={`sphere__infor infor infor--nopic ${state.statusSphereInfo === 'opened' && 'active'} ${hideCondition && 'hide'} `}
        id="js--sphere-infor"
      >
        <h2>Spheres</h2>
        <p className={`infor__description active`}
          style={{ display: state.statusSphereInfo === 'opened' ? 'none' : 'block' }}
          id="js--infor-desc-sphere"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at quam luctus, accumsan enim sed, blandit libero. Sed, blandit.
        </p>
        <p
          className={`infor__full-description ${state.statusSphereInfo === 'opened' && 'active'}`}
          style={{ pointerEvents: 'none' }}
          id="js--infor-full-desc-sphere"
        >
          <span>sphere1</span> <br /> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio amet cum veritatis at vitae totam autem beatae delectus nostrum possimus, nobis eos pariatur odit? Qui repellendus consequuntur ipsam consequatur.
          <br /><br />
          <span>sphere2</span> <br /> Nesciunt odit ut blanditiis quam consectetur quidem accusamus quod earum perspiciatis inventore vel officia velit repudiandae autem eos obcaecati sapiente dignissimos unde reprehenderit at nulla, nemo ullam animi?
          <br /><br />
          <span>sphere3</span> <br /> Placeat amet necessitatibus repellat sapiente harum ab quaerat aut nulla vitae et dolores natus. Aut delectus atque ducimus reiciendis, voluptas deserunt est unde natus et eaque illo qui commodi quam, voluptates nobis dolor facere saepe. Sapiente nam pariatur libero perspiciatis. Enim, ex minus!
        </p>
        <button id="js--infor-wide-sphere" onClick={openSphereInfo}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="infor__infor-more" d="M3 15L11 7L19 15" />
          </svg>
        </button>
      </div>

      <div className={`sphere__bottom-corner corner ${hideCondition && 'hide'}`} id="js--sphere-bottom-corner">
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

      <div className={`sphere__glow round-glow ${state.statusGetSphere === 'activated' && 'active'}`} id="js--sphere-glow">
        <picture>
          <img src="img/round-glow2.png" alt="" />
        </picture>
      </div>

    </section >
  )
}

export default SphereScreen