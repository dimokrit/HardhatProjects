import React from 'react'

const SeaTopVideoImgBefore = () => {
  return (
    <picture className="before-video">
      <source media="(max-width: 600px)" srcSet="img/citytop-mobile.png" />
      <source type="image/webp" srcSet="img/citytop.webp" />
      <img className="before-video-img" src="img/citytop.png" alt="" />
    </picture>
  )
}

export default SeaTopVideoImgBefore