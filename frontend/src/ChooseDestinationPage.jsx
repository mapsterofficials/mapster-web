import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChooseDestinationPage.css";
import MapsterTopbar from "./MapsterTopbar";

const LOCATIONS = [
  "dummy location",
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

function ChooseDestinationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromLocation = location.state?.location || LOCATIONS[0];
  const [from] = useState(fromLocation);
  const [to, setTo] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const handleToChange = (e) => {
    const value = e.target.value;
    setTo(value);
    setError("");
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    const input = value.trim().toLowerCase();
    setSuggestions(LOCATIONS.filter((loc) => loc.toLowerCase().includes(input)));
  };

  const handleNext = () => {
    const fromValid = LOCATIONS.includes(from);
    const toValid = LOCATIONS.includes(to.trim());
    if (!fromValid && !toValid) {
      setError("Both 'From' and 'To' locations are invalid. Please select valid locations.");
      return;
    }
    if (!fromValid) {
      setError("'From' location is invalid. Please select a valid location.");
      return;
    }
    if (!toValid) {
      setError("'To' location is invalid. Please select a valid location.");
      return;
    }
    setError("");
    navigate("/navigation", { state: { from, to } });
  };

  return (
    <div className="choose-destination-container">
      <MapsterTopbar />
      <div className="choose-destination-form">
        <label className="choose-destination-label">From</label>
        <input className="choose-destination-input" type="text" value={from} readOnly />
        <label className="choose-destination-label">To</label>
        <div style={{ position: "relative" }}>
          <input className="choose-destination-input" type="text" value={to} onChange={handleToChange} autoComplete="off" />
          {suggestions.length > 0 && (
            <ul className="choose-destination-suggestion-list">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  className={`choose-destination-suggestion-item${i === 0 ? " first" : ""}`}
                  onClick={() => {
                    setTo(s);
                    setSuggestions([]);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <div className="choose-destination-error">{error}</div>}
      </div>
      <button className="choose-destination-next-btn" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default ChooseDestinationPage;
