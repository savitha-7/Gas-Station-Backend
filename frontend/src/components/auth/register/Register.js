import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerUser, registerSupplier } from "../../../redux/authSlice";
import * as yup from "yup";
import { Formik } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { toast } from "react-toastify";
import userRegister from "../../../assets/user-register.png";
import supplierRegister from "../../../assets/supplier-register.png";
import { PiCityBold } from "react-icons/pi";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSeller = location.pathname.includes("/supplier");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialValues = isSeller
    ? {
        name: "",
        owner: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        pincode: "",
        cityName: "",
      }
    : {
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      };

  const validationSchema = isSeller
    ? yup.object().shape({
        name: yup.string().required("Station name is required"),
        owner: yup.string().required("Owner name is required"),
        email: yup
          .string()
          .email("Invalid email")
          .required("Email is required"),
        phone: yup.string().required("Phone is required"),
        pincode: yup.string().required("Pincode is required"),
        cityName: yup.string().required("City name is required"),
        password: yup.string().min(6).required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match")
          .required("Confirm password is required"),
      })
    : yup.object().shape({
        username: yup.string().required("Username is required"),
        email: yup
          .string()
          .email("Enter a valid email")
          .required("Email is required"),
        phone: yup.string().required("Phone number is required"),
        password: yup.string().min(6).required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match")
          .required("Confirm password is required"),
      });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");
    try {
      const { confirmPassword, ...formData } = values;
      if (isSeller) {
        const sellerData = {
          ...formData,
          location: [
            {
              pincode: Number(formData.pincode),
              cityName: formData.cityName,
            },
          ],
        };
        console.log("supplier data:", sellerData); // Debugging line
        await dispatch(registerSupplier(sellerData)).unwrap();
        toast.success("supplier registered successfully!");
        setTimeout(() => navigate("/seller/login"), 2000);
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast.success("User registered successfully!");
        setTimeout(() => navigate("/user/login"), 2000);
      }
      
    } catch (err) {
      setError("Error during registration" + err.message);
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", err); // Debugging line
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(to right, #4e54c8, #8f94fb)" }}
    >
      <div className="row w-100">
        {/* Show user-register image only for /user/register */}
        {location.pathname === "/user/register" && (
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            <img
              src={userRegister}
              alt="User Register"
              className="img-fluid"
              style={{ maxWidth: "320px", borderRadius: "15px" }}
            />
          </div>
        )}
        {/* Show supplier image for /supplier/register if you want, or fallback */}
        {location.pathname === "/supplier/register" && (
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            <img
              src={supplierRegister}
              alt="Supplier Register"
              className="img-fluid"
              style={{ maxWidth: "320px", borderRadius: "15px" }}
            />
          </div>
        )}
        <div className="col-lg-6 d-flex justify-content-center align-items-center mt-2 mb-2 mt-lg-4 mb-lg-4">
          <div
            className="card shadow-lg p-4"
            style={{
              maxWidth: "400px",
              width: "100%",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "15px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <h2
              className="text-center mb-3"
              style={{ color: "#4e54c8", fontWeight: "bold" }}
            >
              {isSeller ? "Register" : "Register"}
            </h2>
            <p className="text-center mb-4" style={{ color: "#6c757d" }}>
              {isSeller
                ? "Create a supplier account"
                : "Enter your details to create an account"}
            </p>
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  {isSeller ? (
                    <>
                      {[
                        "name",
                        "owner",
                        "email",
                        "phone",
                        "pincode",
                        "cityName",
                        "password",
                        "confirmPassword",
                      ].map((field) => (
                        <div className="mb-3" key={field}>
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              style={{
                                backgroundColor: "#4e54c8",
                                color: "#fff",
                                border: "none",
                              }}
                            >
                              {field === "name" && <AiOutlineUser />}
                              {field === "owner" && <AiOutlineUser />}
                              {field === "email" && <AiOutlineMail />}
                              {field === "phone" && <AiOutlinePhone />}
                              {field === "pincode" && <AiOutlineEnvironment />}
                              {field === "cityName" && <PiCityBold />}
                              {field === "password" && <AiOutlineLock />}
                              {field === "confirmPassword" && <AiOutlineLock />}
                            </span>
                            <input
                              type={
                                field.includes("password") ? "password" : "text"
                              }
                              name={field}
                              placeholder={`Enter ${field}`
                                .replace("cityName", "City Name")
                                .replace("pincode", "Pincode")}
                              className={`form-control ${
                                touched[field] && errors[field]
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={values[field]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={isSubmitting}
                              style={{
                                border: "1px solid #ddd",
                                borderLeft: "none",
                              }}
                            />
                            {touched[field] && errors[field] && (
                              <div className="invalid-feedback">
                                {errors[field]}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        "username",
                        "email",
                        "phone",
                        "password",
                        "confirmPassword",
                      ].map((field) => (
                        <div className="mb-3" key={field}>
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              style={{
                                backgroundColor: "#4e54c8",
                                color: "#fff",
                                border: "none",
                              }}
                            >
                              {field === "username" && <AiOutlineUser />}
                              {field === "email" && <AiOutlineMail />}
                              {field === "phone" && <AiOutlinePhone />}
                              {field === "password" && <AiOutlineLock />}
                              {field === "confirmPassword" && <AiOutlineLock />}
                            </span>
                            <input
                              type={
                                field.includes("password") ? "password" : "text"
                              }
                              name={field}
                              placeholder={`Enter ${field}`.replace(
                                "confirmPassword",
                                "Confirm Password"
                              )}
                              className={`form-control ${
                                touched[field] && errors[field]
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={values[field]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={isSubmitting}
                              style={{
                                border: "1px solid #ddd",
                                borderLeft: "none",
                              }}
                            />
                            {touched[field] && errors[field] && (
                              <div className="invalid-feedback">
                                {errors[field]}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <button
                    type="submit"
                    className="btn w-100 fw-bold rounded-pill"
                    disabled={isSubmitting}
                    style={{
                      padding: "10px 0",
                      backgroundColor: "#4e54c8",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </form>
              )}
            </Formik>
            <div className="d-flex align-items-center mt-3">
              <div style={{ flex: 1, height: 1, background: "#e0e0e0" }}></div>
              <span
                style={{
                  color: "#b0b3b8",
                  fontWeight: 500,
                  margin: "0 12px",
                  whiteSpace: "nowrap",
                }}
              >
                Or
              </span>
              <div style={{ flex: 1, height: 1, background: "#e0e0e0" }}></div>
            </div>
            <div className="text-center mt-2">
              <p
                className="mb-0"
                style={{ color: "#6c757d", fontSize: "14px" }}
              >
                Already have an account?{" "}
                <Link to="/" style={{ color: "#4e54c8", fontWeight: "bold" }}>
                  Login
                </Link>
              </p>
            </div>
            <div className="text-center mt-2">
              <p
                className="mb-0"
                style={{ color: "#6c757d", fontSize: "14px" }}
              >
                Want to start over?{" "}
                <Link to="/" style={{ color: "#4e54c8", fontWeight: "bold" }}>
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

export default Register;
