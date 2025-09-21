import mapster_logo from "./assets/mapster_logo.png";
import "./SplashScreen.css";

function SplashScreen() {
  return (
    <>
      <div className="splash-screen-wrapper">
        <img className="splash-screen-logo" src={mapster_logo} alt="Logo" />
      </div>
    </>
  );
}

export default SplashScreen;
