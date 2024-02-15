import { actions } from "../../../logic/NagaMint";
import { useAppDispatch, useAppSelector } from "../../../redux-store";
import CloseButton from "../components/CloseButton";
import CommonButton from "../components/CommonButton";
import { loginGmail } from "../../../modules/Gmail/Gmail"
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';

function ConnectModal() {

  const dispatch = useAppDispatch();
  const handleCloseClick = () => dispatch(actions.showLoginModal(false));
  const { showLoginModal } = useAppSelector(state => state['naga-mint']);

  return (
    <div className={`ngmConnect ${showLoginModal ? 'active' : ''}`}>
      <div className="ngmConnect__window">
        <div className="ngmConnect__close">
          <CloseButton onClick={handleCloseClick} />
        </div>

        <div className="ngmConnect__content">
          <h2 className="ngmConnect__title">Connect to girand</h2>

          <div className="ngmConnect__btns">
            <CommonButton text="Login with Google" onClick={() => { loginGmail() }} />
            {/* <TLoginButton
                botName="GiAuth_bot"
                buttonSize={TLoginButtonSize.Large}
                lang="en"
                usePic={false}
                cornerRadius={20}
                requestAccess={'QwERTY'}
                additionalClassNames={'ngmConnect__content'}
                redirectUrl="http://localhost:5000/api/telegram/tgCallback"
              /> */}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConnectModal;