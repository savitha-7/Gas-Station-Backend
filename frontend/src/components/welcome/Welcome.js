import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import letsGetStarted from "../../assets/lets-get-started.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-100 vh-100 d-flex flex-column flex-lg-row justify-content-evenly align-items-center p-3"
      style={{
        background: "linear-gradient(to right, #4e54c8, #8f94fb)", // Gradient background
      }}
    >
      {/* Left Side: Image */}
      <div className="h-50 h-lg-75 d-flex justify-content-center align-items-center">
        <img
          src={letsGetStarted} // Replace with your image path
          alt="Get Started"
          className="img-fluid"
          style={{ maxHeight: "100%", borderRadius: "15px" }}
        />
      </div>

      {/* Right Side: Welcome Text and Buttons */}
      <div className="text-white d-flex flex-column gap-5 align-items-center">
        <div className="text-center">
          <h1 className="display-4 fw-bold" style={{ color: "#ffffff" }}>
            Let's Get Started
          </h1>
          <p className="lead" style={{ color: "#e0e0e0" }}>
            Book your gas cylinder now.
          </p>
        </div>

        <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: "300px" }}>
          {/* User Button */}
          <button
            className="btn btn-primary fw-bold rounded-pill py-2"
            onClick={() => navigate("user/login")}
            style={{
              backgroundColor: "#4e54c8",
              border: "2px solid #4e54c8",
              color: "#fff",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#4e54c8";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#4e54c8";
              e.target.style.color = "#fff";
            }}
          >
            User
          </button>

          {/* Supplier Button */}
          <button
            className="btn btn-primary fw-bold rounded-pill py-2"
            onClick={() => navigate("supplier/login")}
            style={{
              backgroundColor: "#fff",
              border: "2px solid #4e54c8",
              color: "#4e54c8",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#4e54c8";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#4e54c8";
            }}
          >
            Supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;