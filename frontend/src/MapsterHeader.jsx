import React from "react";
import { useNavigate } from "react-router-dom";
import "./MapsterHeader.css";

function MapsterHeader() {
  const navigate = useNavigate();
  return (
    <div className="mapster-header" onClick={() => navigate("/home")}>
      MAPSTER
    </div>
  );
}

export default MapsterHeader;
