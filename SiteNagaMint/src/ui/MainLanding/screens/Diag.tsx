import React from 'react'

const Diag = () => {
  return (
    <section className="diag">
      {/* <!-- <picture className="diag__bg">
      <img src="img/diag-bg.jpg" alt="" />
    </picture> --> */}
      <img src="img/diagr.svg" alt="" className="diag__diag" />
      <div className="diag__arrows arrows"><i></i></div>
      <div className="bubbles">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
  )
}

export default Diag