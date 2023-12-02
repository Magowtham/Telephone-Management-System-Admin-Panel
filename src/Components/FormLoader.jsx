import React from "react";
import "../CSS/FormLoader.css";

function FormLoader({ isFormLoading }) {
  return (
    <>
      <div className={`form-overlay ${isFormLoading ? `open` : ``}`}></div>
      <div className={`progress-bar ${isFormLoading ? `open` : ``}`}>
        <div className="progress-bar-value"></div>
      </div>
    </>
  );
}

export default FormLoader;