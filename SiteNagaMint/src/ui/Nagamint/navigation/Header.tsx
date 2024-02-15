import { Link } from "react-router-dom";
import { actions } from "../../../logic/NagaMint";
import { useAppDispatch } from "../../../redux-store";
import { useState, useEffect } from 'react';

function Header() {

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user)
      setUser(localStorage.getItem("user"))
  })

  const dispatch = useAppDispatch();
  const handleSignInClick = () => dispatch(actions.showLoginModal(true));
  const [user, setUser] = useState<string | null>("SIGN IN")
  
  return (
    <header className="ngmHeader">
      <Link to={'/'} className="ngmHeader__link">
        <img src="/img/girand-logo-gold.png" alt="" />
      </Link>

      <ul className="ngmHeader__list">
        <li>
          <button>TOKEN SALE</button>
        </li>
        <li>
          <button>GAME PASS</button>
        </li>
        <li>
          <button className="ngmHeader__signIn" onClick={handleSignInClick}>{user}</button>
        </li>
      </ul>
    </header>
  );
}

export default Header;