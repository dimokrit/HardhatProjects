import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

import JoinCommunity from '../components/JoinCommunity';

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';
import { Outerlinks } from '../../../consts';

const Footer = ( ) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const state = useAppSelector(state => state['main-landing']);

  function showLoginModal() {
    dispatch(actions.showMobileNavbar(false))
    dispatch(actions.showLoginModal(true))
  }

  function showMobileNavbar() {
    dispatch(actions.showMobileNavbar(!state.showMobileNavbar))
  }

  function goToPersonalPage() {
    navigate('/personal')
  }
  
  function showInfoMessage() {
    dispatch(actions.setInfoMessage('the launch will take place in the October of 2023'))
    dispatch(actions.showInfoMessage(true))
  }

  return (
    <section className="bottom">
      <video muted autoPlay={true} playsInline loop={true}>
        <source src="img/bottom1.webm" type="video/webm" />
        <source src="img/bottom1.mp4" type="video/mp4" />
      </video>
      <h2 className="bottom__title">BECOME A GIRAND HERO WITH US AND EARN!</h2>
      <JoinCommunity />
      <div className="bottom__header">
        <div className="header__wrapper">

          <div className="header__left header__left--nopc">
            <span>Language</span>
            <button className="header__lang-open button-lang">
              En
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="68px"
                height="49px" viewBox="0 0 68 49">
                <path fillRule="evenodd" strokeWidth="1px" stroke="rgb(255, 255, 255)" fillOpacity="0"
                  fill="#FFFFFF"
                  d="M4.376,3.967 L4.376,45.060 L54.272,45.060 L64.234,35.098 L64.234,3.967 L4.376,3.967 Z" />
              </svg>
            </button>
            <div className="header__lang-menu header__lang-menu--bottom">
              <button className="header__lang-btn button-lang active">
                En
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="68px" height="49px" viewBox="0 0 68 49">
                  <path fillRule="evenodd" strokeWidth="1px" stroke="rgb(255, 255, 255)"
                    fillOpacity="0" fill="#FFFFFF"
                    d="M4.376,3.967 L4.376,45.060 L54.272,45.060 L64.234,35.098 L64.234,3.967 L4.376,3.967 Z" />
                </svg>
              </button>
              {/* <button className="header__lang-btn button-lang">
                Ru
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="68px" height="49px" viewBox="0 0 68 49">
                  <path fillRule="evenodd" strokeWidth="1px" stroke="rgb(255, 255, 255)"
                    fillOpacity="0" fill="#FFFFFF"
                    d="M4.376,3.967 L4.376,45.060 L54.272,45.060 L64.234,35.098 L64.234,3.967 L4.376,3.967 Z" />
                </svg>
              </button> */}
            </div>
          </div>

          <button onClick={showMobileNavbar} className={`header__open-modal ${state.showMobileNavbar === true && 'open'}`} aria-label="open modal navigation">
            <span className="nav-menu-btn__icon">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <p>Menu</p>
          </button>
          <picture className="header__logo logo header__logo--desktop-disable">
            <img src="img/logo.png" alt="GIRAND логотип" />
          </picture>
          <nav className="header__nav footer__nav-mobile-disabled">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <a href={Outerlinks.Gitbook} target='_blank' rel='noreferrer'>Whitepaper</a>
              </li>

              <li className="header__nav-item">
                <a href={Outerlinks.Litepapper} target='_blank' rel='noreferrer'>Litepaper</a>
              </li>
              
              <li className="header__nav-item">
                <a href={Outerlinks.GirandPortalGame} target='_blank' rel='noreferrer'>Mini games</a>
              </li>

              <li className="header__nav-item">
                <Link to="/personal">Girand shop</Link>
              </li>
            </ul>
            <picture className="header__logo logo">
              <img src="img/logo.png" alt="GIRAND логотип" />
            </picture>
          </nav>

          {/* <button onClick={goToPersonalPage} id="js--connect-bottom" className="header__connect button-wide header__connect--mobile-disable">
            Connect
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="160px"
              height="49px" viewBox="0 0 160 49">
              <path fillRule="evenodd" strokeWidth="1px" stroke="#FFFFFF" fillOpacity="0"
                d="M3.586,3.967 L3.586,45.060 L146.487,45.060 L156.449,35.098 L156.449,3.967 L3.586,3.967 Z" />
            </svg>
          </button> */}

        </div>
      </div>
    </section>
  )
}

export default Footer
