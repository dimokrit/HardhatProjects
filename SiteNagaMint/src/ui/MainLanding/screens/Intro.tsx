import React from 'react'

function Intro() {
  const ios = /(Mac|Macintosh)/g.test(navigator.userAgent);
  return (
    <section className="intro">
      <h1 className="intro__title">dive into<br /> a new reality</h1>
      <div className={`intro__decor-title-wrapper ${ios && 'intro__decor-title-wrapper--safari'}`}>
        <h2 className="intro__decor-title">dive into a new reality</h2>
        <h2 className="intro__decor-title">dive into a new reality</h2>
      </div>
      <picture className="intro__cloud2">
        <img src="img/cloud-2.png" alt="" />
      </picture>
      <picture className="intro__cloud3">
        <img src="img/cloud-3.png" alt="" />
      </picture>
      <picture className="intro__cloud4">
        <img src="img/cloud-4.png" alt="" />
      </picture>
    </section>
  )
}

export default Intro