import React, { useEffect } from 'react'
import { useAppDispatch } from '../../redux-store';

import Loader from './components/Loader';
import SeaTopVideo from './components/SeaTopVideo';
import SeaTopVideoImgBefore from './components/SeaTopVideoImgBefore';
import TopBackground from './components/TopBackground';
import LoginModal from './modals/LoginModal';
import VideoModal from './modals/VideoModal';
import Footer from './navigation/Footer';
import Header from './navigation/Header';
import Description from './screens/Description';
import Diag from './screens/Diag';
import Ebox from './screens/Ebox';
import Evo from './screens/Evo';
import Guild from './screens/Guild';
import Help from './screens/Help';
import Gameplay from './screens/Gameplay';
import Hero from './screens/Hero';
import Intro from './screens/Intro';
import Invest from './screens/Invest';
import Ktu from './screens/Ktu';
import Pe2 from './screens/Pe2';
import Play from './screens/Play';
import Ratings from './screens/Ratings';
import Rings from './screens/Rings';
import Roadmap from './screens/Roadmap';
import Team from './screens/Team';
import Token from './screens/Token';
import Trade from './screens/Trade';
import Why from './screens/Why';
import TextMessageModal from './modals/TextMessageModal';

import '../../assets/styles/MainLanding.css';
import { actions } from '../../logic/User';

const MainLanding = () => {
  const dispatch = useAppDispatch()

  // init
  useEffect(() => {
    dispatch(actions.getAuthenticatedUser())
  }, [])

  return (
    <div className="App">
      <Loader />

      {/* 1 */}
      <div className="video__container">
        <SeaTopVideoImgBefore />
        <SeaTopVideo />
        <Header />
        <Intro />
        <Play />
      </div>

      {/* 2 */}
      <div className="top-bg">
        <TopBackground />
        <Description />
        <Diag />
        <Why />
        <Token />
        <Pe2 />
      </div>

      {/* 3 */}
      <div className="repeat-bg repeat-bg--offset-top">
        <Guild />
        <Ktu />
      </div>

      {/* 4 */}
      <div className="repeat-bg">
        <Hero />
        <Rings />
        <Gameplay />
        <Trade />
        <Ebox />
        <Evo />
        <Ratings />
        <Help />
        <Invest />
        <Team />
      </div>

      <Roadmap />
      <Footer />

      <VideoModal />
      <LoginModal />
      <TextMessageModal />
    </div>
  );
}

export default MainLanding