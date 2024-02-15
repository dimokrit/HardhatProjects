import React from 'react'
import { actions } from '../../../logic/Personal';
import { useAppDispatch, useAppSelector } from '../../../redux-store';

const Loader = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(state => state['personal']);
  const userState = useAppSelector(state => state['user']);

  function openGate() {
    // if (userState.currentUser) {
    dispatch(actions.showGoButton(false))
    dispatch(actions.setStatusGate('opened'))
    dispatch(actions.setStatusSound('on'))
    dispatch(actions.setSoundInUserSettings('on'))
    // }
  }

  return (
    <div id="loader"
      className={`loader gate-mode  ${state.statusGate === 'opened' ? 'hide' : 'active'}`}
      style={state.statusGate === 'opened' ? { pointerEvents: 'none' } : {}}
    >
      <picture className="loader__left">
        <source media="(max-width: 600px)" srcSet="img/mobile-gate.png" type="image/png" />
        <source srcSet="img/wolf-gate.webp" type="image/webp" />
        <img src="img/wolf-gate.png" alt="" />
      </picture>
      <picture className="loader__right">
        <source media="(max-width: 600px)" srcSet="img/mobile-gate.png" type="image/png" />
        <source srcSet="img/wolf-gate.webp" type="image/webp" />
        <img src="img/wolf-gate.png" alt="" />
      </picture>
      {state.showGoButton &&
        <button className={`loader__go ${state.activeGoButton && 'active'}`} id="loader-go" onClick={openGate}>
          <picture className="loader__go-layer1">
            <img src="img/loader-go1.png" alt="" />
          </picture>
          <span>{state.activeGoButton ? 'GO' : 'LOAD'}</span>
          <picture className="loader__go-layer3">
            <img src="img/loader-go3.png" alt="" />
          </picture>
          <picture className="loader__go-layer4">
            <img src="img/loader-go4.png" alt="" />
          </picture>
        </button>
      }
    </div>
  )
}

export default Loader