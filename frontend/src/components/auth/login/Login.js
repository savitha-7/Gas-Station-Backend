import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { loginUser } from "../../../redux/authSlice";
import * as yup from "yup";
import { Formik } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai"; // Import React Icons
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginSupplier } from "../../../redux/authSlice"; // Import the login action for suppliers
import userLogin from "../../../assets/user-login.png";

// Validation schema with Yup
const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
const isSupplier = location.pathname.includes("supplier");
  const onSubmit = async (values) => {
  setIsSubmitting(true);
  setError("");

  try {
    let response;
console.log("Location pathname:", location.pathname); // Debugging line
    if (location.pathname.includes("supplier")) {
      console.log("Seller login attempt"); // Debugging line
      response = await dispatch(loginSupplier(values)).unwrap(); // Dispatch seller login
      toast.success("Seller login successful! Redirecting...");
      console.log("Seller login response:", response); // Debugging line
      setTimeout(() => {
        navigate("/supplier/dashboard");
      }, 2000);
    } else {
      console.log("User login attempt",values); // Debugging line
      response = await dispatch(loginUser(values)).unwrap(); // Default user login
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    }

    console.log("Login successful:", response);
  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(to right, #4e54c8, #8f94fb)", // Gradient background
      }}
    >
      <div className="row w-100">


        {/* Left Side: Large Image for Larger Devices */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
          <img
            src={userLogin} // Replace with your large image path
            alt="user login"
            className="img-fluid"
            style={{ maxWidth: "320px", borderRadius: "15px" }}
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg p-4"
            style={{
              maxWidth: "400px",
              width: "100%",
              background: "rgba(255, 255, 255, 0.95)", // Slightly transparent white background
              borderRadius: "15px", // Rounded corners
              backdropFilter: "blur(10px)", // Blur effect
              border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
            }}
          >
            <h2 className="text-center mb-4" style={{ color: "#4e54c8", fontWeight: "bold" }}>
              Login
            </h2>
            <p className="text-center mb-2" style={{ color: "#6c757d" }}>
              Enter your credentials to access your account
            </p>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
              onSubmit={onSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ color: "#4e54c8", fontWeight: "600" }}>
                      Email
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          backgroundColor: "#4e54c8",
                          color: "#fff",
                          border: "none",
                        }}
                      >
                        <AiOutlineMail />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        placeholder="Enter your email"
                        style={{
                          border: "1px solid #ddd",
                          borderLeft: "none",
                        }}
                      />
                      {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ color: "#4e54c8", fontWeight: "600" }}>
                      Password
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          backgroundColor: "#4e54c8",
                          color: "#fff",
                          border: "none",
                        }}
                      >
                        <AiOutlineLock />
                      </span>
                      <input
                        type="password"
                        id="password"
                        className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        placeholder="Enter your password"
                        style={{
                          border: "1px solid #ddd",
                          borderLeft: "none",
                        }}
                      />
                      {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 fw-bold rounded-pill mt-1"
                    disabled={isSubmitting}
                    style={{
                      padding: "10px 0",
                      backgroundColor: "#4e54c8",
                      color: "#fff",
                      border: "none",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#3a3f9f")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#4e54c8")}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              )}
            </Formik>
            
            <div className="d-flex align-items-center mt-3">
                      <div style={{ flex: 1, height: 1, background: '#e0e0e0' }}></div>
                      <span style={{ color: '#b0b3b8', fontWeight: 500, margin: '0 12px', whiteSpace: 'nowrap' }}>Or</span>
                      <div style={{ flex: 1, height: 1, background: '#e0e0e0' }}></div>
                    </div>
            {/* Conditionally render the "Don't have an account?" section */}
            { !location.pathname.includes("admin") && (
              <div className="text-center mt-2">
                <p className="mb-0" style={{ color: "#6c757d", fontSize: "14px" }}>
                  Don't have an account?{" "}
              <Link
                to={isSupplier ? "/supplier/register" : "/user/register"}
                style={{ color: "#4e54c8", fontWeight: "bold" }}
              >
                Register
              </Link>

                </p>
              </div>
            )}
            <div className="text-center mt-2">
                <p className="mb-0" style={{ color: "#6c757d", fontSize: "14px" }}>
                  Want to start over?{" "}
              <Link
                to="/"
                style={{ color: "#4e54c8", fontWeight: "bold" }}
              >
                Welcome page
              </Link>
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;