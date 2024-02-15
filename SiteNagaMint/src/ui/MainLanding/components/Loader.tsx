import React from 'react'
import { useAppSelector } from '../../../redux-store'

const Loader = () => {

  const state = useAppSelector(state => state['main-landing'])
  return (
    <div className={`loader__main ${state.showMainLoader === true && 'active'}`} id="loader" >
      <picture className="why__logo">
        <img src="img/logo-on-dark.png" alt="" />
      </picture>
      <picture className="loader__main__circle-text">
        <img src="img/circle-text.png" alt="" />
      </picture>
    </div >
  )
}

export default Loader
