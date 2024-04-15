import { ReactElement } from "react";

type CommonButtonType = {
  text?: string,
  tg?: boolean,
  onClick: () => void,
  children?: ReactElement,
}

function CommonButton({text, tg, onClick, children}: CommonButtonType) {
  return (
    <button className={`ngmButton ${tg ? 'ngmButton--tg' : ''}`} onClick={() => onClick()}>
      {text}
      {children}
    </button>
  );
}

export default CommonButton;