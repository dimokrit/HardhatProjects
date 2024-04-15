import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Outerlinks } from '../../../consts';

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';


const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const state = useAppSelector(state => state['main-landing']);
  const currentUser = useAppSelector(state => state['user']).currentUser;

  function showLoginModal() {
    if (currentUser) {
      navigate('/personal')
    } else {
      dispatch(actions.showMobileNavbar(false))
      dispatch(actions.showLoginModal(true))
    }
  }

  function showMobileNavbar() {
    dispatch(actions.showMobileNavbar(!state.showMobileNavbar))
  }

  function goToPersonalPage() {
    navigate('/personal')
  }

  function showInfoMessage() {
    dispatch(actions.showMobileNavbar(!state.showMobileNavbar))
    dispatch(actions.setInfoMessage('the launch will take place in the October of 2023'))
    dispatch(actions.showInfoMessage(true))
  }

  return (
    <header className="header">
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
          <div className="header__lang-menu">
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

        <nav className={`header__nav ${state.showMobileNavbar === true && 'active'}`}>
          <button onClick={showMobileNavbar} className="header__nav-close-modal white-cross-close" aria-label="close navigation"></button>
    
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

            {/* <li className="header__nav-item--mobile">
              <button onClick={goToPersonalPage}
                id="connect-header"
                // ref="personal.html" //! FEXME
                className="header__connect button-wide"
              >
                Connect
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="160px" height="49px" viewBox="0 0 160 49">
                  <path fillRule="evenodd" strokeWidth="1px" stroke="#FFFFFF" fillOpacity="0"
                    d="M3.586,3.967 L3.586,45.060 L146.487,45.060 L156.449,35.098 L156.449,3.967 L3.586,3.967 Z" />
                </svg>
              </button>
            </li> */}
          </ul>
          <picture className="header__logo logo header__logo--mobile-disabled">
            <img src="img/logo.png" alt="GIRAND логотип" />
          </picture>
          <div className="bubbles header__nav-bubbles-mobile">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
        </nav>

        {/* <button onClick={goToPersonalPage}
          id="js--connect-header" className="header__connect button-wide header__connect--mobile-disable">
          Connect
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="160px"
            height="49px" viewBox="0 0 160 49">
            <path fillRule="evenodd" strokeWidth="1px" stroke="#FFFFFF" fillOpacity="0"
              d="M3.586,3.967 L3.586,45.060 L146.487,45.060 L156.449,35.098 L156.449,3.967 L3.586,3.967 Z" />
          </svg>
        </button> */}

      </div>
    </header>
  )
}

export default Header
