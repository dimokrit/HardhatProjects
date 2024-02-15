import React, { useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group';

import { actions } from '../../../logic/MainLanding';
import { useAppDispatch, useAppSelector } from '../../../redux-store';

import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';

const VideoModal = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state['main-landing']);

  const duration = 600;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }

  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: { opacity: 0 },
  };

  function closeVideoModal() {
    dispatch(actions.showVideoModal(false))
    video?.target.pauseVideo()
  }

  const refChildren = useRef(null);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
    setVideo(event);
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  }

  const [ video, setVideo ] = useState<YouTubeEvent<any>|null>(null)

  return (
    <div className={`desc__modal-wrapper ${state.showVideoModal && 'active'}`}>
      <div className="desc__modal__iframe-wrapper">
        <button onClick={closeVideoModal} className="desc__close-modal white-cross-close" aria-label="close modal video"></button>
        {/*<iframe width="560" height="315" src="https://www.youtube.com/embed/DmYjI6rCYqg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>*/}
        <YouTube videoId="DmYjI6rCYqg" opts={opts} onReady={onPlayerReady} />
      </div>
    </div>
  )
}

export default VideoModal