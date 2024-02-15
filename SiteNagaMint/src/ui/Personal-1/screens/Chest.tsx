import React from 'react'
import { actions as actionsWallet } from '../../../logic/Wallet'
import { actions as actionsPersonal } from '../../../logic/Personal'
import { useAppDispatch, useAppSelector } from '../../../redux-store'
import { delay } from '../../../App'

const ChestScreen = () => {
  const state = useAppSelector(state => state['personal'])
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(state => state.user).currentUser;

  function openWallet() {
    if (currentUser) {
      dispatch(actionsWallet.getDepositAdressesByUserId(currentUser.id));
      dispatch(actionsWallet.getTransactionsByUserId(currentUser.id ));
      dispatch(actionsWallet.getUserBalance());
      dispatch(actionsWallet.setStatusWalet('opened'))
    }
  }

  function setActiveTabSpheres() {
    dispatch(actionsPersonal.setActiveChestTab('spheres'))
  }

  function setActiveTabRings() {
    dispatch(actionsPersonal.setActiveChestTab('rings'))
  }

  async function goToMainScreen() {
    dispatch(actionsPersonal.setStatusGate('closed'))
    await delay(1300)
    dispatch(actionsPersonal.setStatusGate('opened'))
    dispatch(actionsPersonal.setCurrentScreen('main'))
  }

  return (
    <section className={`chest${state.currentScreen === 'chest' ? ' active' : ''}`} id="js--chest-window">

      <h2 className="chest__title">TREASURE CHEST</h2>

      <div className="chest__corner corner" id="js--chest-corner">
        <picture className="corner__main">
          <img src="img/gold-corner.png" alt="" />
        </picture>
        <button className="corner__link" id="js--chest-window-close" onClick={goToMainScreen}>
          <span className="visually-hidden">return to Hreidmar</span>
          <picture className="corner__layer1">
            <img src="img/gold-corner-layer1.png" alt="" />
          </picture>
          <picture className="corner__layer2">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer3">
            <img src="img/gold-corner-layer3.png" alt="" />
          </picture>
          <picture className="corner__layer4">
            <img src="img/gold-corner-layer2.png" alt="" />
          </picture>
          <picture className="corner__layer5">
            <img src="img/gold-corner-layer5.png" alt="" />
          </picture>
        </button>
      </div>

      <ul className="chest__races races-bar" id="js--hero-races">
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/dark-elf.png" alt="" />
            </picture>
            <span>DARK ELF</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>GOLEM</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>DELPHI</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>HUMAN</span>
          </button>
        </li>
        <li className="races-bar__item">
          <button>
            <picture>
              <img src="img/lock.png" alt="" />
            </picture>
            <span>DWARF</span>
          </button>
        </li>
      </ul>

      <picture className="chest__bg-pic">
        <img src="img/chest-bg.png" alt="" />
      </picture>

      <div className="smoke">
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
        <picture><img src="img/smkt1.png" alt="" /></picture>
      </div>

      <div className="chest__bottom-corner corner" id="js--chest-bottom-corner">
        <picture className="corner__main">
          <img src="img/gold-corner.png" alt="" />
        </picture>
        <button className="corner__link js--open-wallet" onClick={openWallet}>
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
      </div>

      <div className="chest__main">
        {/* <!-- левая сторона блока (герой) --> */}
        <ul className="chest__main-list">
          <li className="chest__main-item active">
            <picture>
              <img src="img/hero.png" alt="" />
            </picture>
          </li>
          <li className="chest__main-item">
            <picture>
              <img src="img/hero-g.png" alt="" />
            </picture>
          </li>
        </ul>
        {/* <!-- середина блока (информация) --> */}
        <div className="chest__main-info">
          <div className="chest__main-info-top">
            <button className="chest__main-info-left">
              <span className="visually-hidden">switch slider to left</span>
            </button>
            <ul className="chest__main-info-list">
              <li className="chest__main-info-item active">DARK ELF WARRIOR</li>
              <li className="chest__main-info-item">DARK ELF RANGER</li>
            </ul>
            <button className="chest__main-info-right">
              <span className="visually-hidden">switch slider to right</span>
            </button>
          </div>
          <picture>
            <img src="img/chest-race.png" alt="" />
          </picture>
          <button className="chest__main-question question-btn" id="js--hero-question">
            <picture><img src="img/ql-1.png" alt="" /></picture>
            <picture><img src="img/ql-2.png" alt="" /></picture>
            <picture><img src="img/ql-3.png" alt="" /></picture>
            <picture><img src="img/ql-4.png" alt="" /></picture>
          </button>
          <table className="chest__main-info-table">
            <tbody>
              <tr>
                <td>ENDURANCE</td>
                <td>22</td>
              </tr>
              <tr>
                <td>INTELLIGENCE</td>
                <td>19</td>
              </tr>
              <tr>
                <td>LUCK</td>
                <td>17</td>
              </tr>
              <tr>
                <td>MASTERY</td>
                <td>14</td>
              </tr>
              <tr>
                <td>HEALTH</td>
                <td>16</td>
              </tr>
              <tr>
                <td>MIND</td>
                <td>12</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <!-- правая сторона блока (инвентарь) --> */}
        <div className="chest__main-inventory">
          <div className={`chest__main-tabs swtabs${state.activeChestTab === 'rings' ? ' to-right' : ''}`}>
            <button
              onClick={setActiveTabSpheres}
              className={`swtabs__tab${state.activeChestTab === 'spheres' ? ' active' : ''}`}
              id="js--chest-left-tab">
              spheres
            </button>
            <button
              onClick={setActiveTabRings}
              className={`swtabs__tab${state.activeChestTab === 'rings' ? ' active' : ''}`}
              id="js--chest-right-tab">
              rings
            </button>
          </div>
          <div
            className={`chest__main-inventory-wrapper${state.activeChestTab === 'spheres' ? ' active' : ''}`}
            id="js--chest-inv1"
          >
            <ul className="chest__main-inventory-list" id="js--sphere-inv">
              <li className="chest__main-inventory-item">
                <picture><img src="img/w2-2.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item">
                <picture><img src="img/igor.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
            </ul>
          </div>
          <div
            className={`chest__main-inventory-wrapper${state.activeChestTab === 'rings' ? ' active' : ''}`}
            id="js--chest-inv2"
          >
            <ul className="chest__main-inventory-list" id="js--rings-inv">
              <li className="chest__main-inventory-item">
                <picture><img src="img/ring5.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item">
                <picture><img src="img/ring1.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item">
                <picture><img src="img/ring2.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item">
                <picture><img src="img/ring3.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item">
                <picture><img src="img/ring4.png" alt="" /></picture>
              </li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
              <li className="chest__main-inventory-item"></li>
            </ul>
          </div>
        </div>
        {/* <!-- конец правой стороны блока (инвентарь) --> */}
      </div>
    </section>
  )
}

export default ChestScreen