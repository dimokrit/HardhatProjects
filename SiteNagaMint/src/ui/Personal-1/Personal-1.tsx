import '../../assets/styles/Personal-1.css';

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux-store';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay } from '../../App';

import Loader from './components/Loader';
import LeftTopCorner from './components/LeftTopCorner';
import SocialCommunity from './components/SocialCommunity';
import SoundButton from './components/SoundButton';
import RightBottomCorner from './components/RightBottomCorner';
import InfoBlock from './components/InfoBlock';

import ModalWallet from './modals/ModalWallet';
import ModalRedirectToWhiteList from './modals/ModalRedirectToWhiteList';
import TextMessageModal from '../MainLanding/modals/TextMessageModal';

import SphereScreen from './screens/Sphere';
import HeroScreen from './screens/Hero';
import ChestScreen from './screens/Chest';
import WhaitListScreen from './screens/WhiteList';

import { actions } from '../../logic/Personal';
import { actions as actionsUser } from '../../logic/User';
import { actions as actionsWallet } from '../../logic/Wallet';
import { PaymentDeposit } from '../../logic/types/types';
import LoginModal from '../MainLanding/modals/LoginModal';
import GlcPresaleScreen from './screens/GlcPresale';
import NftSale from './screens/NftSale';

const Personal1 = () => {
  const dispatch = useAppDispatch();

  const personalState = useAppSelector(state => state['personal'])
  const walletState = useAppSelector(state => state['wallet'])

  const { currentVideoIndex, statusSound, statusGate } = personalState
  const { userSettings, currentScreen } = personalState

  const { loadDepositsStatus, loadBalancesStatus, userBalances, depositAddresses } = walletState

  const musicStore = useRef<HTMLAudioElement>(null)
  const soundCloseGate = useRef<HTMLAudioElement>(null)

  const video1 = useRef<HTMLVideoElement>(null)
  const video2 = useRef<HTMLVideoElement>(null)
  const video3 = useRef<HTMLVideoElement>(null)
  const video4 = useRef<HTMLVideoElement>(null)

  const [videoState, setVideoState] = useState({ v1: false, v2: false, v3: false, v4: false })

  // begin init
  useEffect(() => {
    dispatch(actionsUser.getAuthenticatedUser())
  }, []);


  useEffect(() => {
    if (loadDepositsStatus === 'success' && loadBalancesStatus === 'success') {
      const paymentDeposits: PaymentDeposit[] = []

      userBalances.forEach(balance => {

        depositAddresses.forEach(deposit => {
          if (balance.currency === deposit.currency.id) {
            const paymentDeposit: PaymentDeposit = {
              balance: balance.balance || '0',
              currency: deposit.currency
            }
            paymentDeposits.push(paymentDeposit)
          }
        })
      })

      paymentDeposits.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))

      dispatch(actionsWallet.setPaymentDeposits(paymentDeposits))
      dispatch(actionsWallet.setCurrentPaymentDeposit(paymentDeposits[0]))
    }
  }, [loadDepositsStatus, loadBalancesStatus])


  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function onEndVideo() {
    const randomNumber = getRandomNumber(1, 4)

    if (randomNumber === currentVideoIndex || randomNumber === 1) {
      onEndVideo()
    } else {
      dispatch(actions.setCurrentVideoIndex(randomNumber))
    }
  }

  useEffect(() => {
    if (statusGate == 'opened' && currentScreen == 'main') {
      if (currentVideoIndex === 1) video1.current?.play()
      if (currentVideoIndex === 2) video2.current?.play()
      if (currentVideoIndex === 3) video3.current?.play()
      if (currentVideoIndex === 4) video4.current?.play()
    }
  }, [currentVideoIndex, statusGate])

  useEffect(() => {
    if (statusSound === 'off') {
      musicStore.current?.pause()
      if (video1.current) video1.current.muted = true
      if (soundCloseGate.current) soundCloseGate.current.muted = true
    } else {
      musicStore.current?.play()
      if (video1.current) video1.current.muted = false
      if (soundCloseGate.current) soundCloseGate.current.muted = false
    }
  }, [statusSound, currentVideoIndex])

  useEffect(() => {
    if (statusGate === 'closed') {
      dispatch(actions.setStatusSound('off'))
      if (video1.current) video1.current.muted = true
      if (soundCloseGate.current) soundCloseGate.current.muted = true

      delay(1000).then(() => soundCloseGate.current?.play())
    }
  }, [dispatch, statusGate])

  useEffect(() => {
    if (currentScreen === 'main') {
      if (userSettings.sound === 'on') {
        if (video1.current) video1.current.muted = false
        if (soundCloseGate.current) soundCloseGate.current.muted = false
        dispatch(actions.setStatusSound('on'))
      }
      if (userSettings.sound === 'off') {
        if (video1.current) video1.current.muted = true
        if (soundCloseGate.current) soundCloseGate.current.muted = true
        dispatch(actions.setStatusSound('off'))
      }
    } else {
      if (userSettings.sound === 'on') {
        if (video1.current) video1.current.muted = true
        if (soundCloseGate.current) soundCloseGate.current.muted = false
        dispatch(actions.setStatusSound('on'))
      }
      if (userSettings.sound === 'off') {
        if (video1.current) video1.current.muted = true
        if (soundCloseGate.current) soundCloseGate.current.muted = true
        dispatch(actions.setStatusSound('off'))
      }
    }
  }, [currentScreen, userSettings.sound, dispatch, video1, soundCloseGate])

  useEffect(() => {
    if (video1.current && videoState.v1) video1.current.setAttribute('autoplay', 'false')
    if (video2.current && videoState.v2) video2.current.setAttribute('autoplay', 'false')
    if (video3.current && videoState.v3) video3.current.setAttribute('autoplay', 'false')
    if (video4.current && videoState.v4) video4.current.setAttribute('autoplay', 'false')

    if (videoState.v1 === true && videoState.v2 === true) {
      dispatch(actions.setActiveGoButton(true))

      if (video1.current) {
        video1.current.currentTime = 0
        video1.current.pause()
      }

      if (video2.current) {
        video2.current.currentTime = 0
        video2.current.pause()
      }

      if (video3.current) {
        video3.current.currentTime = 0
        video3.current.pause()
      }

      if (video4.current) {
        video4.current.currentTime = 0
        video4.current.pause()
      }
    }
  }, [videoState.v1, videoState.v2, videoState.v3, videoState.v4]);

  return (
    <>
      <Loader />
      <div className="mainwrapper"
      // style={{height: '100vh'}}
      >
        <video
          playsInline
          autoPlay
          ref={video1}
          className={`mainwrapper__video${currentVideoIndex === 1 ? ' active' : ''}`}
          src="img/store1.mp4"
          onCanPlayThrough={(e) => { setVideoState(prev => ({ ...prev, v1: true })) }}
          onEnded={() => dispatch(actions.setCurrentVideoIndex(2))}
        />

        <video
          playsInline
          autoPlay
          ref={video2}
          className={`mainwrapper__video${currentVideoIndex === 2 ? ' active' : ''}`}
          src="img/store2.mp4"
          muted
          onCanPlayThrough={(e) => { setVideoState(prev => ({ ...prev, v2: true })) }}
          onEnded={() => {
            if (videoState.v1 && videoState.v2 && videoState.v3 && videoState.v4) {
              onEndVideo()
            } else {
              dispatch(actions.setCurrentVideoIndex(2))
            }
          }}
        />

        <video
          playsInline
          autoPlay
          ref={video3}
          className={`mainwrapper__video${currentVideoIndex === 3 ? ' active' : ''}`}
          src="img/store3.mp4"
          muted
          onCanPlayThrough={(e) => { setVideoState(prev => ({ ...prev, v3: true })) }}
          onEnded={() => dispatch(actions.setCurrentVideoIndex(4))}
        />

        <video
          playsInline
          autoPlay
          ref={video4}
          className={`mainwrapper__video${currentVideoIndex === 4 ? ' active' : ''}`}
          src="img/store4.mp4"
          muted
          onCanPlayThrough={(e) => { setVideoState(prev => ({ ...prev, v4: true })) }}
          onEnded={onEndVideo}
        />

        <audio id="music-bg" src="img/store.mp3" loop ref={musicStore}></audio>
        <audio id="sound-gate" src="img/boom1.mp3" ref={soundCloseGate}></audio>

        <LeftTopCorner />
        <SocialCommunity />
        <SoundButton />
        <RightBottomCorner />
        <InfoBlock />
        <ModalWallet />

        <SphereScreen />
        <NftSale />
        <ChestScreen />
        <WhaitListScreen />
        <GlcPresaleScreen />

        <ModalRedirectToWhiteList />
        <LoginModal />
        <TextMessageModal />
      </div>
    </>
  )
}

export default Personal1