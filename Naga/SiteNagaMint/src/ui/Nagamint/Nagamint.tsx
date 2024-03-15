import './../../assets/styles/Nagamint.css'
import ConnectModal from './modals/ConnectModal';
import Header from "./navigation/Header";
import HeroScreen from "./screens/HeroScreen";
import MintScreen from './screens/MintScreen';
import MissionsScreen from './screens/MissionsScreen';

function Nagamint() {
  return (
    <div>
      <Header />
      <HeroScreen />
      <MissionsScreen />
      <MintScreen />

      <ConnectModal />
    </div>
  );
}

export default Nagamint;