import React from 'react'
import { Outerlinks } from '../../../consts'
import { actions } from '../../../logic/Wallet'
import { useAppDispatch } from '../../../redux-store'

const SocialCommunity = () => {

  return (
    <div className="social__wrapper goldborder">
      <picture className="goldborder__border">
        <img src="img/p-social.png" alt="" />
      </picture>
      <span className="goldborder__vertText">C<br/>O<br/>M<br/>M<br/>U<br/>N<br/>I<br/>T<br/>Y</span>
        <ul className="goldborder__list">
          <li className="goldborder__item">
            <a href={Outerlinks.Instagram} target="_blank" rel='noreferrer' className="goldborder__link">
              <picture className="goldborder__picInst">
                <img src="img/p-social-instagram.png" alt="" />
              </picture>
              <span className="visually-hidden">instagram</span>
            </a>
          </li>
          <li className="goldborder__item">
            <a href={Outerlinks.TelegramEn} target="_blank" rel='noreferrer' className="goldborder__link">
              <picture className="goldborder__picTeleg">
                <img src="img/p-social-telegram.png" alt="" />
              </picture>
              <span className="visually-hidden">telegram</span>
            </a>
          </li>
          <li className="goldborder__item">
            <a href={Outerlinks.Twitter} target='_blank' rel='noreferrer' className="goldborder__link">
              <picture className="goldborder__picTwitt">
                <img src="img/p-social-twitter.png" alt="" />
              </picture>
              <span className="visually-hidden">twitter</span>
            </a>
          </li>
          <li className="goldborder__item">
            <a href={Outerlinks.Discord} target='_blank' rel='noreferrer' className="goldborder__link">
              <picture className="goldborder__picDiscord">
                <img src="img/p-social-discord.png" alt="" />
              </picture>
              <span className="visually-hidden">discord</span>
            </a>
          </li>
        </ul>
      </div>
        )
}

        export default SocialCommunity