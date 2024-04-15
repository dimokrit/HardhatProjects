import React, { useEffect, useRef, useState } from 'react'
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // re

const Roadmap = () => {

  const carouselRef = useRef<Carousel>(null);
  const [currentPosition, setCurrentPosition] = useState(1)

  function moveTo(position: number) {
    setCurrentPosition(position)
    carouselRef.current?.moveTo(position);
  }

  useEffect(() => {
    if (carouselRef) {
      moveTo(1)
    }
  }, [carouselRef])

  return (
    <section className="roadmap">
      <picture className="team__pic">
        <img src="img/team-bg.png" alt="" />
      </picture>
      <h2 className="roadmap__title">
        Road map
        <span className="decor-title">road map</span>
      </h2>

      {/* ROADMAP для PC */}
      <div className="roadmap__wrapper roadmap__wrapper--pc">
        <ul className="roadmap__list">
          <li className="roadmap__item">
            <h3>2021</h3>
            <div>
              <h4>2021</h4>
            </div>
            <ul>
              <li>Formation of the project team</li>
              <li>Initial stage of idea incubation and project development</li>
              <li>Development of visualization of the game metaverse</li>
              <li>Creating the history of the kingdom and the plot of the game</li>
            </ul>
          </li>
          <li className="roadmap__item">
            <h3>2022</h3>
            <div>
              <h4>2022</h4>
            </div>
            <ul>
              <li>NFT development</li>
              <li>Development of a trailer for the metaverse</li>
              <li>Development of game mechanics</li>
              <li>Definition of a blockchain project</li>
              <li>Website and store</li>
              <li>Limited pre-sale of 3D NFT heroes </li>
              <li>Launch of social networks</li>
              <li>Community building</li>
              <li>Project promotion strategy</li>
              <li>Project economics and tokenomics</li>
              <li>Development of Metaverse locations</li>
              <li>Alpha version of the mini-game “Girand Portal”</li>
            </ul>
          </li>
          <li className="roadmap__item">
            <h3>2023</h3>
            <div>
              <h4>2023</h4>
            </div>
            <ul>
              <li>Game development</li>
              <li>Working on multiplayer</li>
              <li>Creation of unique game content</li>
              <li>Attracting investments</li>
              <li>Seed + Angel</li>
              <li>Creation and development of smart contracts</li>
              <li>Launch of PR campaign</li>
              <li>Game Alpha</li>
              <li>Closed access to the Alpha version</li>
              <li>Development and creation of Marketplace Girand</li>
              <li>Release of new 3D NFT heroes and sales</li>
              <li>Airdrop NFT</li>
              <li>Pre-sale 1</li>
            </ul>
          </li>
          <li className="roadmap__item">
            <h3>2024</h3>
            <div>
              <h4>2024</h4>
            </div>
            <ul>
              <li>Pre-sale 2</li>
              <li>Launchpad and GLC token listing</li>
              <li>Beta version of Marketplace Girand</li>
              <li>Data collection for the Alpha version of the game</li>
              <li>Correction of bugs in the Alpha version</li>
              <li>Beta version of the game </li>
              <li>Marketplace Girand release</li>
              <li>Advertising campaign</li>
              <li>Working on content and game events</li>
              <li>Game balance adjustments</li>
              <li>Working on new game modes</li>
              <li>Advertising campaign</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* ROADMAP для Mobile */}
      <div className="roadmap__buttons roadmap__buttons--mobile">
        <button onClick={() => moveTo(0)}
          className={`${currentPosition === 0 && 'active'} ${currentPosition === 3 && 'far'}`}>
          2021
        </button>
        <button onClick={() => moveTo(1)}
          className={`${currentPosition === 1 && 'active'}`}>
          2022
        </button>
        <button onClick={() => moveTo(2)}
          className={`${currentPosition === 2 && 'active'}`}>
          2023
        </button>
        <button onClick={() => moveTo(3)}
          className={`${currentPosition === 3 && 'active'} ${currentPosition === 0 && 'far'}`}>
          2024
        </button>
      </div>

      <div className="roadmap__wrapper roadmap__wrapper--mobile">
        <ul className="roadmap__list">
          <Carousel
            // centerMode={true}
            centerSlidePercentage={40}
            // autoPlay
            width="30%"
            infiniteLoop={true}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            interval={3000}
            showArrows={false}
            transitionTime={500}
            ref={carouselRef}
            preventMovementUntilSwipeScrollTolerance={true}
            swipeScrollTolerance={50}
            onChange={(index: number) => {
              setCurrentPosition(index)
            }}
          >
            {/* <!-- 2021 --> */}
              <li className="roadmap__item">
                <h3>2021</h3>
                <div>
                  <h4>2021</h4>
                </div>
                <ul>
                  <li>Idea</li>
                  <li>Game concept</li>
                  <li>Team building</li>
                  <li>Development of game documentation</li>
                  <li>Development of the metaverse setting</li>
                  <li>Prototyping</li>
                </ul>
              </li>
            {/* <!-- 2022 --> */}
              <li className="roadmap__item">
                <h3>2022</h3>
                <div>
                  <h4>2022</h4>
                </div>
                <ul>
                  <li>Creation of unique content</li>
                  <li>Confirmation of the hypothesis</li>
                  <li>Marketing development</li>
                  <li>Community formation</li>
                  <li>Sale of the first NFTs</li>
                  <li>Game development</li>
                  <li>NFT development</li>
                  <li>Website and store</li>
                  <li>Development and launch of Girand Portal</li>
                  <li>Project economics</li>
                  <li>Attracting investmen</li>
                </ul>
              </li>
            {/* <!-- 2023 --> */}
              <li className="roadmap__item">
                <h3>2023</h3>
                <div>
                  <h4>2023</h4>
                </div>
                <ul>
                  <li>Game development</li>
                  <li>Attracting investments</li>
                  <li>Gameplay demo release</li>
                  <li>Advertising campaign</li>
                  <li>Community building</li>
                  <li>Alpha version of the game</li>
                  <li>Development of the Metaverse</li>
                  <li>Creation of new races and NFT equipment.</li>
                  <li>Creating a new cinematic</li>
                  <li>Girand book release</li>
                </ul>
              </li>
            {/* <!-- 2024 --> */}
              <li className="roadmap__item">
                <h3>2024</h3>
                <div>
                  <h4>2024</h4>
                </div>
                <ul>
                  <li>Creation of new content</li>
                  <li>Alpha version of the Marketplace</li>
                  <li>Release of new 3D NFT heroes</li>
                  <li>Game Beta</li>
                </ul>
              </li>
          </Carousel>
        </ul>
      </div>
    </section>
  )
}

export default Roadmap