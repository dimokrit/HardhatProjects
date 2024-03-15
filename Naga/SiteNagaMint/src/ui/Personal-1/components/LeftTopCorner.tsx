import React from 'react'
import { useNavigate } from 'react-router-dom'
import { delay } from '../../../App'
import { actions as actionsPersonal } from '../../../logic/Personal'
import { actions as actionsMain } from '../../../logic/MainLanding'
import { actions as actionsWhiteList } from '../../../logic/MainLanding'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

const LeftTopCorner = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const state = useAppSelector(state => state['personal'])

  const hideCondition = state.statusGetSphere === 'activated'

  async function goToMainScreen() {
    if (state.currentScreen !== 'main') {
      dispatch(actionsPersonal.setStatusGate('closed'))
      await delay(1300)
      dispatch(actionsPersonal.setStatusGate('opened'))
    }

    dispatch(actionsPersonal.setCurrentScreen('main'))
  }

  async function goToLanding() {
    navigate('/')
    dispatch(actionsPersonal.clearState())
    dispatch(actionsMain.clearState())
    dispatch(actionsWhiteList.clearState())
  }

  return (

    <div className={`${state.currentScreen === 'main' ? 'topleft__wrapper' : 'whitelist__corner'}  corner ${hideCondition && 'hide'}`}

    >
      <picture className="corner__main">
        <img src="img/gold-corner.png" alt="" />
      </picture>
      <button
        className='corner__link' id="js--sphere-window-close" onClick={state.currentScreen === 'main' ? goToLanding : goToMainScreen}>
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
    </div >

  )
}

export default LeftTopCorner