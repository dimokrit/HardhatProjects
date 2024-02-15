import React from 'react'
import { actions } from '../../../logic/Wallet'
import { actions as actionsMain } from '../../../logic/MainLanding'
import { useAppDispatch, useAppSelector } from '../../../redux-store'
import { Outerlinks } from '../../../consts'

const InfoBlock = () => {

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.user).currentUser

  function openUserWalletSettings() {
    if (currentUser) {
      dispatch(actions.setCurrentWalletWindow('settings'))
      dispatch(actions.setStatusWalet('opened'))

      dispatch(actions.setUserPromo(currentUser.inviterCode))
    } else {
      dispatch(actions.setUserPromo(null))
      dispatch(actionsMain.showLoginModal(true))
    }
  }

  function openUserWalletSupport() {
    dispatch(actions.setCurrentWalletWindow('support'))
    dispatch(actions.setStatusWalet('opened'))
  }

  return (

    <div className="info goldborder">
      <picture className="goldborder__border">
        <img src="img/p-social.png" alt="" />
      </picture>
      <span className="goldborder__text">INFORMATION</span>
      <ul className="goldborder__list">
        <li className="goldborder__item">
          <button className="goldborder__link" onClick={openUserWalletSettings}>
            <picture className="goldborder__picSettings">
              <img src="img/info-sett.png" alt="" />
            </picture>
            <span className="visually-hidden">Open settings</span>
          </button>
        </li>
        <li className="goldborder__item">
          <a href={Outerlinks.Gitbook} target='_blank' rel='noreferrer' className="goldborder__link">
            <picture className="goldborder__picExclam">
              <img src="img/wp.png" alt="" />
            </picture>
            <span className="visually-hidden">Open notification</span>
          </a>
        </li>
        <li className="goldborder__item">
          <button className="goldborder__link disabled" >
            <picture className="goldborder__picHelp">
              <img src="img/info-help.png" alt="" />
            </picture>
            <span className="visually-hidden">Open support</span>
          </button>
        </li>
        <li className="goldborder__item">
          <button className="goldborder__link disabled">
            <picture className="goldborder__picHands">
              <img src="img/info-hands.png" alt="" />
            </picture>
            <span className="visually-hidden">Open ...</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default InfoBlock