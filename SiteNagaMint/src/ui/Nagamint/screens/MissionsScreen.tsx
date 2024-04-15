import CommonButton from "../components/CommonButton";
import { connectGoogle, loginGmail } from '../../../modules/Gmail/Gmail';
import { connectTg, checkSub } from '../../../modules/Telegram/Telegram';
import { connectWeb3 } from '../../../modules/Web3/Web3';
import { discordLogin, checkVerify } from '../../../modules/Discord/DiscordLogin';
import { youtubeSub, youtubeWatch, instaSub, genLink } from '../../../modules/Achivments/Achivments';
import { getXOauthUrl, checkX_like, checkX_retweet, checkX_sub } from "../../../modules/X/X";
import { useState, useEffect } from 'react';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';

function MissionsScreen() {

  useEffect(() => {

  })

  const [refLink, setRefLink] = useState<string>("YOUR LINK")

  return (
    <section className="ngmMissions">
      <h2 className="ngmMissions__title">
        complete the missions, <br />
        and mint unique game hero.
      </h2>

      <div className="ngmMissions__progress">
        <div className="ngmMissions__progressHeader">
          <span>HELLO, ALEX_MVP!</span>
          <span>TASK 0/13</span>
        </div>
        <div className="ngmMissions__progressBar">
          <div style={{ width: "0%" }}></div>
        </div>
      </div>

      <ul className="ngmMissions__list">
        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">SUBMIT your email</h3>
            <div className="ngmMissions__itemBtns">
              <CommonButton text="Google login" onClick={() => { connectGoogle() }} />
            </div>
          </div>
          <div className="ngmMissions__itemBgContainer">
            <img src="/img/funny_boys.png" alt="" className="ngmMissions__itemBg" />
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">Telegram</h3>
            <div className="ngmMissions__itemBtns">
              <TLoginButton
                botName="GiAuth_bot"
                buttonSize={TLoginButtonSize.Large}
                lang="en"
                usePic={false}
                cornerRadius={1}
                requestAccess={'QwERTY'}
                additionalClassNames={'w-64 h-12 flex items-center justify-center rounded-md text-lg font-semibold focus:outline-none'}
                redirectUrl="http://localhost:5000/api/telegram/tgAuthCallback"
              />
              <CommonButton text="Subscribe to telegram chanel" onClick={() => {
                const state = checkSub()
                console.log(state)
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemTg">
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
            </svg>
            <span>TELEGRAM</span>
          </div>
        </li>
        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">SUBMIT your polygon wallet</h3>
            <div className="ngmMissions__itemBtns">
              <CommonButton text="submit wallet" onClick={async () => {
                connectWeb3()
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemPolygon">
            <img src="/img/polygon.png" alt="" />
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">SUBMIT your X account</h3>
            <p className="ngmMissions__itemSubTitle">Visit our account on X and complete the tasks</p>
            <div className="ngmMissions__itemBtns">
              <CommonButton text="x login" onClick={() => { getXOauthUrl() }} />
              <CommonButton text="follow girand on x" onClick={() => {
                window.open("https://twitter.com/GirandOfficial")
                const state = checkX_sub()
                }} />
              <CommonButton text="like the post" onClick={() => {const state = checkX_like()}} />
              <CommonButton text="retweet the post" onClick={() => {const state = checkX_retweet() }} />
            </div>
          </div>
          <div className="ngmMissions__itemX">
            <img src="/img/jabba-bg.png" alt="" />
            <svg width="300" height="300.251" viewBox="0 0 300 300.251" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFF" d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
            </svg>
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">DISCORD</h3>
            <p className="ngmMissions__itemSubTitle">Join Girand: In The Lost City’s Discord with specified role: Verified</p>
            <div className="ngmMissions__itemBtns">
              <CommonButton text="discord login" onClick={() => { discordLogin() }} />
              <CommonButton text="join girand's server" onClick={() => {
                window.open("https://discord.com/sMzEkkcKTg")
                checkVerify()
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemDiscord">
            <img src="/img/discord.png" alt="" />
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">YOUTUBE</h3>
            <p className="ngmMissions__itemSubTitle">Go to our YouTube channel, subscribe to it and watch the video.</p>
            <div className="ngmMissions__itemBtns">

              <CommonButton text="Subscribe to the channel" onClick={() => {
                window.open("https://www.youtube.com/@GirandOfficial")
                youtubeSub()
              }} />
              <CommonButton text="watch the video" onClick={() => {
                window.open("https://www.youtube.com/watch?v=DmYjI6rCYqg")
                youtubeWatch()
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemYoutube">
            <svg width="105" height="77" viewBox="0 0 105 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M84 0H21C9.42203 0 0 9.42186 0 21V56C0 67.5778 9.42203 77 21 77H84C95.578 77 105 67.5778 105 56V21C105 9.42186 95.578 0 84 0ZM100.333 56C100.333 65.0067 93.0067 72.3332 84 72.3332H21C11.9933 72.3332 4.66667 65.0067 4.66667 56V21C4.66667 11.9933 11.9933 4.66667 21 4.66667H84C93.0067 4.66667 100.333 11.9933 100.333 21V56ZM37.3333 58.2421L71.5283 38.5022L37.3333 18.7576V58.2421ZM42 26.8404L62.195 38.5024L42 50.1596V26.8404Z" fill="white" />
            </svg>
            <span>YOUTUBE</span>
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">SUBSCRIBE TO OUR instagram</h3>
            <p className="ngmMissions__itemSubTitle">Go to our Instagram and subscribe to it.</p>
            <div className="ngmMissions__itemBtns">
              <CommonButton text="SUBSCRIBE TO OUR instagraml" onClick={() => {
                window.open("https://www.instagram.com/girand_official/")
                instaSub()
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemInsta">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 26">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <img src="/img/insta2.png" alt="" />
          </div>
        </li>

        <li className="ngmMissions__item">
          <div className="ngmMissions__itemControls">
            <h3 className="ngmMissions__itemTitle">INVITE REFERRALS</h3>
            <p className="ngmMissions__itemSubTitle">
              Copy generated link and share with your friends. <br />
              The task will be completed when a friend completes 5 tasks.
            </p>
            <div className="ngmMissions__itemBtns">
              <CommonButton text={refLink} onClick={() => { }} />
              <CommonButton text="GENERATE LINK" onClick={async () => {
                const link = await genLink()
                setRefLink(link)
              }} />
            </div>
          </div>
          <div className="ngmMissions__itemInvite">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M32 61C48.0163 61 61 48.0163 61 32C61 15.9837 48.0163 3 32 3C15.9837 3 3 15.9837 3 32C3 48.0163 15.9837 61 32 61ZM32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#B10A0A" />
              <path d="M13 31H51V33H13V31Z" fill="white" />
              <path d="M31 51V13H33V51H31Z" fill="white" />
            </svg>
            <span>INVITE FRIENDS</span>
            <span>Number of referrals: 3</span>
          </div>
        </li>

      </ul>
    </section>
  );
}

export default MissionsScreen;