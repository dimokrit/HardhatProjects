import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux-store'

import { actions } from '../../../logic/WhiteList'
import { actions as walletActions } from '../../../logic/Wallet'
import { actions as pesrsonalActions } from '../../../logic/Personal'

import RightBottomCornerWallet from '../components/RightBottomCornerWallet'
import LeftTopCorner from '../components/LeftTopCorner'

import { delay } from '../../../App'


const WhiteListScreen = () => {
  const dispatch = useAppDispatch()
  const screenWidth = window.innerWidth;

  const whitelistState = useAppSelector(state => state['wait-list'])
  const walletState = useAppSelector(state => state['wallet'])

  const { currentScreen } = useAppSelector(state => state['personal'])
  const { currentUser } = useAppSelector(state => state['user'])

  const { currentWaitListItem, totalPrice, waitListItems } = whitelistState
  const { uploadDataStatus, activeWindow, previousWindow, FAQList } = whitelistState
  const { countGenesises, countSpheres, countOrdersWaitListItem, countNFTs } = whitelistState

  const { paymentDeposits, currentPaymentDeposit } = walletState

  const availableBalance = parseFloat(currentPaymentDeposit?.balance || '0').toFixed(4)
  const whiteListItemCurrency = currentWaitListItem?.currency.name || ''

  const refs = useRef(FAQList.map(() => React.createRef<HTMLLIElement>()));

  //! init
  useEffect(() => {
    if (currentUser) {
      dispatch(actions.getNFTItems())
      dispatch(actions.getAggregatedWhiteList())
      dispatch(actions.getWhiteListItems())
      dispatch(walletActions.getUserBalance())
    }
  }, [currentUser])

  async function goToMainScreen() {
    dispatch(pesrsonalActions.setStatusGate('closed'))
    await delay(1300)
    dispatch(pesrsonalActions.setStatusGate('opened'))
    dispatch(pesrsonalActions.setCurrentScreen('main'))
  }

  function openFaqWindow() {
    dispatch(actions.setActiveWindow('faq'))
    dispatch(actions.setPreviousWindow('invest'))
  }

  function closeFaqWindow() {
    dispatch(actions.setActiveWindow('invest'))
    dispatch(actions.setPreviousWindow('faq'))
  }

  function setActiveInvestWindow() {
    dispatch(actions.setWhiteListItemCount(0))
    dispatch(actions.setActiveWindow('invest'))
    dispatch(actions.setPreviousWindow(previousWindow))
  }

  function openFAQItem(id: number) {
    dispatch(actions.setActiveFAQItem(id))
  }

  function openChooseNetwork() {
    dispatch(walletActions.setStatusWalet('opened'))
    dispatch(walletActions.setCurrentWalletWindow('choose-network'))
  }

  function buyWhiteListItem() {
    if (currentWaitListItem && countOrdersWaitListItem) {
      dispatch(actions.buyWhiteListItem({ waitListId: currentWaitListItem.id, qty: countOrdersWaitListItem }))
    }
  }

  function decrementCount() {
    const _value = countOrdersWaitListItem == null || isNaN(countOrdersWaitListItem) ? 0 : countOrdersWaitListItem
    const value = _value === 0 ? _value : _value - 1
    dispatch(actions.setWhiteListItemCount(value))
  }

  function incrementCount() {
    const _value = countOrdersWaitListItem == null || isNaN(countOrdersWaitListItem) ? 0 : countOrdersWaitListItem
    const value = _value + 1
    dispatch(actions.setWhiteListItemCount(value))
  }

  function onChangeCount(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(actions.setWhiteListItemCount(parseInt(event.target.value)))
  }

  function setCurrentWhiteListItem(event: React.SyntheticEvent<HTMLSelectElement, Event>) {
    const currencyId = event.currentTarget.value;
    const whiteListItem = waitListItems.find(e => e.currency.id == currencyId)
    if (whiteListItem) dispatch(actions.setCurrentWaitListItem(whiteListItem))
  }

  //! calc total price when count is change
  useEffect(() => {
    if (currentWaitListItem && countOrdersWaitListItem != null && !isNaN(countOrdersWaitListItem)) {
      const totalPrice = (countOrdersWaitListItem * currentWaitListItem.price).toFixed(4)
      dispatch(actions.setTotalPrice(parseFloat(totalPrice)))
    }
  }, [countOrdersWaitListItem, currentWaitListItem])

  //! when order is done
  useEffect(() => {
    if (uploadDataStatus === 'success') {
      dispatch(actions.setUploadDataStatus('init'))
      dispatch(actions.setActiveWindow('congratulation'))
      dispatch(actions.getAggregatedWhiteList())
      dispatch(walletActions.getUserBalance())
    }
    if (uploadDataStatus === 'failed') {
      dispatch(actions.setUploadDataStatus('init'))
      dispatch(actions.setActiveWindow('error'))
      dispatch(walletActions.getUserBalance())
    }
  }, [uploadDataStatus, dispatch])

  //! change currency
  useEffect(() => {
    if (currentScreen === 'white-list') {
      const wateListItem = waitListItems.find(e => e.currency.name === currentWaitListItem?.currency.name)
      const paymentDeposit = paymentDeposits.find(e => e.currency.name === currentWaitListItem?.currency.name)

      if (wateListItem) dispatch(actions.setCurrentWaitListItem(wateListItem))

      if (paymentDeposit) {
        dispatch(walletActions.setCurrentPaymentDeposit(paymentDeposit))
      } else {
        dispatch(walletActions.setCurrentPaymentDeposit(undefined))
      }
    }

  }, [currentWaitListItem, currentPaymentDeposit, dispatch, currentScreen])

  return (
    <section className={`whitelist ${currentScreen === 'white-list' && 'active'}`} id="js--whitelist-window">

      {/* <!-- Верхний блок страницы с заголовком и расой --> */}
      <div className="whitelist__top">
        <h2 className="whitelist__title" id="js--whitelist-title">WhiteList</h2>
        <span className="whitelist__race">{currentWaitListItem?.name ?? "Dark Elf"}</span>
      </div>

      {/* <!-- Верхний блок страницы с кнопками и расой для мобильника--> */}
      {(whitelistState.activeWindow !== 'faq' && screenWidth <= 650) &&
        <div className="whitelist__top-mobile">
          <div className="whitelist__top-mobile-sale-wrapper">
            <button className="whitelist__top-mobile-sale-left"></button>
            <ul className="whitelist__top-mobile-sale-list">
              <li className="active">Presale 1</li>
              <li>Presale 2</li>
              <li>Presale 3</li>
              <li>Presale 3</li>
              <li>Public sale</li>
            </ul>
            <button className="whitelist__top-mobile-sale-right"></button>
          </div>
          <ul className="whitelist__top-mobile-race-list">
            <li className="active">
              <span>{currentWaitListItem?.name ?? "Error"}</span>
              <picture><img src="img/dark-elf.png" alt="" /></picture>
            </li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      }

      {/* <!-- Кнопка закрытия страницы в мобильной версии --> */}
      <button className="whitelist__close-page btn-close" onClick={goToMainScreen}>
        <picture>
          <img src="img/close-mod.png" alt="" />
        </picture>
        <span className="visually-hidden">close modal window</span>
      </button>

      {/* <!-- Дым --> */}
      <div className="smoke">
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
      </div>

      {/* <!-- Верхний левый уголок --> */}
      <LeftTopCorner />

      {/* <!-- кнопка Mute --> */}
      {/* <SoundButton isOnlyIcon={true} /> */}

      {/* <!-- мобильная кнопка открытия FAQ --> */}
      <button className="whitelist__question question-btn" id="js--whitelist-question-mobile" onClick={openFaqWindow}>
        <picture><img src="img/ql-1.png" alt="" /></picture>
        <picture><img src="img/ql-2.png" alt="" /></picture>
        <picture><img src="img/ql-3.png" alt="" /></picture>
        <picture><img src="img/ql-4.png" alt="" /></picture>
      </button>

      {/* <!-- Правый нижний уголок --> */}
      <RightBottomCornerWallet />

      {/* <!-- Основной блок по середине --> */}
      <div className="whitelist__main">
        {/* <!--Кнопки с левой стороны--> */}
        <ul className="whitelist__main-buttons-list">
          <li className="whitelist__main-buttons-item">
            <button onClick={setActiveInvestWindow}
              className={`whitelist__main-buttons-button presale1  ${activeWindow === 'invest' && 'active'}`}
            >
              <picture><img src="img/dark-elf.png" alt="" /></picture>
              <span>Presale 1</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <button className="whitelist__main-buttons-button">
              <picture><img src="img/lock-2.png" alt="" /></picture>
              <span>Presale 2</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <button className="whitelist__main-buttons-button">
              <picture><img src="img/lock-2.png" alt="" /></picture>
              <span>Presale 3</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <button className="whitelist__main-buttons-button">
              <picture><img src="img/lock-2.png" alt="" /></picture>
              <span>Public sale</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <button
              onClick={openFaqWindow}
              className={`whitelist__main-buttons-button faq ${activeWindow === 'faq' && 'active'}`}
            >
              <span>FAQ</span>
            </button>
          </li>
        </ul>

        {/* <!--Основной блок контента--> */}
        <div className="whitelist__main-content">
          {/* <!--Блок Invest 100 usdt--> */}
          <div className={`whitelist__main-content-invest ${activeWindow === 'invest' && 'active'}`}>
            <h2>INVEST 100 USDT FOR EACH NFT</h2>
            {
              !(countGenesises == null && countSpheres == null && countNFTs == null) &&
              <div className="whitelist__main-content-invest-balance">
                <h3>Locked balance:</h3>
                <p>
                  {countNFTs ? countNFTs + ' NFT' : ""}  {countGenesises ? ` ( ${countGenesises} GENESIS ) ` : ""} {countSpheres ? ` + ${countSpheres} ENERGY SPHERE` : ""}
                </p>
              </div>
            }
            <div className="whitelist__main-content-invest-counter">
              <button onClick={decrementCount}>-1</button>
              <input type="number" value={countOrdersWaitListItem != null ? countOrdersWaitListItem : 0} onChange={onChangeCount} />
              <button onClick={incrementCount}>+1</button>
            </div>
            <div className="whitelist__main-content-invest-total">
              <h3>TOTAL PRICE:</h3>
              <div className='select'>
                <p style={{ marginRight: "20rem" }}>{totalPrice}</p>
                <select onChange={setCurrentWhiteListItem} value={currentWaitListItem?.currency.id ?? ""}
                  style={{ fontSize: "20rem", position: 'absolute', right: 0, border: "0px", outline: "0px", color: 'white', backgroundColor: 'black' }}>
                  {
                    waitListItems.map((e, i) =>
                      <option key={i.toString()} value={e.currency.id} >
                        {e.currency.name}
                      </option>
                    )
                  }
                </select>
              </div>

              <div className="whitelist__main-content-invest-total-wrapper">
                <span>Available balance: {availableBalance} {whiteListItemCurrency}</span>
                <button onClick={openChooseNetwork}>Deposit</button>
              </div>
            </div>
            {/* <button onClick={buyWhiteListItem} */}
            <button
              className="whitelist__main-content-invest-add golden-wide-button golden-wide-button--wider disabled"
              disabled >
              ADD TO WHITELIST
            </button>
          </div>

          {/* <!--Блок congratulation--> */}
          <div className={`whitelist__main-content-congr ${activeWindow === 'congratulation' && 'active'}`}>
            <button className="whitelist__main-content-congr-close btn-close" onClick={setActiveInvestWindow}>
              <picture>
                <img src="img/close-mod.png" alt="" />
              </picture>
              <span className="visually-hidden">close congratulations</span>
            </button>
            <h2>CONGRATULATION!</h2>
            <p>You have become a member of the white list</p>
            <div className="whitelist__main-content-congr-code">
              <h3>YOUR CODE FOR LTL DISTRIBUTION</h3>
              <p>{whitelistState.referrerCode ?? "ERROR GET INVITE CODE, GET SUPPORT"}</p>
            </div>
            {/* <button className="whitelist__main-content-congr-whatis golden-wide-button">WHAT IS IT?</button> */}
          </div>
          {/* <!--Блок error--> */}
          <div className={`whitelist__main-content-congr ${activeWindow === 'error' && 'active'}`}>
            <button className="whitelist__main-content-congr-close btn-close" onClick={setActiveInvestWindow}>
              <picture>
                <img src="img/close-mod.png" alt="" />
              </picture>
              <span className="visually-hidden">close congratulations</span>
            </button>
            <h2>An error has occurred!</h2>
            <p style={{ marginTop: 40 }}>A purchase error occurred, refresh the page, check the debit in transactions, check the balance and try again. Otherwise, contact support.</p>
          </div>

          {/* <!--Блок FAQ--> */}
          <div className={`whitelist__main-content-faq ${activeWindow === 'faq' && 'active'}`}>
            <button className="whitelist__main-content-faq-close btn-close" onClick={closeFaqWindow}>
              <picture>
                <img src="img/close-mod.png" alt="" />
              </picture>
              <span className="visually-hidden">close faq</span>
            </button>
            <h2>FAQ</h2>
            <ul className="whitelist__main-content-faq-list">
              {
                FAQList.map((e, i) => {
                  return (
                    <li
                      ref={refs.current[i]}
                      key={i.toString()}
                      className={`whitelist__main-content-faq-item ${e.isActive && 'active'}`}
                      style={e.isActive ? { height: refs.current[i]?.current?.scrollHeight } : {}}
                    >
                      <button onClick={() => openFAQItem(e.id)}>{e.title}</button>
                      {
                        e.descriptions.map((description, i) => {
                          return (
                            <p key={i.toString()}>{description}</p>
                          )
                        })
                      }
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhiteListScreen