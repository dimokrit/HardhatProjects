import React, { useEffect, useRef } from 'react'
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Team = () => {
  const carouselRef = useRef<Carousel>(null);

  function onClickPrevArrow() {
    carouselRef.current?.onClickPrev();
  }
  function onClickNextArrow() {
    carouselRef.current?.onClickNext();
  }


  return (
    <section className="team">
      <h2 className="team__title">
        Team project
        <span className="decor-title">team project</span>
      </h2>
      <div className="team__list-wrapper">
        <picture className="team__logo-team">
          <img src="img/team-logo.png" alt="" />
        </picture>
        <button className="team__prev" aria-label="prev slide" onClick={onClickPrevArrow}></button>
        <button className="team__next" aria-label="next slide" onClick={onClickNextArrow}></button>
        <div className="team__list">
          <Carousel
            centerSlidePercentage={40}
            autoPlay
            width="30%"
            infiniteLoop={true}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            interval={3000}
            showArrows={false}
            transitionTime={1000}
            ref={carouselRef}
            preventMovementUntilSwipeScrollTolerance={true}
          >
            <div className="team__list-slide">
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/14.png" alt="" />
                </picture>
                <span>CEO</span><p>Sergey Fominykh</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/18.png" alt="" />
                </picture>
                <span>CTO</span><p>Bogdan Rak</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/16.png" alt="" />
                </picture>
                <span>CFO</span><p>Nikolay Butaev</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/22.png" alt="" />
                </picture>
                <span>Head of Partnerships</span><p>Maksim Liderman</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/6.png" alt="" />
                </picture>
                <span>CMO</span><p>Alex Bitsoev</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/26.png" alt="" />
                </picture>
                <span>Tech Lead</span><p>Vitaliy Ignatov</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/8.png" alt="" />
                </picture>
                <span>Project manager</span><p>Anastasia Tkach</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/7.png" alt="" />
                </picture>
                <span>3D Character artist</span><p>Ivan Boni</p>
              </div>
            </div>
            <div className="team__list-slide">
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/9.png" alt="" />
                </picture>
                <span>Frontend developer</span><p>Dmitry Posadskikh</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/10.png" alt="" />
                </picture>
                <span>Game Designer</span><p>Alexey Medvedev</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/11.png" alt="" />
                </picture>
                <span>Chief 3D artist</span><p>Artem Kalinin</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/12.png" alt="" />
                </picture>
                <span>Music producer</span><p>DJ L.E.G.E.N.D</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/13.png" alt="" />
                </picture>
                <span>Tech/VFX artist</span><p>Sergey Maksimov</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/1.png" alt="" />
                </picture>
                <span>Chief 2D - animator</span><p>Konstantin Last.</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/15.png" alt="" />
                </picture>
                <span>3D Character artist</span><p>Roman Kukushkin</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/3.png" alt="" />
                </picture>
                <span>3D animator</span><p>Ivan Shaposhnik</p>
              </div>
            </div>
            <div className="team__list-slide">
              {/* <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/17.png" alt="" />
                </picture>
                <span>Film director</span><p>Alexandr Sarafanov</p>
              </div> */}
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/2.png" alt="" />
                </picture>
                <span>3D Character artist</span><p>Alexey Kozhemyakin</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/19.png" alt="" />
                </picture>
                <span>Producer/VFX artist</span><p>Valeriy Gorbunov</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/20.png" alt="" />
                </picture>
                <span>Chief 3D animator</span><p>Igor Rykov</p>
              </div>
              {/* <div className="team__item">
                <picture className="team__item-man" >
                  <img src="img/team/21.png" alt="" />
                </picture>
                <span>3D artist</span><p>Vlad Zlakotin</p>
              </div> */}
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/5.png" alt="" />
                </picture>
                <span>3D artist</span><p>Petr Vorobey</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/25.png" alt="" />
                </picture>
                <span>Animator</span><p>Vinitskiy Boris</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/4.png" alt="" />
                </picture>
                <span>Chief character artist</span><p>Boris Tuniev</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/23.png" alt="" />
                </picture>
                <span>Animator</span><p>Karpukhin Andrey</p>
              </div>
              <div className="team__item">
                <picture className="team__item-man">
                  <img src="img/team/24.png" alt="" />
                </picture>
                <span>Animator</span><p>Kirill Guzhvin</p>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
      <div className="team__and">
        <span>AND</span>
        <picture>
          <img src="img/and-logo.png" alt="" />
        </picture>
        <p>LTL DEVELOPMENT TEAM</p>
      </div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Team