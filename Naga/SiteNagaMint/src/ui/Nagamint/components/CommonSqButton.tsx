type CommonSqButtonType = {
  text: string,
  bright?: boolean,
  onClick: () => void,
  w100?: boolean
}

function CommonSqButton({text, bright, onClick, w100}: CommonSqButtonType) {
  return (
    <button className={`ngmSqButton ${bright ? 'ngmSqButton--bright' : ''} ${w100 ? 'ngmSqButton--w100' : ''}`} onClick={() => onClick()}>
      {text}
    </button>
  );
}

export default CommonSqButton;