import React from 'react'
import { delay } from '../../../App'
import { actions } from '../../../logic/Personal'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

const ModalRedirectToWhiteList = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.personal)

  function closeModal() {
    dispatch(actions.setShowRedirectModal(false))
  }

  async function goToWhiteListScreen() {
    closeModal()
    dispatch(actions.setStatusSound('off'))
    dispatch(actions.setStatusGate('closed'))
    await delay(1300)
    dispatch(actions.setStatusGate('opened'))
    dispatch(actions.setCurrentScreen('white-list'))
  }

  return (
    <div className={`modal-to-wl ${state.showRedirectModal && 'active'}`} id="js--modal-to-wl">
      <button className="modal-to-wl__close btn-close" id="js--modal-to-wl-close" onClick={closeModal}>
        <picture>
          <img src="img/close-mod.png" alt="" />
        </picture>
        <span className="visually-hidden">close modal window</span>
      </button>
      <h2 id="js--modal-to-wl-title">{state.redirectModal.title}</h2>
      <p style={{textAlign: 'center'}}>{state.redirectModal.description}</p>
      <button 
        //onClick={goToWhiteListScreen}
        onClick={closeModal}
        className="modal-to-wl__whitelist wide-goldborder-btn"
      >
        OK
      </button>
    </div>
  )
}

export default ModalRedirectToWhiteList 