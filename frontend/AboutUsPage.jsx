import mapster_logo_large from "./assets/mapster_logo_large.png";
import qr_icon from "./assets/qr_icon.svg";
import fast_icon from "./assets/fast_icon.svg";
import path_icon from "./assets/path_icon.svg";
import gps_icon from "./assets/gps_icon.svg";
import "./AboutUsPage.css";
import { useNavigate } from "react-router-dom";

function AboutUsPage() {
  const navigate = useNavigate();
  return (
    <div className="about-wrapper">
      <h2 className="about-title">About MAPSTER</h2>
      <img src={mapster_logo_large} alt="MAPSTER Logo" className="about-logo" />
      <p className="about-desc">
        MAPSTER is an innovative Indoor Navigation System designed to help users easily find their way inside large buildings such as malls,
        hospitals, offices, and universities. The app utilizes QR code-based localization along with an intelligent pathfinding algorithm to
        determine the shortest route between the user's current position and the selected destination. With a clean user interface and
        GPS-independent functionality, MAPSTER ensures a seamless and reliable navigation experience. It is built to assist visitors, staff,
        and students in navigating complex layouts with ease and confidence.
      </p>
      <div className="about-features">
        <div className="feature">
          <i>
            <img src={qr_icon}></img>
          </i>
          QR Code Localization
        </div>
        <div className="feature">
          <i>
            <img src={path_icon}></img>
          </i>
          Smart Pathfinding
        </div>
        <div className="feature">
          <i>
            <img src={gps_icon}></img>
          </i>
          GPS-Independent
        </div>
        <div className="feature">
          <i>
            <img src={fast_icon} className="feature_icon"></img>
          </i>
          Fast processing
        </div>
      </div>
      <div className="about-section">
        <h3 className="about-section-title">Patent Information</h3>
        <div className="about-section-content">
          Application Number: 202511002028 A<br />
          Publication Date: 24/01/2025
        </div>
      </div>
      <div className="about-section">
        <h3 className="about-section-title">Team</h3>
        <div className="about-team">
          <div className="about-team-row">
            <div>
              <span className="about-team-name">Rudraksh Singh Bhadauria</span>
              <br />
              <span className="about-team-role">Project Lead & Algorithm Designer</span>
            </div>
            <div>
              <span className="about-team-name">Palak Singh</span>
              <br />
              <span className="about-team-role">Project Manager</span>
            </div>
          </div>
          <div className="about-team-row">
            <div>
              <span className="about-team-name">Anshika Mathur</span>
              <br />
              <span className="about-team-role">UI/UX Designer & SIH 2025 Lead</span>
            </div>
            <div>
              <span className="about-team-name">Abhishek Deupa</span>
              <br />
              <span className="about-team-role">Full Stack & App Developer</span>
            </div>
          </div>
        </div>
      </div>
      <div className="about-section">
        <h3 className="about-section-title">Mentors</h3>
        <div className="about-team">
          <div className="about-team-row">
            <div>
              <span className="about-team-name">Sibaram Khara</span>
              <br />
              <span className="about-team-role">Vice Chancellor, Sharda University</span>
            </div>
            <div>
              <span className="about-team-name">Iqra Javid</span>
              <br />
              <span className="about-team-role">Assistant Professor, Sharda University</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
