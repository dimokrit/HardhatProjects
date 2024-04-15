import React, { useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react';
import { actions } from '../../../logic/Wallet'
import { actions as userActions } from '../../../logic/User'
import { actions as personalActions } from '../../../logic/Personal'
import { actions as mainActions } from '../../../logic/MainLanding'
import { actions as whiteListActions } from '../../../logic/WhiteList'
import { actions as glcPresaleActions } from '../../../logic/GlcPresale'

import { useAppDispatch, useAppSelector } from '../../../redux-store'
import { useNavigate } from 'react-router-dom';
import { delay } from '../../../App';

const ModalWallet = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const walletState = useAppSelector(state => state['wallet'])
  const presaleState = useAppSelector(state => state['glc-presale'])
  const userState = useAppSelector(state => state['user'])

  const { currentWalletWindow, transactions, spendingTransactions, previosWalletWindow } = walletState
  const { currentUser } = userState


  function setActiveTabSpending() {
    dispatch(actions.setActiveWaletTab('spending'))
  }

  function setActiveTabWallet() {
    dispatch(actions.setActiveWaletTab('wallet'))
  }

  function closeWallet() {
    dispatch(actions.setStatusWalet('closed'))
    if (currentUser) {
      dispatch(actions.setUserPromo(currentUser.inviterCode))
    } else dispatch(actions.setUserPromo(null))
  }

  function goTransferWindow() {
    dispatch(actions.setCurrentWalletWindow('transfer'))
  }

  function goChooseNetworkWindow() {
    if (currentUser) {
      dispatch(actions.getDepositAdressesByUserId(currentUser.id))
      dispatch(actions.setCurrentWalletWindow('choose-network'))
    }
  }

  function goSpendingWalletWindow() {
    dispatch(actions.setCurrentWalletWindow('spending-wallet'))
  }

  function goSelectTransferWindow() {
    dispatch(actions.setCurrentWalletWindow('select-transfer'))
  }

  function goQrCodeTonWindow() {
    dispatch(actions.setCurrentWalletWindow('qr-code-ton'))
  }

  function goQrCodeTronWindow() {
    dispatch(actions.setCurrentWalletWindow('qr-code-trc20'))
  }

  function goBack() {
    dispatch(actions.setCurrentWalletWindow(previosWalletWindow))
    if (currentUser) {
      dispatch(actions.setUserPromo(currentUser.inviterCode))
    } else dispatch(actions.setUserPromo(null))
  }

  function onChangePromo(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(actions.setUserPromo(event.currentTarget.value))
  }

  function exitFromAccount() {
    dispatch(userActions.logoutUser())
  }

  function saveUserPromo() {
    if (currentUser && walletState.userPromoCode) {
      const promo = walletState.userPromoCode;
      dispatch(userActions.updateUserPromo({ promo }))
    }
  }

  // component did mount
  useEffect(() => {
    if (currentUser) {
      dispatch(actions.getTransactionsByUserId(currentUser.id));
    }
  }, [dispatch, currentUser])

  useEffect(() => {
    if (currentUser) {
      dispatch(actions.getDepositAdressesByUserId(currentUser.id));
    }
  }, [dispatch, currentUser, walletState.statusWallet])

  useEffect(() => {
    if (userState.uploadDataStatus === 'success') {
      dispatch(userActions.getAuthenticatedUser());
      dispatch(actions.setUserPromo(null));
      delay(5000).then(_ => dispatch(userActions.setUploadDataStatus('initial')))
    } else {
      dispatch(actions.setUserPromo(null));
      delay(7000).then(_ => dispatch(userActions.setUploadDataStatus('initial')))
    }
  }, [userState.uploadDataStatus, dispatch])

  useEffect(() => {
    if (userState.logoutStatus === 'success') {
      dispatch(personalActions.clearState())
      dispatch(userActions.clearState())
      dispatch(whiteListActions.clearState())
      dispatch(glcPresaleActions.clearState())
      dispatch(mainActions.clearState())
      dispatch(actions.clearState())
      navigate('/')
    }
  }, [userState.logoutStatus, dispatch, navigate])

  return (
    <section className={`wallet${walletState.statusWallet === 'opened' ? ' active' : ''}`}>

      <button className="wallet__close js--wallet-close" onClick={closeWallet}>
        <picture>
          <img src="img/close-mod.png" alt="" />
        </picture>
        <span className="visually-hidden">close modal window</span>
      </button>

      { currentWalletWindow !== 'settings' && (
        <button className="wallet__back js--wallet-back" onClick={goBack} disabled={walletState.currentWalletWindow === 'spending-wallet' ? true : false}>
          <picture>
            <img src="img/w-down.png" alt="" />
          </picture>
          <span className="visually-hidden">go to previous block</span>
        </button>
      )}

      <div
        style={walletState.currentWalletWindow !== 'spending-wallet' ? { display: 'none' } : {}}
        className={`wallet__tabs swtabs${walletState.activeWalletTab === 'wallet' ? ' to-right' : ''}`}
      >
        <button
          className={`swtabs__tab js--modal-left-tab${walletState.activeWalletTab === 'spending' ? ' active' : ''}`}
          style={{ color: '#8a8a8a' }}
        // onClick={setActiveTabSpending}
        >
          Spending
        </button>
        <button
          className={`swtabs__tab js--modal-right-tab${walletState.activeWalletTab === 'wallet' ? ' active' : ''}`}
          onClick={setActiveTabWallet}>
          Wallet
        </button>
      </div>

      {/* <!-- вкладка spending --> */}
      <div
        style={walletState.currentWalletWindow !== 'spending-wallet' ? { display: 'none' } : {}}
        className={`wallet__left-wrapper js--left-wrapper${walletState.activeWalletTab === 'spending' ? ' active' : ''}`}
      >
        <ul className="wallet__tokens-list">
          <li className="wallet__tokens-item">
            <picture>
              <img src="img/glc-coin-sm.png" alt="" />
            </picture>
            <p>GLC</p>
            <span className="wallet__csoon">Coming soon</span>
          </li>

          {/* <li className="wallet__tokens-item">
            <picture>
              <img src="img/tlt-coin-sm.png" alt="" />
            </picture>
            <p>TLT</p>
            <span className="wallet__csoon">Coming soon</span>
          </li> */}

          {/* <li className="wallet__tokens-item">
            <picture>
              <img src="img/ton-icon.png" alt="" />
            </picture>
            <p>TON</p>
            <span>0</span>
          </li> */}

          <li className="wallet__tokens-item">
            <picture>
              <img src="img/trc.png" alt="" />
            </picture>
            <p>USDT</p>
            <span className="wallet__csoon">Coming soon</span>
          </li>
        </ul>

        <button onClick={goTransferWindow} className="wallet__transfer wide-goldborder-btn" id="js--wallet-transfer-btn">
          <span>Transfer</span>
        </button>
        <h2 className="wallet__history-title">History</h2>
        <div className="wallet__history-wrapper">
          <ul className="wallet__history-list">
            {
              spendingTransactions.length === 0 ?
                <li>Transactions is not exist</li>
                :
                spendingTransactions.map(
                  (trx, i) => (
                    <li key={i.toString()} style={{ display: "flex", }}>
                      <p style={{ flexBasis: '30%' }}>{`${trx.operation}`}</p>
                      <p style={{ flexBasis: '25%' }}>{`${trx.amount}`}</p>
                      <p style={{ flexBasis: '20%' }}>{`${trx.currency.name}`}</p>
                      <p style={{ flexBasis: '25%' }}>{`${trx.status}`}</p>
                    </li>
                  )
                )
            }
          </ul>
        </div>
      </div>
      {/* <!-- конец вкладки spending --> */}

      {/* <!-- вкладка wallet --> */}
      <div
        style={walletState.currentWalletWindow !== 'spending-wallet' ? { display: 'none' } : {}}
        className={`wallet__right-wrapper  js--right-wrapper${walletState.activeWalletTab === 'wallet' ? ' active' : ''}`}
      >
        <div className="wallet__r-btn-wrapper">
          <button className="wallet__r-btn js--deposit" onClick={goChooseNetworkWindow}>
            <picture className="wallet__picR1">
              <img src="img/w-down.png" alt="" />
            </picture>
            <span>Deposit</span>
          </button>
          <button className="wallet__r-btn" disabled>
            <picture className="wallet__picR2">
              <img src="img/w-double.png" alt="" />
            </picture>
            <span>Exchange</span>
          </button>
          <button className="wallet__r-btn" id="js--to-select-transfer" onClick={goSelectTransferWindow} disabled>
            <picture className="wallet__picR3">
              <img src="img/w-down.png" alt="" />
            </picture>
            <span>Transfer</span>
          </button>
        </div>
        <ul className="wallet__tokens-list">

          { //!FIXME DEPOSIT ADDRESSES
            walletState.paymentDeposits.map((e, i) => (
              <li className="wallet__tokens-item" key={i.toString()}>
                <picture>
                  {e.currency.name === 'USDT-TRC20' && <img src="img/usdt-icon.png" alt="" />}
                  {e.currency.name === 'TON' && <img src="img/ton-icon.png" alt="" />}
                </picture>
                <p>{e.currency.name}</p>
                <span>{parseFloat(e.balance).toFixed(3)}</span>
              </li>
            ))
          }
          {/* {!walletState.paymentDeposits.find(e => e.currency.name === 'USDT-TRC20') &&
            <li className="wallet__tokens-item">
              <picture>
                <img src="img/usdt-icon.png" alt="" />
              </picture>
              <p>USDT</p>
              <span>0.000</span>
            </li>
          } */}
          {/* {!walletState.paymentDeposits.find(e => e.currency.name === 'TON') &&
            <li className="wallet__tokens-item">
              <picture>
                <img src="img/ton-icon.png" alt="" />
              </picture>
              <p>TON</p>
              <span>0.000</span>
            </li>
          } */}
          {
            <li className="wallet__tokens-item">
              <picture>
                <img src="img/glc-coin-sm.png" alt="" />
              </picture>
              <p>GLC</p>
              <span>
                {parseFloat(presaleState.userGlcTokenCount.toString()).toFixed(3)}
              </span>
            </li>
          }
          {/* {!walletState.paymentDeposits.find(e => e.currency.name === 'TLT') &&
            <li className="wallet__tokens-item">
              <picture>
                <img src="img/tlt-coin.png" alt="" />
              </picture>
              <p>TLT</p>
              <span className="wallet__csoon">Coming soon</span>
            </li>
          } */}
        </ul>
        <h2 className="wallet__history-title">History</h2>
        <div className="wallet__history-wrapper">
          <ul className="wallet__history-list"  >
            {
              transactions.length === 0 ?
                <li>Transactions is not exist</li>
                :
                transactions.map(
                  (trx, i) => (
                    <li key={i.toString()} style={{ display: "flex", }}>
                      <p style={{ flexBasis: '30%' }}>{`${trx.operation}`}</p>
                      <p style={{ flexBasis: '25%' }}>{`${trx.amount}`}</p>
                      <p style={{ flexBasis: '20%' }}>{`${trx.currency.name}`}</p>
                      <p style={{ flexBasis: '25%' }}>{`${trx.status}`}</p>
                    </li>
                  )
                )
            }
          </ul>
        </div>
      </div>
      {/* <!-- конец вкладки wallet --> */}

      {/* <!-- вкладка network --> */}
      <div className={`wallet__net-wrapper js--netwrapper${walletState.currentWalletWindow === 'choose-network' ? ' active' : ''}`}>
        <h2 className="wallet__net-title"><span>Choose Network</span></h2>
        <p className="wallet__net-text">
          Make sure the network you select for input matches the network for output. Otherwise, the assets will be lost.
        </p>
        <div className="wallet__net-buttons">
          {/* <button className="max-btn-width-coin" id="js--choosenet-ton" onClick={goQrCodeTonWindow}>
            <picture>
              <img src="img/ton-icon.png" alt="" />
            </picture>
            <p className="sm">The Open Network - TON</p>
          </button> */}
          <button className="max-btn-width-coin" id="js--choosenet-trc20" onClick={goQrCodeTronWindow}>
            <picture>
              <img src="img/trc.png" alt="" />
            </picture>
            <p>TRON Network - USDT</p>
          </button>
        </div>
      </div>
      {/* <!-- конец вкладки network --> */}

      {/* <!-- вкладка QR code TON --> */}
      {/* <div
        className={`wallet__q-wrapper${walletState.currentWalletWindow === 'qr-code-ton' ? ' active' : ''}`}
        id="js--qwrapper-ton"
      >
        <button className="wallet__q-btn mid-goldborder-btn" onClick={goSpendingWalletWindow}>
          <span>Wallet</span>
        </button>
        <div className="wallet__q-code">
          <QRCodeSVG value={walletState.depositAddresses.find(e => e.currency.name === 'TON')?.address ?? ""}
            style={{ background: 'white', padding: '16px', width: '100%', height: '100%' }}
          />
        </div>
        <p className="wallet__after-code">Scan address to receive payment</p>
        <div className="wallet__adress-wrapper">
          <h2>TON address to receive payment</h2>
          <button
            onClick={() => { navigator.clipboard.writeText(walletState.depositAddresses.find(e => e.currency.name === 'TON')?.address ?? "") }}
            className="wallet__adress-copy-btn">
            Copy
          </button>
          <p className="wallet__adress">
            {walletState.depositAddresses.find(e => e.currency.name === 'TON')?.address ?? "" ?? ""}
          </p>
        </div>
        <h2>Network</h2>
        <p className="wallet__cript">
          The Open Network - TON
        </p>
        <div className="wallet__q-or">
          <span>OR</span>
        </div>
        <a href='https://neocrypto.net/' rel="noreferrer" target="_blank" >
          <button className="wallet__q-ccard">
            <span>Pay by credit card</span>
          </button>
        </a>
      </div> */}
      {/* <!-- конец вкладки QR code TON --> */}

      {/* <!-- вкладка QR code TRC20 --> */}
      <div
        className={`wallet__q-wrapper${walletState.currentWalletWindow === 'qr-code-trc20' ? ' active' : ''}`}
        id="js--qwrapper-trc20"
      >
        <button className="wallet__q-btn mid-goldborder-btn" onClick={goSpendingWalletWindow}>
          <span>Wallet</span>
        </button>
        <div className="wallet__q-code">
          <QRCodeSVG value={walletState.depositAddresses.find(e => e.currency.name === 'USDT-TRC20')?.address ?? ""}
            style={{ background: 'white', padding: '16px', width: '100%', height: '100%' }}
          />
        </div>
        <p className="wallet__after-code">Scan address to receive payment</p>
        <h2>USDT address to receive payment</h2>
        <p className="wallet__adress">
          {walletState.depositAddresses.find(e => e.currency.name === 'USDT-TRC20')?.address ?? ""}
        </p>
        <h2>Network</h2>
        <p className="wallet__cript">
          TRC20
        </p>
        <button
          onClick={() => { navigator.clipboard.writeText(walletState.depositAddresses.find(e => e.currency.name === 'USDT-TRC20')?.address ?? "") }}
          className="wallet__q-copy wide-goldborder-btn"
        >
          <span>Copy adress</span>
        </button>
      </div>

      {/* <!-- вкладка transfer --> */}
      <div
        className={`wallet__transf${walletState.currentWalletWindow === 'transfer' ? ' active' : ''}`}
        id="js--wallet-transfer-wrapper"
      >
        <h2 className="wallet__transf-title">TRANSFER</h2>

        <div className="wallet__transf-block">
          <div className="wallet__transf-first-str">
            <span>From</span>
            <p id="js-wallet-transfer-from">Spending</p>
          </div>
          <div className="wallet__transf-second-str">
            <span>To</span>
            <p id="js-wallet-transfer-to">Wallet</p>
          </div>
          <button className="wallet__transf-block-btn" >
            <span className="visually-hidden">change transfer direction</span>
          </button>
        </div>

        <h3 className="wallet__transf-list-title">Asset</h3>
        <ul className="wallet__tokens-list">
          <li className="wallet__tokens-item">
            <picture>
              <img src="img/ton-icon.png" alt="" />
            </picture>
            <p>TON</p>
            <span>{walletState.transactions.filter(e => e.operation === 'deposit')?.map(e => e.amount.toFixed(4))}</span>
          </li>
          <li className="wallet__tokens-item">
            <picture>
              <img src="img/trc.png" alt="" />
            </picture>
            <p>USDT</p>
            <span>100</span>
          </li>
        </ul>

        <div className="wallet__transf-amount">
          <h3>Amount</h3>
          <input type="number" />
          <button>All</button>
          <p>Available: 0 TON</p>
        </div>

        <button className="wallet__transfer wide-goldborder-btn">
          <span>Confirm transfer</span>
        </button>

      </div>
      {/* <!-- конец вкладки transfer --> */}

      {/* <!-- вкладка select-transfer --> */}
      <div className={`wallet__select-trans ${walletState.currentWalletWindow === 'select-transfer' && 'active'}`} id="js--wallet-select-transfer-wrapper">
        <h2>Select transfer</h2>
        <div className="wallet__select-trans-btns">
          <label>
            <input className="visually-hidden" type="radio" name="wallet__select-to" id="js--wallet-select-trans-to1" />
            <button>
              <span>To spending</span>
            </button>
          </label>
          <label>
            <input className="visually-hidden" type="radio" name="wallet__select-to" id="js--wallet-select-trans-to2" />
            <button>
              <span>To external</span>
            </button>
          </label>
        </div>
        <h2>Select cryptocurency</h2>
        <div className="wallet__select-trans-btns">
          <label>
            <input className="visually-hidden" type="radio" name="wallet__select-crypto" id="js--wallet-select-trans-crypto1" />
            <button>
              <picture>
                <img src="img/ton-icon.png" alt="" />
              </picture>
              TON
            </button>
          </label>
          <label>
            <input className="visually-hidden" type="radio" name="wallet__select-crypto" id="js--wallet-select-trans-crypto2" />
            <button>
              <picture>
                <img src="img/trc.png" alt="" />
              </picture>
              USDT
            </button>
          </label>
        </div>
        <button className="wallet__select-adress-btn wide-goldborder-btn" id="js--wallet-select-adress-btn">
          <span>Enter adress</span>
        </button>
      </div>
      {/* <!-- конец вкладки select-transfer --> */}

      {/* <!-- Вкладка select-adress --> */}
      <div className="wallet__e-adress" id="js--wallet-adress-wrapper">
        <h2>Adress</h2>
      </div>

      {/* <!-- Вкладка settings --> */}
      <div className={`wallet__settings ${walletState.currentWalletWindow === 'settings' && 'active'}`} id="js--wallet-settings">
        <h2>Settings</h2>

        <div className="wallet__settings-wrapper">
          <h3>Account</h3>
          <p>{userState.currentUser?.email}</p>
        </div>

        {/* <div className="wallet__settings-wrapper">
          <h3>Promo code</h3>
          <input value={walletState.userPromoCode ?? userState.currentUser?.inviterCode ?? ""} onChange={onChangePromo} />
          <button onClick={saveUserPromo}>
            <span className="visually-hidden">Apply code</span>
          </button>
          {userState.uploadDataStatus === 'success' && <h3 style={{ textAlign: 'center' }}>The promo code has been saved</h3>}
          {userState.uploadDataStatus === 'failed' && <h3 style={{ textAlign: 'center' }}>The promo code not saved,<br /> maybe promo not exist</h3>}
        </div> */}

        {/* <div className="wallet__settings-wrapper">
          <h3>Personal code</h3>
          <p>{userState.currentUser?.referrerCode}</p>
        </div> */}

        <button className="wallet__settings-exit  wide-goldborder-btn" onClick={exitFromAccount}>
          <span>EXIT ACCOUNT</span>
        </button>
      </div>

      {/* <!-- Вкладка support --> */}
      <div className={`wallet__support ${walletState.currentWalletWindow === 'support' && 'active'}`} id="js--wallet-support">
        <h2>support</h2>
        <div className="wallet__support-form">
          <h3>Your message</h3>
          <textarea name="" id="" cols={30} rows={10}></textarea>
          <button className="wallet__support-send wide-goldborder-btn" >SEND</button>
        </div>
      </div>

      {/* <!-- почта поддержки --> */}
      <p className="wallet__supp">
        <span>Support: </span>
        <a href="mailto:help@inlostcity.com">help@inlostcity.com</a>
      </p>

    </section >
  )
}

export default ModalWallet