import React, { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheckCircle, FaListAlt, FaHome } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Debug state data
  useEffect(() => {
    console.log('location.state:', location.state);
  }, [location.state]);
  console.log('location:', location);
  console.log('localStorage:', localStorage.getItem('bookingSuccessData'));
const state =JSON.parse(localStorage.getItem('bookingSuccessData')) ;

  const bookingId = state.bookingId || 'Unknown';
  const provider = state.provider || 'Unknown Provider';
  const providerLogo = state.providerLogo || '/assets/logos/super-gas-logo.png';
  const deliveryDate = state.deliveryDate || 'N/A';
  const deliveryTime = state.deliveryTime || 'N/A';
  const amount = state.amount !== undefined ? state.amount : 0;

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: 'transparent', padding: '20px' }}
    >
      <div className="row w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto pb-3 pt-4" style={{background: "#f8f9fa", borderRadius: "10px"}}>
          <div className="text-center mb-5">
            <FaCheckCircle
              size={80}
              className="text-success mb-3"
              style={{
                animation: 'scaleIn 0.5s ease-in-out',
              }}
            />
            <h1 className="text-primary fw-bold" style={{ fontSize: '2.5rem', color: '#4e54c8' }}>
              Booking Confirmed!
            </h1>
            <p className="text-muted fs-5">
              Your gas delivery is all set. We'll see you soon!
            </p>
          </div>

          <Card
            className="shadow-lg border-0"
            style={{
              borderRadius: '15px',
              borderLeft: '5px solid #4e54c8',
              overflow: 'hidden',
            }}
          >
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4 text-primary" style={{ color: '#4e54c8' }}>
                Booking Details
              </h4>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Booking ID</span>
                  <span className="fw-bold text-dark">{bookingId}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Provider</span>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={providerLogo}
                      alt={provider}
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = '/assets/logos/super-gas-logo.png'; // Fallback on error
                      }}
                    />
                    <span className="fw-bold text-dark fs-5">{provider}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Delivery Date</span>
                  <span className="fw-bold text-dark">{deliveryDate}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Delivery Time</span>
                  <span className="fw-bold text-dark">{deliveryTime}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Status</span>
                  <span className="badge bg-success fs-6 px-3 py-2 shadow-sm">Confirmed</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium">Amount Paid</span>
                  <span className="fw-bold text-dark fs-5">₹{amount}</span>
                </div>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-5">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2 fs-6"
                  style={{
                    borderColor: '#4e54c8',
                    color: '#4e54c8',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() =>
                    {
                                            localStorage.removeItem('bookingSuccessData');
console.log('Navigating to manage bookings');
                       navigate('/user/manage-bookings',{ replace: true })}}

                >
                  <FaListAlt className="me-2" />
                  View All Bookings
                </Button>
                <Button
                  variant="primary"
                  className="rounded-pill px-4 py-2 fs-6"
                  style={{
                    backgroundColor: '#4e54c8',
                    borderColor: '#4e54c8',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={
                    () =>
                    {
                      localStorage.removeItem('bookingSuccessData');
                    navigate('/user/dashboard',{ replace: true });
                    }
                  }
                >
                  <FaHome className="me-2" />
                  Back to Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .btn-outline-primary:hover {
            background-color: #4e54c8;
            color: white;
          }
          .btn-primary:hover {
            background-color: #3b46a8;
            border-color: #3b46a8;
          }
          @media (max-width: 576px) {
            .card-body {
              padding: 1.5rem;
            }
            h1 {
              font-size: 2rem;
            }
            .fs-5 {
              font-size: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentStatus;