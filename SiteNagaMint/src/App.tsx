import React, { useEffect } from "react";
import { BrowserRouter, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { actions as mainActions } from "./logic/MainLanding";
import { actions as personalActions } from "./logic/Personal";
import { useAppDispatch } from "./redux-store";

import MainLanding from './ui/MainLanding/MainLanding';
import Nagamint from "./ui/Nagamint/Nagamint";
import Personal1 from "./ui/Personal-1/Personal-1";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('reset-password-reject')) {
      const error = location.pathname.split('/')[3]
      navigate('/personal');
      dispatch(mainActions.setInfoMessage(`Change password is failed. Please try again. Error: ${error}`))
      dispatch(mainActions.showInfoMessage(true))
    }
    if (location.pathname.includes('reset-password-success')) {
      navigate('/personal');
      dispatch(mainActions.setInfoMessage('New password has been send to your email'))
      dispatch(mainActions.showInfoMessage(true))
    }
  }, [])

  const routes = useRoutes(
    [
      { path: "/", element: <MainLanding /> },
      { path: "/personal", element: <Personal1 /> },
      { path: "/mint", element: <Nagamint /> },
    ]
  );
  return routes;
}

const AppWrapper = () => {
  return (
    <BrowserRouter >
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
