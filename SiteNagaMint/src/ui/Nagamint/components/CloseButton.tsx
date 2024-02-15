import { ReactElement } from "react";

type CloseButtonType = {
  onClick: () => void,
}

function CloseButton({onClick}: CloseButtonType) {
  return (
    <button className={`ngmButtonClose`} onClick={() => onClick()}>
      <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.148067 1.31873L1.47065 -0.00385496L22.632 21.1575L21.3094 22.4801L0.148067 1.31873Z" fill="#D9D9D9"/>
      <path d="M1.47013 22.4799L0.147542 21.1573L21.3089 -0.00405659L22.6315 1.31853L1.47013 22.4799Z" fill="#D9D9D9"/>
    </svg>
    </button>
  );
}

export default CloseButton;