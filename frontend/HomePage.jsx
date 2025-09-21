import React, { useRef, useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import gallery_icon from "./assets/gallery_icon.svg";
import flash_icon from "./assets/flash_icon.svg";
import camera_icon from "./assets/camera_icon.svg";
import gear_icon from "./assets/gear_icon.svg";
import chat_icon from "./assets/chat_icon.svg";

function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const qrRef = useRef();
  const [cameraError, setCameraError] = useState("");
  const [imageScanMessage, setImageScanMessage] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [locationCheckMessage, setLocationCheckMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const LOCATIONS = [
    "306 IPDC Lab",
    "307B Control/Comm Lab",
    "307A Classroom",
    "308A Classroom",
    "309A Classroom",
    "309B Analog Circuit Lab",
    "310 Classroom",
    "311 Faculty Room",
    "312A Classroom",
    "313A Classroom",
    "313B Classroom",
    "314A Food Science Lab",
    "315 Cyber Security Lab",
    "316 CAD Simulation Lab",
    "WR016 Male Washroom",
    "WR013 Female Washroom",
    "317 Faculty Room",
    "301 Dept of CS & App",
    "302 Board Room",
    "303 CS HOD Room",
    "304/305 Molecular Biology",
    "Library",
    "302D CSE Office",
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (locationInput.trim() === "") {
      setSuggestions([]);
      return;
    }
    const input = locationInput.trim().toLowerCase();
    setSuggestions(LOCATIONS.filter((loc) => loc.toLowerCase().includes(input)));
  }, [locationInput]);
  useEffect(() => {
    let html5QrCode;
    let isRunning = false;
    if (qrRef.current) {
      html5QrCode = new Html5Qrcode("qr-reader-homepage");
      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
          },
          (decodedText) => {
            if (LOCATIONS.includes(decodedText)) {
              setSelectedLocation(decodedText);
              navigate("/choosedestination", { state: { location: decodedText } });
            } else {
              setLocationCheckMessage("Location not found. Please enter a valid location or scan a valid QR code.");
            }
            if (isRunning) {
              html5QrCode.stop().catch(() => {});
              isRunning = false;
            }
          },
          (errorMessage) => {}
        )
        .then(() => {
          isRunning = true;
          setCameraError("");
        })
        .catch((err) => {
          setCameraError(
            "You’ve denied camera access. To scan QR codes, please go to your browser’s site settings and allow camera access."
          );
        });
    }
    return () => {
      if (html5QrCode && isRunning) {
        html5QrCode.stop().catch(() => {});
        isRunning = false;
      }
    };
  }, []);

  return (
    <div className="homepage-container">
      <div className="homepage-topbar">
        <button className="homepage-topbar-btn" onClick={() => navigate("/settings")}>
          <img className="gear_icon" src={gear_icon} alt="Settings" />
        </button>
        <span className="homepage-title">MAPSTER</span>
        <button className="homepage-topbar-btn" onClick={() => navigate("/reportissue")}>
          <img className="chat_icon" src={chat_icon} alt="Report Issue" />
        </button>
      </div>

      <div className="homepage-location-wrapper">
        <div className="homepage-location-input-row">
          <input
            type="text"
            placeholder="Current Location. Ex: 306 IPDC Lab"
            className="homepage-location-input"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
              setLocationCheckMessage("");
            }}
            autoComplete="off"
          />
          <button
            className="homepage-location-go-btn"
            onClick={() => {
              if (LOCATIONS.includes(locationInput.trim())) {
                setSelectedLocation(locationInput.trim());
                navigate("/choosedestination", { state: { location: locationInput.trim() } });
              } else {
                setLocationCheckMessage("Location not found. Please enter a valid location or scan a valid QR code.");
              }
            }}
          >
            Go
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="home-suggestion-list">
            {suggestions.map((s, i) => (
              <li
                key={s}
                className={`home-suggestion-item${i === 0 ? " first" : ""}`}
                onClick={() => {
                  setLocationInput(s);
                  setSuggestions([]);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="homepage-or">or</div>

      <div className="homepage-qr-square">
        <div id="qr-reader-homepage" ref={qrRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
      <div className="homepage-scan-label">Scan Here</div>
      {cameraError && <div className="homepage-camera-error">{cameraError}</div>}
      {imageScanMessage && <div className="homepage-camera-error">{imageScanMessage}</div>}
      {locationCheckMessage && <div className="homepage-camera-error">{locationCheckMessage}</div>}

      <div className="homepage-bottombar">
        <button className="homepage-bottombar-btn" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          <img className="gallery_icon" src={gallery_icon} alt="Gallery" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              setImageScanMessage("");
              setLocationCheckMessage("");
              const file = e.target.files[0];
              if (!file) return;
              try {
                const html5QrCode = new Html5Qrcode("qr-reader-homepage");
                const result = await html5QrCode.scanFile(file, true);
                if (result) {
                  if (LOCATIONS.includes(result)) {
                    setSelectedLocation(result);
                    navigate("/choosedestination", { state: { location: result } });
                  } else {
                    setLocationCheckMessage("Location not found. Please enter a valid location or scan a valid QR code.");
                  }
                } else {
                  setImageScanMessage("No QR code found in the uploaded image.");
                }
              } catch (err) {
                setImageScanMessage("No QR code found in the uploaded image.");
              }
            }}
          />
        </button>
        <button className="homepage-bottombar-btn camera">
          <img className="camera_icon" src={camera_icon} alt="Camera" />
        </button>
        <button className="homepage-bottombar-btn">
          <img className="flash_icon" src={flash_icon} alt="Flash" />
        </button>
      </div>
    </div>
  );
}

export default HomePage;
