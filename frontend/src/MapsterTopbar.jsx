import gear_icon from "../assets/gear_icon.svg";
import chat_icon from "../assets/chat_icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "./MapsterTopbar.css";

export default function MapsterTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettings = location.pathname === "/settings";
  const isReport = location.pathname === "/reportissue";

  return (
    <div className="mapster-topbar">
      <div className="mapster-topbar-side">
        <button
          className="mapster-topbar-btn"
          onClick={() => navigate("/settings")}
          style={{ visibility: isSettings ? "hidden" : "visible" }}
          aria-label="Settings"
        >
          <img className="gear_icon" src={gear_icon} alt="Settings" />
        </button>
      </div>
      <span className="mapster-title">MAPSTER</span>
      <div className="mapster-topbar-side">
        <button
          className="mapster-topbar-btn"
          onClick={() => navigate("/reportissue")}
          style={{ visibility: isReport ? "hidden" : "visible" }}
          aria-label="Report Issue"
        >
          <img className="chat_icon" src={chat_icon} alt="Report Issue" />
        </button>
      </div>
    </div>
  );
}
