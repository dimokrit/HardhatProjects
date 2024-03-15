import React from 'react'

const Ktu = () => {
  return (
    <section className="ktu">
      <div className="ktu__text-wrapper text-wrapper">
        <h3>BOSS</h3>
        <p>
          Join a Guild and get access to boss raids. <br />
          To win, think over the composition of your team and its equipment. In raids, guild members fight the Old Gods. This battle can only be won by working together. As a reward, players receive tokens, legendary equipment and artifacts.
        </p>
      </div>
      <div className="middle-video">
        <video muted autoPlay={true} playsInline loop={true}>
          <source src="img/middle1.webm" type="video/webm" />
          <source src="img/middle1.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}

export default Ktu