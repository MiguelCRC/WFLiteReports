import React from "react";
import "../style/toggleStyle.css";
const Toggle = ({ toggle, handleToggleChange }) => {
  return (
    <div className="toggle-container" onClick={handleToggleChange}>
      <div className={`toggle-btn ${!toggle ? "disable" : ""}`}>
        {toggle ? "Inbound" : "Outbound"}
      </div>
    </div>
  );
};

export default Toggle;
