import React from 'react'
import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';

const TextMessageModal = () => {
  const dispatch = useAppDispatch();
  const { showInfoMessage, infoMessage } = useAppSelector(state => state['main-landing']);

  function closeInfoMessage() {
    dispatch(actions.showInfoMessage(false));
  }

  return (
    <div className={`m-connect ${showInfoMessage && 'active'} m-connect--portal`}>
      <button onClick={closeInfoMessage}
        className="m-connect__close" id="js--mconnect-close">
        <span className="visually-hidden">close login modal window</span>
      </button>
      <h2 className='m-connect__title'>{infoMessage}</h2>
    </div>
  )
}

export default TextMessageModal;