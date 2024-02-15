import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux-store';

import { actions as userActions } from '../../../logic/User';
import { actions, actions as mainActions } from '../../../logic/MainLanding';

import Spinner from '../../Personal-1/components/Spinner';
import { delay } from '../../../App';

const LoginModal = () => {
  const dispatch = useAppDispatch();

  const mainState = useAppSelector(state => state['main-landing']);
  const userState = useAppSelector(state => state['user']);

  const [sendEmail, setSendEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  function closeLoginModal() {
    dispatch(mainActions.showLoginModal(false))
    dispatch(userActions.setCreateUserStatus('initial'))
    dispatch(userActions.setActiveLoginTab('singIn'))
  }

  function setActiveSingInTab() {
    dispatch(userActions.setCreateUserStatus('initial'))
    dispatch(userActions.setActiveLoginTab('singIn'))
  }

  function setActiveSignUpTab() {
    setSendEmail('')
    dispatch(userActions.setCreateUserStatus('initial'))
    dispatch(userActions.setActiveLoginTab('singUp'))
  }

  function setActiveForgotPassTab() {
    dispatch(userActions.setCreateUserStatus('initial'))
    dispatch(userActions.setResetPasswordStatus('initial'))
    dispatch(userActions.setActiveLoginTab('forgotPass'))
  }

  function sentPasswordToEmail() {
    dispatch(userActions.createUser({ email: sendEmail.replace(/\s/g, '').toLowerCase() }))
  }

  function signIn(event: React.SyntheticEvent) {
    event.preventDefault();
    dispatch(userActions.loginUser({ email: loginEmail.replace(/\s/g, '').toLowerCase(), password: loginPassword }))
  }

  function resetPassword() {
    if (sendEmail) {
      dispatch(userActions.resetPassword({ email: sendEmail }))
    }
  }

  // CONTROL STATUS TASK
  useEffect(() => {
    if (userState.loginStatus === 'success') {
      dispatch(userActions.setLoginStatus('initial'))
      dispatch(actions.showLoginModal(false))
    }
  }, [dispatch, userState.loginStatus])

  return (
    <div className={`m-connect ${mainState.showLoginModal && 'active'}`} id="js--mconnect">
      <div className='m-connect__body'>
        <button onClick={closeLoginModal}
          className="m-connect__close" id="js--mconnect-close">
          <span className="visually-hidden">close login modal window</span>
        </button>
        {/* <!-- гугл кнопка --> */}
        {/* <button className="m-connect__google" disabled>
                <picture>
                  <img src="img/google.png" alt="" />
                </picture>
                <span>CONNECT WITH GOOGLE</span>
              </button> */}
        {/* <!-- конец гугл кнопка --> */}

        {/* <!-- панелька перекл. вкладок --> */}
        {userState.activeLoginTab !== 'forgotPass' && (
          <div className={`m-connect__tabs ${userState.activeLoginTab === 'singUp' && 'to-right'}`}>
            <button onClick={setActiveSingInTab}>Login</button>
            <button onClick={setActiveSignUpTab}>Sign up</button>
          </div>
        )}
        {/* <!-- конец панельки перекл. вкладок --> */}

        {/* <!-- вкладка логин --> */}
        <form
          className={`m-connect__tab ${userState.activeLoginTab === 'singIn' && 'active'}`}
          id="js--mconnect-login-tab"
          onSubmit={signIn}
        >
          <p>e-mail</p>
          <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="sendEmail" />
          <p>password</p>
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} type="password" />
          {
            userState.loginStatus === 'failed' &&
            <p style={{ textAlign: 'center' }}>Something went wrong, check password or login</p>
          }
          {
            userState.loginStatus === 'loading' ? <Spinner /> : <button className='m-connect__tab-btn' style={{ marginTop: 0 }} type="submit">connect</button>
          }

        </form>
        {/* <!-- конец вкладки логин --> */}

        {/* <!-- вкладка sign up--> */}
        <div className={`m-connect__tab ${(userState.activeLoginTab === 'singUp' && (userState.passwordHasSend === false && userState.createUserStatus === 'initial')) && 'active'}`}>
          <p>e-mail</p>
          <input value={sendEmail} onChange={e => setSendEmail(e.target.value)} type="sendEmail" />

          <button className='m-connect__tab-btn' onClick={sentPasswordToEmail}>connect</button>
        </div>
        {/* <!-- конец вкладки sign up--> */}

        {/* <!-- вкладка пароль отправлен --> */}
        <div className={`m-connect__pass-sent ${userState.passwordHasSend === true && 'active'}`}>
          <p>PASSWORD HAS BEEN SENT TO YOUR E-MAIL</p>
          <button className='m-connect__tab-btn' onClick={setActiveSingInTab} >connect</button>
        </div>
        {/* <!-- конец вкладки пароль отправлен --> */}

        {/* <!-- вкладка такой пользователь существует --> */}
        <div className={`m-connect__pass-sent ${(userState.passwordHasSend === false && userState.createUserStatus === 'failed') && 'active'}`}>
          <p>Something went wrong, maybe the user already exists, or contact support</p>
          <button className='m-connect__tab-btn' onClick={setActiveSingInTab}>connect</button>
        </div>
        {/* <!-- конец вкладки такой пользователь существует --> */}

        {/* вкладка забыт пароль */}

        <div className={`m-connect__tab m-connect__tab--forgot ${(userState.activeLoginTab === 'forgotPass' && (userState.passwordHasSend === false && userState.createUserStatus === 'initial')) && 'active'}`}>
          <p>e-mail</p>
          <input value={sendEmail} onChange={e => setSendEmail(e.target.value)} type="sendEmail" />
          {
            userState.resetPasswordStatus === 'loading' ?
              <Spinner />
              :
              <>
                <button onClick={resetPassword} className='m-connect__tab-btn'>
                  restore
                </button>

                <p style={{ textAlign: 'center', marginTop: '20rem' }}>
                  {userState.resetPasswordStatus === 'success' && 'Reset token has been send to your email. Check your email'}
                  {userState.resetPasswordStatus === 'failed' && 'Something went wrong, check email'}
                </p>
              </>
          }
        </div>
        {userState.activeLoginTab === 'singIn' && (
          <button className='m-connect__forgot-btn' onClick={setActiveForgotPassTab}>
            I forgot my password
          </button>
        )}

      </div>
      {/* конец: вкладка забыт пароль */}
    </div >



  )
}

export default LoginModal