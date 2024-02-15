import React from 'react'

const Token = () => {
  return (
    <section className="token">
      <h2 className="token__title">
        Tokenomics
        <span className="decor-title">tokenomics</span>
      </h2>
      <ul className="token__grid">
        {/* <li className="token__card">
          <picture className="token__card-pic">
            <img src="img/tlt-coin.png" alt="" />
          </picture>
          <h3 className="token__card-title">
            $TLT
            <span>/</span>
            <span>Talent</span>
          </h3>
          <p className="token__card-under-title">
            Game Token
          </p>
          <div className="token__card-text-wrapper">
            <p className="token__card-total">
              total supply:
              <span>$tlt</span>
            </p>
            <p className="token__card-text-num">One trillion</p>
          <p className="token__card-num">1 000 000 000</p>
            <p className="token__card-dist">
              TOKEN DISTRIBUTION -
              <br />
              in development
            </p>
          </div>
        </li> */}

        <li className="token__card">
          <picture className="token__card-pic token__card-pic--2">
            <img src="img/glc-coin.png" alt="" />
          </picture>
          <div className='token__card-info'>
            <h3 className="token__card-title">
              GLC
              <span>/</span>
              <span>Girand</span>
            </h3>
            <p className="token__card-under-title">
              Governance Token
            </p>
            <p className="token__card-under-title">
              total supply: 1 000 000 000
            </p>
            <a href='https://gitbook.inlostcity.com/' target='_blank' rel='noreferrer' className="token__card-btn pixel-btn">
              WHITEPAPER
            </a>
            {/*<div className="token__card-text-wrapper">
              <p className="token__card-total">
                total supply:
                <span>glc</span>
              </p>
              <p className="token__card-text-num">One billion</p>
              <p className="token__card-num">1 000 000 000</p>
               <p className="token__card-dist">
                TOKEN DISTRIBUTION -
                <br />
                in development
              </p> 
            </div>*/}
          </div>
        </li>
      </ul>

      <div className="token__rounds">
        <h2 className='token__rounds-title'>Investment <span>rounds</span></h2>
        <div className='token__rounds-list-wrapper'>
          <ul className="token__rounds-list">
            <li className="token__rounds-item">
              <div className='token__rounds-item-info'>
                <h3>Seed + Angel</h3>
                <span>0.01</span>
                <p>The earliest round, at the lowest price. Upside similar projects 90 x.</p>
              </div>
              <p className="token__rounds-item-date">September - October 2023</p>
            </li>
  
            <li className="token__rounds-item">
              <div className='token__rounds-item-info'>
                <h3>Presale 1</h3>
                <span>0.03</span>
                <p>The next round of attracting investments. Upside similar projects 30 x.</p>
              </div>
              <p className="token__rounds-item-date">November - December 2023</p>
            </li>
  
            <li className="token__rounds-item">
              <div className='token__rounds-item-info'>
                <h3>Presale 2</h3>
                <span>0.05</span>
                <p>Last round before launchpad. Upside similar projects 18 x.</p>
              </div>
              <p className="token__rounds-item-date">January - February 2024</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Token