import React from 'react'

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';

const SeaTopVideo = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state['main-landing'])

  function onLoadedData() {
    if (state.showMainLoader) {
      dispatch(actions.showMainLoader(false));
    }
  }

  return (
    <video onCanPlayThrough={onLoadedData} className="sea-top-video" playsInline muted autoPlay={true} loop={true} >
      <source src="img/sea-top.mp4" type="video/mp4" />
    </video>
  )
}

export default SeaTopVideo