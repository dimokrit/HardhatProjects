import CommonSqButton from "../components/CommonSqButton";

function HeroScreen() {
  return (
    <section className="ngmHero">
      <div className="ngmHero__content">
        <img className="ngmHero__bgLogo" src="/img/ngm-kryaken.png" alt="" />
        <h1 className="ngmHero__title">
          UNIQUE GAME HERO <br />
          <span>NAGA WiWA</span> <br />
          FREE MINT
        </h1>
        
        <p className="ngmHero__underTitle">Complete all tasks and get the opportunity to get a free mint of a unique game hero.</p>

        <div className="ngmHero__btns">
          <CommonSqButton text="START THE MISSION" bright onClick={() => {}} />
          <CommonSqButton text="GO TO MINT" onClick={() => {}} />
        </div>
      </div>

      <div className="ngmHero__video">
        <img src="/img/naga.jpg" alt="" />
        <video src="/img/naga.mp4" muted autoPlay loop playsInline />
      </div>
    </section>
  );
}

export default HeroScreen;