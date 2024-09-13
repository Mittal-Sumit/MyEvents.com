import React from "react";
import "./ImageBetweenSections.css";

const ImageBetweenSections = () => {
  return (
    <div className="fullscreen-image-section">
      <div className="fullscreen-overlay">
        <img
          src="/Final.jpg"
          alt="Ending Section"
          className="fullscreen-image"
        />
        <div className="image-overlay-text"></div>
      </div>
    </div>
  );
};

export default ImageBetweenSections;
