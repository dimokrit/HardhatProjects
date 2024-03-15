import React from 'react'
import { actions } from '../../../logic/Wallet';
import { useAppDispatch, useAppSelector } from '../../../redux-store'

function RightBottomCornerWallet() {
  const state = useAppSelector(state => state.personal)
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(state => state.user).currentUser;
  const hideCondition = state.statusGetSphere === 'activated'

  function openWallet() {
    if (currentUser) {
      dispatch(actions.setCurrentWalletWindow('spending-wallet'))
      dispatch(actions.getDepositAdressesByUserId(currentUser.id));
      dispatch(actions.getTransactionsByUserId(currentUser.id));
      dispatch(actions.getUserBalance());
      dispatch(actions.setStatusWalet('opened'))
    }
  }
  return (
    <div
      className={
        ` corner ${hideCondition && 'hide'}
          ${state.currentScreen === 'white-list' && 'whitelist__bottom-corner'}
          ${state.currentScreen === 'sphere' && 'sphere__bottom-corner'}
          ${state.currentScreen === 'hero' && 'hero__bottom-corner'}
          ${state.currentScreen === 'chest' && 'chest__bottom-corner'}
          ${state.currentScreen === 'glc-presale' && 'chest__bottom-corner'}
      `}
    >
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
  )
}

export default RightBottomCornerWallet