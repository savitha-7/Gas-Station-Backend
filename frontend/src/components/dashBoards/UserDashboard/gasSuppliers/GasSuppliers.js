import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSuppliers } from "../../../../redux/userSlice"; // Adjust the import path as necessary
import { FaStar, FaPhoneAlt, FaUser, FaMapMarkerAlt, FaGasPump, FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const GasSuppliers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suppliers = [], loading, error } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredProviders = suppliers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* Heading and Back Button Row for large devices */}
      <div className="row align-items-center mb-4 d-none d-lg-flex">
        <div className="col-12 col-lg-6">
          <h2 className="fw-bold text-center text-lg-start mb-3 mb-lg-0" style={{color: '#4e54c8'}}>Gas Suppliers</h2>
        </div>
        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
          <Button
            variant="primary"
            className="d-flex align-items-center"
            style={{ background: '#4e54c8', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 500 }}
            onClick={() => navigate('/user/dashboard')}
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
      {/* Heading for small devices */}
      <div className="row d-lg-none mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-center mb-3" style={{color: '#4e54c8'}}>Gas Suppliers</h2>
        </div>
      </div>
      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search gas providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn text-white" type="button" style={{background: '#4e54c8'}}>
          Search
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && <p className="text-center">Loading suppliers...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Providers Grid */}
      <div className="row g-4">
        {filteredProviders.map((provider) => (
          <div key={provider._id} className="col-12 col-sm-6 col-lg-4">
            <div className="card shadow-md border-0 h-100" style={{ borderRadius: "15px" }}>
              <div className="card-body">
                {/* Header Image */}
                <div className="text-center mb-3">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/api/seller/image/${provider._id}`}
                    alt={provider.name}
                    className="img-fluid"
                    style={{ maxHeight: "100px", objectFit: "contain" }}
                  />
                </div>

                {/* Provider Name and Rating (horizontal space between) */}
                <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                  <h5 className="fw-bold mb-0">{provider.name}</h5>
                  <span className="text-warning d-flex align-items-center" style={{ fontWeight: 600 }}>
                    <FaStar className="me-1" />
                    {provider.rating || "4.5"}
                  </span>
                </div>

                <hr />

                {/* Provider Info with background */}
                <div style={{ background: '#f3f5f7', borderRadius: '18px', padding: '18px 18px 10px 18px', margin: '0 0 18px 0' }}>
                  <p className="mb-1">
                    <FaUser className="me-2 text-secondary" />
                    <strong>Owner:</strong> {provider.owner}
                  </p>
                  <p className="mb-1">
                    <FaPhoneAlt className="me-2 text-secondary" />
                    <strong>Phone:</strong> {provider.phone}
                  </p>
                  <p className="mb-1">
                    <FaMapMarkerAlt className="me-2 text-secondary" />
                    <strong>Cities:</strong> {provider.location.map((loc) => loc.cityName).join(", ")}
                  </p>
                  <p className="mb-1">
                    <FaGasPump className="me-2 text-secondary" />
                    <strong>Quantity:</strong> {provider.quantity} units
                  </p>
                  <p className="mb-3">
                    <FaRupeeSign className="me-2 text-secondary" />
                    <strong>Price:</strong> ₹{provider.price}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-center">
                  <span
                    className={`badge ${provider.isBlocked ? "bg-secondary" : "bg-success"}`}
                    style={{ fontSize: "0.9rem", borderRadius: "15px", padding: "0.4rem 1rem" }}
                  >
                    {provider.quantity <= 0 ? "Unavailable" : "Available"}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <div className="card-footer bg-white border-0 pt-0 mb-2">
                <Button
                  className="w-100 m-0"
                  style={{ borderRadius: "20px", background: provider.isBlocked ? "#adb5bd" : "#4e54c8", color: "#fff", border: "none" }}
                  disabled={provider.isBlocked}
                  onClick={() => navigate(`/book/${provider._id}`)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Back to Dashboard Button for small devices */}
      <div className="d-md-none fixed-bottom py-2 d-flex justify-content-center" style={{backgroundColor: "transparent"}}>
        <Button
          variant="primary"
          className="d-flex align-items-center"
          style={{ background: '#4e54c8', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 500 }}
          onClick={() => navigate('/user/dashboard')}
        >
          <FaArrowLeft className="me-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default GasSuppliers;
