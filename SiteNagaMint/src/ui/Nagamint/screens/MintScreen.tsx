import CommonSqButton from "../components/CommonSqButton";
import { mint } from "../../../modules/Web3/Web3";

function MintScreen() {

  return (
    <section className="ngmMint">
      <img className="ngmMint__particles" src="/img/ngm-particles.gif" />
      <div className="ngmMint__content">
        <h2 className="ngmMint__title">
          UNIQUE GAME HERO – NAGA Euryale <br />
          STAGE 1 – WL FREE MINT
        </h2>

        <p className="ngmMint__timer">
          3d : 23h : 43m
        </p>
        <span className="ngmMint__underTimer">time before start</span>

        <div className="ngmMint__btn">
          <CommonSqButton text="Mint" w100 onClick={() => { mint() }} />
        </div>

        <p className="ngmMint__copyright">COPYRIGHT © 2024 L2L Games // girand: in the lost city</p>
      </div>
      <p className="ngmMint__copyrightMob">COPYRIGHT © 2024 L2L Games // girand: in the lost city</p>
    </section>
  );
}

export default MintScreen;