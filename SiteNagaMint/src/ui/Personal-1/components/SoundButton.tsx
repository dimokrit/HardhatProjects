import React from 'react'
import { actions } from '../../../logic/Personal'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

type Props = {
  isOnlyIcon?: boolean
}

const SoundButton: React.FC<Props> = ({ isOnlyIcon = false }) => {
  const state = useAppSelector(state => state['personal'])
  const dispatch = useAppDispatch()

  function switchSound() {
    if (state.statusSound === 'off') {
      dispatch(actions.setStatusSound('on'))
      dispatch(actions.setSoundInUserSettings('on'))
    } else {
      dispatch(actions.setStatusSound('off'))
      dispatch(actions.setSoundInUserSettings('off'))
    }
  }

  return (
    <div className="mtitle__wrapper">
      {isOnlyIcon === false && <h1 className="mtitle">girand store</h1>}
      <button
        onClick={switchSound}
        id="js--mute-btn"
        className={`mute${state.statusSound === 'off' ? ' active' : ''}`}
      >
        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="fillOpacity" cx="37.5" cy="37.5" r="37.5" fillOpacity="0.33" />
          <path className="light" d="M40.4375 56.5938C40.138 56.593 39.8459 56.5008 39.6003 56.3294L24.9128 46.0481C24.7183 45.9132 24.5592 45.7331 24.4492 45.5234C24.3393 45.3137 24.2816 45.0805 24.2812 44.8438V30.1563C24.2816 29.9195 24.3393 29.6863 24.4492 29.4766C24.5592 29.2669 24.7183 29.0868 24.9128 28.9519L39.6003 18.6706C39.8144 18.5257 40.063 18.4399 40.3209 18.4219C40.5788 18.4038 40.8369 18.4542 41.0691 18.5678C41.3168 18.6858 41.5265 18.8707 41.6745 19.1018C41.8224 19.3328 41.9027 19.6007 41.9063 19.875V55.125C41.9068 55.3947 41.8331 55.6594 41.6932 55.8899C41.5533 56.1205 41.3526 56.3081 41.1131 56.4322C40.9041 56.5393 40.6724 56.5947 40.4375 56.5938ZM27.2188 44.08L38.9688 52.305V22.695L27.2188 30.92V44.08Z" />
          <path className="light" d="M25.75 46.3125H19.875C18.7064 46.3125 17.5856 45.8483 16.7593 45.0219C15.933 44.1956 15.4688 43.0749 15.4688 41.9062V33.0938C15.4688 31.9251 15.933 30.8044 16.7593 29.9781C17.5856 29.1517 18.7064 28.6875 19.875 28.6875H25.75C26.1395 28.6875 26.5131 28.8422 26.7886 29.1177C27.064 29.3931 27.2188 29.7667 27.2188 30.1562V44.8438C27.2188 45.2333 27.064 45.6069 26.7886 45.8823C26.5131 46.1578 26.1395 46.3125 25.75 46.3125ZM19.875 31.625C19.4855 31.625 19.1119 31.7797 18.8364 32.0552C18.561 32.3306 18.4062 32.7042 18.4062 33.0938V41.9062C18.4062 42.2958 18.561 42.6694 18.8364 42.9448C19.1119 43.2203 19.4855 43.375 19.875 43.375H24.2812V31.625H19.875Z" />
          <path className="light" d="M46.6404 30.228L44.5632 32.3052L57.026 44.7679L59.1031 42.6908L46.6404 30.228Z" />
          <path className="light" d="M57.026 30.2281L44.5632 42.6908L46.6404 44.768L59.1031 32.3052L57.026 30.2281Z" />
        </svg>
        <span className="mute__bars">
          <span className="mute__bar"></span>
          <span className="mute__bar"></span>
          <span className="mute__bar"></span>
          <span className="mute__bar"></span>
          <span className="mute__bar"></span>
        </span>
      </button>
    </div>
  )
}

export default SoundButton