import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux-store'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { actions } from '../../../logic/GlcPresale'
import { actions as walletActions } from '../../../logic/Wallet'
import { actions as pesrsonalActions } from '../../../logic/Personal'

import RightBottomCornerWallet from '../components/RightBottomCornerWallet'
import LeftTopCorner from '../components/LeftTopCorner'

import { delay } from '../../../App'
import { IndividualRequestToken } from '../../../logic/types/response/GetIndividualRequestTokens'
import { NonIndividualRequestToken } from '../../../logic/types/response/GetNonIndividualRequestTokens'
import { DtoIndividualRequestToken, DtoNonIndividualRequestTokens } from '../../../logic/types/request/RequestTypes'
import { BuyTokenList } from '../../../logic/types/response/ByTokenListItemResponse'

type RequestToken = IndividualRequestToken | NonIndividualRequestToken | undefined;

type SeedAngelTabActiveWindow =
  'become' |
  'start' |
  'individuals' |
  'non-individuals' |
  'wait' |
  'denied' |
  'approved' |
  'signing' |
  'signed' |
  'balance' |
  'congratulation' |
  'error';

const individualState: DtoIndividualRequestToken = {
  user: { connect: { id: '' } },
  surname: '',
  firstname: '',
  middlename: '-----',
  gender: '',
  civilStatus: '',
  dateOfBirth: '',
  age: '',
  placeOfBirth: '',
  presentAddress: '',
  state: '',
  country: '',
  zipCode: '-----',
  idNumber: '',
  validEmailAddress: '',
  mobileNumber: '',
  telegramAccount: '-----',
  planInvestUsdCount: 0,
  proofOfResidence: null,
}

const nonIndividualState: DtoNonIndividualRequestTokens = {
  user: { connect: { id: '' } },
  nameOfApplicant: '',
  dateOfIncorporation: '',
  placeOfIncorporation: '',
  dateOfCommencementOfbusiness: '',
  registrationNo: '',
  companyStatus: '',
  addressForCorrespondence: '',
  state: '',
  country: '',
  zipCode: '-----',
  officeNumber: '',
  mobileNumber: '',
  validEmailAddress: '',
  nameOfRepresentative: '',
  planInvestUsdCount: 0
}

let int: NodeJS.Timer;

const GlcPresaleScreen = () => {
  const dispatch = useAppDispatch();
  const screenWidth = window.innerWidth;

  const { currentScreen } = useAppSelector(state => state['personal'])
  const { currentUser } = useAppSelector(state => state['user'])
  const { currentPaymentDeposit, paymentDeposits } = useAppSelector(state => state['wallet'])

  const {
    activeTab,
    currentTokenItem,
    tokenItems,
    totalPrice,
    tokenRequest,
    userGlcTokenCount,
    availableAllocation,
  } = useAppSelector(state => state['glc-presale'])

  const availableBalance = parseFloat(currentPaymentDeposit?.balance || '0').toFixed(4)
  const currentTokenItemCurrency = currentTokenItem?.currency.name || ''

  const [buyTokenError, setBuyTokenError] = useState('')
  const [error, setError] = useState({ message: '', isVisible: false })

  const [activeWindow, setActiveWindow] = useState<SeedAngelTabActiveWindow>('become');
  const [individualData, setIndividualData] = useState(individualState);
  const [nonIndividualData, setNonIndividualData] = useState(nonIndividualState);

  const isHasError = (data: any): boolean => {
    let errors = [];

    for (let key in data) {
      if (!data[key]) {
        if (key !== 'telegramAccount' && key !== 'middlename' && key !== 'zipCode') errors.push(key.replace(/([A-Z])/g, ($1) => ` ${$1}`).replace(/(^[a-z])/g, ($1) => $1.toUpperCase()));
      }
    }

    if (parseFloat(data["planInvestUsdCount"]) < 50000) {
      showErrorMessage(`Minimum plan invest USDT is 50000 USDT`);
      return true
    }

    if (errors.length > 1) {
      showErrorMessage(`fields: ${errors.join(', ')} are required`);
      return true
    }

    if (errors.length === 1) {
      showErrorMessage(`field: ${errors[0]} is required`);
      return true
    }

    return false;
  }

  const showErrorMessage = (message: string) => { setError({ message, isVisible: true }) }
  const hideErrorMessage = () => { setError({ message: '', isVisible: false }) }

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    hideErrorMessage();
    const { name, value, type } = evt.target;

    let val: any = value;

    if (type === 'date') val = new Date(value).toISOString();
    if (type === 'number') val = parseInt(value);

    if (type === 'file') {
      const image = evt.target.files?.item(0);
      if (activeWindow === 'individuals') setIndividualData({ ...individualData, [name]: image });
      if (activeWindow === 'non-individuals') setNonIndividualData({ ...nonIndividualData, [name]: image });
    } else {
      if (activeWindow === 'individuals') setIndividualData({ ...individualData, [name]: val });
      if (activeWindow === 'non-individuals') setNonIndividualData({ ...nonIndividualData, [name]: val });
    }
  }

  const onSubmit = (data: any) => {
    if (isHasError(data) || !currentUser) return;

    const user = { connect: { id: currentUser!.id } }

    const { createIndividualRequestToken } = actions
    const { createNonIndividualRequestToken } = actions

    if (activeWindow === 'individuals') {
      dispatch(createIndividualRequestToken({ ...individualData, user }))
        .then(getTokenRequest)
        .then(() => {
          localStorage.setItem('individualsData', JSON.stringify({name: individualData.firstname, surname: individualData.surname, idNumber: individualData.idNumber, planInvestUsdCount: individualData.planInvestUsdCount}))
        })
    }
    if (activeWindow === 'non-individuals') {
      dispatch(createNonIndividualRequestToken({ ...nonIndividualData, user }))
        .then(getTokenRequest)
    }
  }

  const getTokenRequest = useCallback(() => {
    const userId = currentUser!.id;
    const expiredAt = new Date().toISOString();

    dispatch(actions.getTokenRequest({ userId, expiredAt })).then((res) => {
      const requestToken = res.payload as RequestToken;
      const status = requestToken?.status;

      if (!requestToken) {
        dispatch(actions.setActiveTab('seedAngel'))
        return;
      }

      if (status === 'pending') setActiveWindow('wait');
      if (status === 'approved') setActiveWindow('approved');
      if (status === 'signing') setActiveWindow('signing');
      if (status === 'signed') setActiveWindow('signed');
      if (status === 'rejected') setActiveWindow('denied');
      if (status === 'rejected') setActiveWindow('denied');
    })
  },
    [currentUser],
  )

  function closeResultWindow() {
    if (activeWindow !== 'error') {
      setActiveWindow('become')
    } else {
      setActiveWindow('balance')
    }
  }

  async function goToMainScreen() {
    dispatch(pesrsonalActions.setStatusGate('closed'))
    await delay(1300)
    dispatch(pesrsonalActions.setStatusGate('opened'))
    dispatch(pesrsonalActions.setCurrentScreen('main'))
  }

  function openChooseNetwork() {
    dispatch(walletActions.setStatusWalet('opened'))
    dispatch(walletActions.setCurrentWalletWindow('choose-network'))
  }

  function setCurrentTokenItem(event: React.SyntheticEvent<HTMLSelectElement, Event>) {
    const currencyId = event.currentTarget.value;
    const tokenItem = tokenItems.find(e => e.currency.id == currencyId)
    if (tokenItem) dispatch(actions.setCurrentTokenListItem(tokenItem))
  }

  function buyToken() {
    if (currentTokenItem && tokenRequest && availableAllocation) {
      const tokenWaitListId = currentTokenItem.id;
      const tokenRequestId = tokenRequest.id;
      const qty = parseInt(availableAllocation.toFixed(0));

      dispatch(actions.buyTokenListItem({ tokenWaitListId, tokenRequestId, qty }))
        .then(res => {
          const isSuccess = (res.payload as BuyTokenList).isSuccess
          const error = (res.payload as BuyTokenList).error

          if (isSuccess) {
            setActiveWindow('congratulation')
            dispatch(actions.getAggregatedTokenWaitList())
          } else {
            setBuyTokenError(error);
            setActiveWindow('error')
          }
        })
    }
  }

  // * INIT
  useEffect(() => {
    if (!currentUser) return;

    dispatch(walletActions.getUserBalance())
    dispatch(actions.getTokenListItems())
    dispatch(actions.getAggregatedTokenWaitList())

    getTokenRequest();
  }, [currentUser, getTokenRequest])


  // ! set init active window when change currentScreen
  useEffect(() => {
    if (activeWindow === 'start' || activeWindow === 'individuals' || activeWindow === 'non-individuals') {
      setActiveWindow('become')
    }
  }, [currentScreen])

  // !start fetch status token request
  useEffect(() => {
    if (!currentUser) return;

    if (activeWindow === 'wait' || activeWindow === 'denied') {
      int = setInterval(getTokenRequest, 10000);
    } else {
      clearInterval(int);
    }
    return () => clearInterval(int)
  }, [currentUser, activeWindow])

  //! calc total price when count is change
  useEffect(() => {
    if (currentTokenItem) {
      const totalPrice = (availableAllocation * currentTokenItem.price).toFixed(4)
      dispatch(actions.setTotalPrice(parseFloat(totalPrice)))
    }
  }, [availableAllocation, currentTokenItem])

  //! calc available allocation
  useEffect(() => {
    const planInvestUsdCount = tokenRequest?.planInvestUsdCount;
    const priceUsd = tokenItems?.find(e => e.currency.name === 'USDT-TRC20')?.priceUsd

    if (planInvestUsdCount && priceUsd) {
      dispatch(actions.setAvailableAllocation(planInvestUsdCount / priceUsd))
    }
  }, [tokenItems, tokenRequest])

  //! change currency
  useEffect(() => {
    if (currentScreen === 'glc-presale') {
      const tokenListItem = tokenItems.find(e => e.currency.name === currentTokenItem?.currency.name)
      const paymentDeposit = paymentDeposits.find(e => e.currency.name === currentTokenItem?.currency.name)

      if (tokenListItem) dispatch(actions.setCurrentTokenListItem(tokenListItem))

      if (paymentDeposit) {
        dispatch(walletActions.setCurrentPaymentDeposit(paymentDeposit))
      } else {
        dispatch(walletActions.setCurrentPaymentDeposit(undefined))
      }
    }
  }, [currentTokenItem, currentPaymentDeposit, dispatch, currentScreen])

  return (
    <section className={`whitelist ${currentScreen === 'glc-presale' && 'active'}`}>

      {/* <!-- Верхний блок страницы с заголовком и расой --> */}
      <div className="whitelist__top">
        <h2 className="whitelist__title" id="js--whitelist-title">GLC PRESALE</h2>
        <span className="whitelist__race">{"SEED ROUND"}</span>
      </div>

      {/* <!-- Верхний блок страницы с кнопками и расой для мобильника--> */}
      {(screenWidth <= 650) &&
        <div className="whitelist__top-mobile">
          <div className="whitelist__top-mobile-sale-wrapper">
            <button className="whitelist__top-mobile-sale-left"></button>
            <ul className="whitelist__top-mobile-sale-list">
              <li className="active">GLC PRESALE</li>
              <li>Presale 1</li>
              <li>Presale 2</li>
              <li>Launchpad</li>
            </ul>
            <button className="whitelist__top-mobile-sale-right"></button>
          </div>
          <ul className="whitelist__top-mobile-race-list">
            <li className="active">
              <span>{"SEED ROUND"}</span>
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

      {/* <!-- мобильная кнопка открытия Whitepaper --> */}
      <a 
        href='https://gitbook.inlostcity.com/'
        target='_blank'
        rel='noreferrer' 
        className="whitelist__question question-btn"
      >
        <picture><img src="img/ql-1.png" alt="" /></picture>
        <span className='question-btn-text'>WP</span>
        <picture><img src="img/ql-3.png" alt="" /></picture>
        <picture><img src="img/ql-4.png" alt="" /></picture>
      </a>

      {/* <!-- Правый нижний уголок --> */}
      <RightBottomCornerWallet />

      {/* <!-- Основной блок по середине --> */}
      <div className="whitelist__main">
        {/* <!--Кнопки с левой стороны--> */}
        <ul className="whitelist__main-buttons-list">
          <li className="whitelist__main-buttons-item">
            <button
              className={`whitelist__main-buttons-button presale1  ${activeTab === 'seedAngel' && 'active'}`}
            >
              <picture><img src="img/glc-coin.png" alt="" /></picture>
              <span>SEED + ANGEL</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <button className="whitelist__main-buttons-button">
              <picture><img src="img/lock-2.png" alt="" /></picture>
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
              <span>LAUNCHPAD</span>
            </button>
          </li>
          <li className="whitelist__main-buttons-item">
            <a
              href='https://gitbook.inlostcity.com/'
              target='_blank'
              rel='noreferrer'
              className={`whitelist__main-buttons-button faq`}
            >
              <span>Whitepaper</span>
            </a>
          </li>
        </ul>

        {/* <!--Основной блок контента--> */}
        <div className="whitelist__main-content whitelist__main-content--no-bg">

          {/* Блок Become investor */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'become' && 'active'}`}>
            <p>
              You can become an investor on the seed round at a price of 0.01 USDT.  Minimum 50 000 USDT. <br />
              KYC is required to apply.
            </p>
            <button
              className="whitelist__main-content-congr-whatis golden-wide-button"
              onClick={() => { setActiveWindow('start') }}
            >
              Complete KYC
            </button>
          </div>

          {/* Блок начала опроса */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'start' && 'active'}`}>
            <div className='whitelist__main-content-glc-radio-label-wrapper'>
              <h2 className='whitelist__main-content-glc-radio-title'>Representing</h2>
            </div>
            <button
              className="whitelist__main-content-glc-next golden-wide-button"
              onClick={() => { setActiveWindow('individuals') }}
            >
              For Individuals
            </button>
            {/* <button
              className="whitelist__main-content-glc-next golden-wide-button"
              onClick={() => { setActiveWindow('non-individuals') }}
            >
              For Non-Individuals
            </button> */}
          </div>

          {/* Блок For Individuals */}
          <div className={`whitelist__main-content-glc whitelist__main-content-glc--scroll ${activeWindow === 'individuals' && 'active'}`}>
            <h2 className='whitelist__main-content-glc-radio-title'>For Individuals</h2>

            <label>
              <p>Surname *</p>
              <input type="text" name='surname' onChange={onChange} value={individualData.surname} />
            </label>

            <label>
              <p>First name *</p>
              <input type="text" name='firstname' onChange={onChange} value={individualData.firstname} />
            </label>

            {/* <label>
              <p>Middle name</p>
              <input type="text" name='middlename' onChange={onChange} value={individualData.middlename} />
            </label> */}

            <div className='whitelist__main-content-glc-radio-label-wrapper quiz'>
              <h2 className='whitelist__main-content-glc-radio-title'>Gender *</h2>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='gender' value='male' onChange={onChange} checked={individualData.gender === 'male' ? true : false} />
                <span></span>
                Male
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='gender' value='female' onChange={onChange} checked={individualData.gender === 'female' ? true : false} />
                <span></span>
                Female
              </label>
            </div>

            <div className='whitelist__main-content-glc-radio-label-wrapper quiz'>
              <h2 className='whitelist__main-content-glc-radio-title'>Civil Status *</h2>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='civilStatus' value='single' onChange={onChange} checked={individualData.civilStatus === 'single' ? true : false} />
                <span></span>
                Single
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='civilStatus' value='married' onChange={onChange} checked={individualData.civilStatus === 'married' ? true : false} />
                <span></span>
                Married
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                Other:
                <input
                  type="text"
                  name='civilStatus'
                  onChange={onChange}
                  value={individualData.civilStatus !== 'single' && individualData.civilStatus !== 'married' ? individualData.civilStatus : ''}
                />
              </label>
            </div>

            <label>
              <p>Date of Birth *</p>
              <input type="date" name='dateOfBirth' onChange={onChange} value={moment(new Date(individualData.dateOfBirth)).format("YYYY-MM-DD")} />
            </label>

            <label>
              <p>Age *</p>
              <input type="text" name='age' onChange={onChange} value={individualData.age} />
            </label>

            <label>
              <p>Place of Birth *</p>
              <input type="text" name='placeOfBirth' onChange={onChange} value={individualData.placeOfBirth} />
            </label>

            <label>
              <p>
                Present Address * <br />
                Street, Village, Town, City
              </p>
              <input type="text" name='presentAddress' onChange={onChange} value={individualData.presentAddress} />
            </label>

            <label>
              <p>State *</p>
              <input type="text" name='state' onChange={onChange} value={individualData.state} />
            </label>

            <label>
              <p>Country *</p>
              <input type="text" name='country' onChange={onChange} value={individualData.country} />
            </label>

            {/* <label>
              <p>Zip code</p>
              <input type="text" name='zipCode' onChange={onChange} value={individualData.zipCode} />
            </label> */}

            <label>
              <p>
                Identity document *<br />
                (Passport)
              </p>
              <input type="file" itemType='image/*' name='proofOfResidence' onChange={onChange} />
            </label>

            <label>
              <p>Passport ID *</p>
              <input type="text" name='idNumber' onChange={onChange} value={individualData.idNumber} />
            </label>

            <label>
              <p>Valid Email Address *</p>
              <input type="email" name='validEmailAddress' onChange={onChange} value={individualData.validEmailAddress} />
            </label>

            <label>
              <p>Mobile Number ex. (+18657392843) *</p>
              <input type="text" name='mobileNumber' onChange={onChange} value={individualData.mobileNumber} />
            </label>

            <label>
              <p>Telegram Account (@daved_d)</p>
              <input type="text" name='telegramAccount' onChange={onChange} value={individualData.telegramAccount || '-----'} />
            </label>

            <label>
              <p>
                How much in USD do you plan to invest in Seed Round? <br />
                ( 1 GLC = 0.01 USD )* <br />
                50,000 USD Minimum <br />
                Format: 50000 (No comma or USD sign)
              </p>
              <input type="number" name='planInvestUsdCount' onChange={onChange} value={individualData.planInvestUsdCount} />
            </label>

            <button
              className="whitelist__main-content-glc-next golden-wide-button"
              onClick={() => { onSubmit(individualData) }}
            >
              SEND REQUEST
            </button>
          </div>

          {/* Блок For Non Individuals */}
          <div className={`whitelist__main-content-glc whitelist__main-content-glc--scroll ${activeWindow === 'non-individuals' && 'active'}`}>
            <h2 className='whitelist__main-content-glc-radio-title'>For Non-Individuals</h2>

            <label>
              <p>Name of the Applicant *</p>
              <input type="text" name='nameOfApplicant' onChange={onChange} value={nonIndividualData.nameOfApplicant} />
            </label>

            <label>
              <p>Date of incorporation *</p>
              <input type="date" name='dateOfIncorporation' onChange={onChange} value={moment(new Date(nonIndividualData.dateOfIncorporation)).format("YYYY-MM-DD")} />
            </label>

            <label>
              <p>Place of incorporation *</p>
              <input type="text" name='placeOfIncorporation' onChange={onChange} value={nonIndividualData.placeOfIncorporation} />
            </label>

            <label>
              <p>Date of commencement of business *</p>
              <input type="date" name='dateOfCommencementOfbusiness' onChange={onChange} value={moment(new Date(nonIndividualData.dateOfCommencementOfbusiness)).format("YYYY-MM-DD")} />
            </label>

            <label>
              <p>Registration No. (e.g. CIN) *</p>
              <input type="text" name='registrationNo' onChange={onChange} value={nonIndividualData.registrationNo} />
            </label>

            <div className='whitelist__main-content-glc-radio-label-wrapper quiz'>
              <h2 className='whitelist__main-content-glc-radio-title'>Status (please tick any one) *</h2>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Private Limited Co.' onChange={onChange} checked={nonIndividualData.companyStatus === 'Private Limited Co.' ? true : false} />
                <span></span>
                Private Limited Co.
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Public Ltd. Co.' onChange={onChange} checked={nonIndividualData.companyStatus === 'Public Ltd. Co.' ? true : false} />
                <span></span>
                Public Ltd. Co.
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Body Corporate' onChange={onChange} checked={nonIndividualData.companyStatus === 'Body Corporate' ? true : false} />
                <span></span>
                Body Corporate
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Partnership' onChange={onChange} checked={nonIndividualData.companyStatus === 'Partnership' ? true : false} />
                <span></span>
                Partnership
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Trust' onChange={onChange} checked={nonIndividualData.companyStatus === 'Trust' ? true : false} />
                <span></span>
                Trust
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Charities' onChange={onChange} checked={nonIndividualData.companyStatus === 'Charities' ? true : false} />
                <span></span>
                Charities
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='FI/FII/HUF/AOP/Bank/Government Body' onChange={onChange} checked={nonIndividualData.companyStatus === 'FI/FII/HUF/AOP/Bank/Government Body' ? true : false} />
                <span></span>
                FI/FII/HUF/AOP/Bank/Government Body
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Non-Government Organization' onChange={onChange} checked={nonIndividualData.companyStatus === 'Non-Government Organization' ? true : false} />
                <span></span>
                Non-Government Organization
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Defense Establishment' onChange={onChange} checked={nonIndividualData.companyStatus === 'Defense Establishment' ? true : false} />
                <span></span>
                Defense Establishment
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='BOI' onChange={onChange} checked={nonIndividualData.companyStatus === 'BOI' ? true : false} />
                <span></span>
                BOI
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Society' onChange={onChange} checked={nonIndividualData.companyStatus === 'Society' ? true : false} />
                <span></span>
                Society
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='LLP' onChange={onChange} checked={nonIndividualData.companyStatus === 'LLP' ? true : false} />
                <span></span>
                LLP
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <input className='visually-hidden' type="radio" name='companyStatus' value='Corporation' onChange={onChange} checked={nonIndividualData.companyStatus === 'Corporation' ? true : false} />
                <span></span>
                Corporation
              </label>
              <label className='whitelist__main-content-glc-radio-label'>
                <span></span>
                Other:
                <input
                  type="text"
                  name='companyStatus'
                  value={nonIndividualData.companyStatus !== 'Private Limited Co.' &&
                    nonIndividualData.companyStatus !== 'Public Ltd. Co.' &&
                    nonIndividualData.companyStatus !== 'Body Corporate' &&
                    nonIndividualData.companyStatus !== 'Partnership' &&
                    nonIndividualData.companyStatus !== 'Trust' &&
                    nonIndividualData.companyStatus !== 'Charities' &&
                    nonIndividualData.companyStatus !== 'FI/FII/HUF/AOP/Bank/Government Body' &&
                    nonIndividualData.companyStatus !== 'Non-Government Organization' &&
                    nonIndividualData.companyStatus !== 'Defense Establishment' &&
                    nonIndividualData.companyStatus !== 'BOI' &&
                    nonIndividualData.companyStatus !== 'Society' &&
                    nonIndividualData.companyStatus !== 'LLP' &&
                    nonIndividualData.companyStatus !== 'Corporation'
                    ? nonIndividualData.companyStatus : ''}
                  onChange={onChange}
                />
              </label>
            </div>

            <label>
              <p>
                Address for Correspondence *
                Street, Village, Town, City
              </p>
              <input type="text" name='addressForCorrespondence' onChange={onChange} value={nonIndividualData.addressForCorrespondence} />
            </label>

            {/* <label>
              <p>Zip code</p>
              <input type="text" name='zipCode' onChange={onChange} value={nonIndividualData.zipCode} />
            </label> */}

            <label>
              <p>State *</p>
              <input type="text" name='state' onChange={onChange} value={nonIndividualData.state} />
            </label>

            <label>
              <p>Country *</p>
              <input type="text" name='country' onChange={onChange} value={nonIndividualData.country} />
            </label>

            <label>
              <p>Tel. (Office)</p>
              <input type="text" name='officeNumber' onChange={onChange} value={nonIndividualData.officeNumber} />
            </label>

            <label>
              <p>Mobile Number ex. (+18657392843) *</p>
              <input type="text" name='mobileNumber' onChange={onChange} value={nonIndividualData.mobileNumber} />
            </label>

            <label>
              <p>Valid Email Address *</p>
              <input type="email" name='validEmailAddress' onChange={onChange} value={nonIndividualData.validEmailAddress} />
            </label>

            <label>
              <p>Name of Representative *</p>
              <input type="text" name='nameOfRepresentative' onChange={onChange} value={nonIndividualData.nameOfRepresentative} />
            </label>

            <label>
              <p>
                How much in USD do you plan to invest in Seed Round? <br />
                ( 1 GLC = 0.01 USD )* <br />
                50,000 USD Minimum <br />
                Format: 50000 (No comma or USD sign)
              </p>
              <input type="number" name='planInvestUsdCount' onChange={onChange} value={nonIndividualData.planInvestUsdCount} />
            </label>

            <button
              className="whitelist__main-content-glc-next golden-wide-button"
              onClick={() => { onSubmit(nonIndividualData) }}
            >
              SEND REQUEST
            </button>
          </div>

          {/* Блок Wait */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'wait' && 'active'}`}>
            <p>
              You have passed the KYC procedure, please wait for the decision
            </p>
          </div>

          {/* Блок Denied */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'denied' && 'active'}`}>
            <img src="img/cross.png" alt="" />
            <p>
              Your request has been denied. Reason: {tokenRequest?.cancelReason || 'for no reason'}. Try another round. If you do not agree, please email help@inlostcity.com
            </p>
          </div>

          {/* Блок Approved */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'approved' && 'active'}`}>
            <img src="img/ok-circle.png" alt="" />
            <p>
              Congratulations, your request has been approved.
            </p>
            <button
              className="whitelist__main-content-congr-whatis golden-wide-button"
              // onClick={() => { setActiveWindow('balance') }}
              onClick={() => dispatch(actions.updateIndividualRequestToken({stat: 'signing', id: currentUser!.id }))}

            >
              GREAT!
            </button>
          </div>

          {/* Блок Balance */}
          <div className={`whitelist__main-content-glc ${activeWindow === 'balance' && 'active'}`}>
            <div className='whitelist__main-content-glc-wrapper'>
              <div className='whitelist__main-content-glc-block'>
                <h2>Your locked balance:</h2>
                <p>{userGlcTokenCount} GLC</p>
              </div>
              <div className='whitelist__main-content-glc-block'>
                <h2>Available allocation:</h2>
                <p>{availableAllocation.toFixed(0)} GLC</p>
              </div>
              <br />
              <div className="whitelist__main-content-invest-total">
                <h3>TOTAL PRICE:</h3>
                <div className='select'>
                  <p style={{ marginRight: "20rem" }}>{totalPrice}</p>
                  <select onChange={setCurrentTokenItem} value={currentTokenItem?.currency.id ?? ""}
                    style={{ fontSize: "20rem", position: 'absolute', right: 0, border: "0px", outline: "0px", color: 'white', backgroundColor: 'black' }}>
                    {
                      tokenItems.map((e, i) =>
                        <option key={i.toString()} value={e.currency.id} >
                          {e.currency.name}
                        </option>
                      )
                    }
                  </select>
                </div>
                <div className="whitelist__main-content-invest-total-wrapper glc">
                  <span style={{ marginTop: '10rem' }}>Available balance: {availableBalance} {currentTokenItemCurrency}</span>
                  <button onClick={openChooseNetwork}>Deposit</button>
                </div>
              </div>
              <button className="whitelist__main-content-congr-whatis golden-wide-button" onClick={buyToken}>
                GET GLC
              </button>
              <p className='whitelist__main-content-glc-wrapper-p'>Offer valid until {moment(tokenRequest?.expiredAt).format('LL')}</p>
            </div>
          </div>

          {/* <!--Блок congratulation--> */}
          <div className={`whitelist__main-content-congr ${activeWindow === 'congratulation' && 'active'}`}>
            <button className="whitelist__main-content-congr-close btn-close" onClick={closeResultWindow}>
              <picture>
                <img src="img/close-mod.png" alt="" />
              </picture>
              <span className="visually-hidden">close congratulations</span>
            </button>
            <h2>CONGRATULATION!</h2>
            <p>Congratulations on your purchase of the GLC token</p>
            {/* <button className="whitelist__main-content-congr-whatis golden-wide-button">WHAT IS IT?</button> */}
          </div>

          {/* <!--Блок error--> */}
          <div className={`whitelist__main-content-congr ${activeWindow === 'error' && 'active'}`}>
            <button className="whitelist__main-content-congr-close btn-close" onClick={closeResultWindow}>
              <picture>
                <img src="img/close-mod.png" alt="" />
              </picture>
              <span className="visually-hidden">close congratulations</span>
            </button>
            <h2>An error has occurred!</h2>
            <p style={{ marginTop: 20, marginBottom: 20 }}>
              A purchase error occurred, refresh the page,
              check the debit in transactions, check the balance and try again. Otherwise, contact support.
            </p>
            <p >Error: {buyTokenError}</p>
          </div>
        </div>
      </div>

      {
        error.isVisible ? (
          <div className='whitelist__error-message'>
            <button onClick={hideErrorMessage}></button>
            <p>{error.message}</p>
          </div>
        ) : null
      }

    </section >
  )
}

export default GlcPresaleScreen