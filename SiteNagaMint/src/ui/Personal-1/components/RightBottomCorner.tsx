import React from 'react'
import { actions as actionsWallet } from '../../../logic/Wallet'
import { actions as actionsPersonal } from '../../../logic/Personal'
import { actions as actionsMain } from '../../../logic/MainLanding'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

const RightBottomCorner = () => {
  const dispatch = useAppDispatch()

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const currentUser = useAppSelector(state => state.user).currentUser;

  function openWallet() {
    if (currentUser) {
      dispatch(actionsWallet.setCurrentWalletWindow('spending-wallet'))
      dispatch(actionsWallet.getDepositAdressesByUserId(currentUser.id));
      dispatch(actionsWallet.getTransactionsByUserId(currentUser.id));
      dispatch(actionsWallet.getUserBalance());
      dispatch(actionsWallet.setStatusWalet('opened'))
    } else {
      dispatch(actionsMain.showLoginModal(true))
    }
  }

  async function goToChestScreen() {
    dispatch(actionsPersonal.setStatusSound('off'))
    dispatch(actionsPersonal.setStatusGate('closed'))
    await delay(1300)
    dispatch(actionsPersonal.setStatusGate('opened'))
    dispatch(actionsPersonal.setCurrentScreen('chest'))
  }

  async function goToHeroScreen() {
    // if (currentUser) {
    //   dispatch(actionsPersonal.setShowRedirectModal(true)) // временно
    //   dispatch(actionsPersonal.setRedirectModalTitle({
    //     title: "MY NFT",
    //     description: `Coming soon`,
    //     //description: `These are unique NFT Heroes that you will control in the Girand metaverse. Choose a race and class, upgrade your abilities and immerse yourself in a new reality. You have to go through difficult and dangerous trials, explore new territories, reveal ancient secrets, master the power of Energy Rings, fight in guild tournaments, fight face to face with ancient evil and its minions. Now the fate of the Girand kingdom depends only on you... Will be available soon.`,
    //   })) // временно
    // } else {
    //   dispatch(actionsMain.showLoginModal(true))
    // }
    if (currentUser) {
      dispatch(actionsPersonal.setStatusSound('off'))
      dispatch(actionsPersonal.setStatusGate('closed'))
      await delay(1300)
      dispatch(actionsPersonal.setStatusGate('opened'))
      dispatch(actionsPersonal.setCurrentScreen('hero'))
    } else {
      dispatch(actionsMain.showLoginModal(true))
    }
  }

  async function goToSphereScreen() {
    if (currentUser) {
      dispatch(actionsPersonal.setShowRedirectModal(true)) // временно
      dispatch(actionsPersonal.setRedirectModalTitle({
        title: "ENERGY SPHERE",
        description: `Girand's energy spheres were once created by mighty mages. After the catastrophe, very few of them remained, and who knows what the Technomages of antiquity kept in them? When opened, there is a chance to receive NFTs, game resources and new cards. Open the sphere and gain the power of the ancient heroes Girand!`,
      })) // временно
    } else {
      dispatch(actionsMain.showLoginModal(true))
    }
    // временно
    // dispatch(actionsPersonal.setStatusSound('off'))
    // dispatch(actionsPersonal.setStatusGate('closed'))
    // await delay(1300)
    // dispatch(actionsPersonal.setStatusGate('opened'))
    // dispatch(actionsPersonal.setCurrentScreen('sphere'))
  }

  async function goToWhiteList() {
    //   if (currentUser) {
    //   dispatch(actionsPersonal.setStatusSound('off'))
    //   dispatch(actionsPersonal.setStatusGate('closed'))
    //   await delay(1300)
    //   dispatch(actionsPersonal.setStatusGate('opened'))
    //   dispatch(actionsPersonal.setCurrentScreen('white-list'))
    // } else {
    //   dispatch(actionsMain.showLoginModal(true))
    // }
    
    if (currentUser) {
      dispatch(actionsPersonal.setShowRedirectModal(true)) // временно
      dispatch(actionsPersonal.setRedirectModalTitle({
        title: "WHITELIST",
        description: `Coming soon`,
      })) // временно
    } else {
      dispatch(actionsMain.showLoginModal(true));
    }
  }

  async function goToGlcPresale() {
    // if (currentUser) {
    //   dispatch(actionsPersonal.setShowRedirectModal(true)) // временно
    //   dispatch(actionsPersonal.setRedirectModalTitle({
    //     title: "GLC PRESALE",
    //     description: `Coming soon`,
    //   })) // временно
    // } else {
    //   dispatch(actionsMain.showLoginModal(true))
    // }
    if (currentUser) {
      dispatch(actionsPersonal.setStatusSound('off'))
      dispatch(actionsPersonal.setStatusGate('closed'))
      await delay(1300)
      dispatch(actionsPersonal.setStatusGate('opened'))
      dispatch(actionsPersonal.setCurrentScreen('glc-presale'))
    } else {
      dispatch(actionsMain.showLoginModal(true))
    }
  }

  return (
    <div className="rightbot__wrapper corner">
      <picture className="corner__main">
        <img src="img/gold-corner.png" alt="" />
      </picture>
      <button className="corner__link" onClick={openWallet}>
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
      <ul className="corner__list">
        <li className="corner__item i1">
          <button className="corner__item-btn" onClick={goToHeroScreen}>
            <picture className="corner__layer1">
              <img src="img/wi-1.png" alt="" />
            </picture>
            <picture className="corner__layer2">
              <img src="img/wi1-3.png" alt="" />
            </picture>
            <picture className="corner__layer3">
              <img src="img/wi1-2.png" alt="" />
            </picture>
            <picture className="corner__layer4">
              <img src="img/wi1-3.png" alt="" />
            </picture>
            <picture className="corner__layer5">
              <img src="img/gold-corner-layer5.png" alt="" />
            </picture>
          </button>
          <span className="corner__item-text">MY NFT</span>
        </li>
        <li className="corner__item i2">
          <button className="corner__item-btn" onClick={goToWhiteList}>
            <picture className="corner__layer1">
              <img src="img/w3-1.png" alt="" />
            </picture>
            <picture className="corner__layer2">
              <img src="img/w3-3.png" alt="" />
            </picture>
            <picture className="corner__layer3">
              {/* <!-- <img src="img/w3-2.png" alt=""/> --> */}
              <img src="img/w3-2-2.png" alt="" />
            </picture>
            <picture className="corner__layer4">
              <img src="img/w3-3.png" alt="" />
            </picture>
            <picture className="corner__layer5">
              <img src="img/w3-4.png" alt="" />
            </picture>
          </button>
          <span className="corner__item-text">NFT WHITELIST</span>
        </li>
        <li className="corner__item i3">
          <button className="corner__item-btn" onClick={goToGlcPresale}>
            <picture className="corner__layer1">
              <img src="img/w2-1.png" alt="" />
            </picture>
            <picture className="corner__layer2">
              <img src="img/w2-3.png" alt="" />
            </picture>
            <picture className="corner__layer3">
              <img src="img/glc-coin.png" alt="" />
            </picture>
            <picture className="corner__layer4">
              <img src="img/w2-3.png" alt="" />
            </picture>
            <picture className="corner__layer5">
              <img src="img/w2-4.png" alt="" />
            </picture>
          </button>
          <span className="corner__item-text">GLC PRESALE</span>
        </li>
        {/*
          <li className="corner__item i3">
            <button className="corner__item-btn" id="js--chest-open" onClick={goToChestScreen}>
              <picture className="corner__layer1">
                <img src="img/w3-1.png" alt="" />
              </picture>
              <picture className="corner__layer2">
                <img src="img/w3-3.png" alt="" />
              </picture>
              <picture className="corner__layer3">
                <img src="img/w3-2.png" alt="" />
              </picture>
              <picture className="corner__layer4">
                <img src="img/w3-3.png" alt="" />
              </picture>
              <picture className="corner__layer5">
                <img src="img/w3-4.png" alt="" />
              </picture>
            </button>
            <span className="corner__item-text">TREASURE CHEST</span>
          </li> 
        */}
      </ul>
    </div>
  )
}

export default RightBottomCorner