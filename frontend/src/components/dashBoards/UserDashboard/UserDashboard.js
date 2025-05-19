import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BiBox, BiCalendarCheck, BiCog, BiLogOut } from "react-icons/bi"; // Using react-icons for other icons
import { FaCheckCircle, FaCircle, FaTruck } from "react-icons/fa"; // Replaced BiTruck with FaTruck
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import  { useEffect, useState } from "react";

const DeliveryTimeline = () => {
  return (
    <Card
      className="shadow-lg border-0 mt-5"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <Card.Body>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <FaTruck size={32} className="me-2 text-primary" />
          <h4 className="text-primary fw-bold mb-0">Delivery Tracking</h4>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
          {/* Order Confirmed */}
          <div className="text-center mb-3 mb-md-0">
            <FaCheckCircle size={24} className="text-success mb-2" />
            <h6 className="fw-bold mb-1">Order Confirmed</h6>
            <p className="text-muted small mb-0">Tue, May 06</p>
          </div>

          {/* Line */}
          <div
            className="d-none d-md-block flex-grow-1 mx-2"
            style={{ height: "2px", backgroundColor: "#6c757d" }}
          ></div>

          {/* Delivery */}
          <div className="text-center">
            <FaCircle size={24} className="text-secondary mb-2" />
            <h6 className="fw-bold mb-1">Delivered</h6>
            <p className="text-muted small mb-0">Fri, May 09 by 11 PM</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const UserDashboard = () => {
  const [error, setError] = useState(null);
  
    const [userName, setUserName] = useState("");
  
  const user = useSelector((state) => state.auth.user); // Assuming user info is in auth slice
  const navigate = useNavigate();
useEffect(() => {
  const fetchUserData = async () => {
    const token = Cookies.get('authTokenUser');
    const userI= Cookies.get('authTokenUserId');

    if (!token) return navigate('/login');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/${userI}`, {
        // headers: { Authorization: `${token}` },
      });
      console.log("User data:", response.data);
      setUserName(response.data.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
    }
  };
  fetchUserData();
}, [navigate]);
  const handleBookGas = () => {
    navigate("/user/gas-suppliers"); // Replace with your actual route
  };
  const handleLogout = () => {
    // Dispatch logout action (replace with actual action)
    localStorage.removeItem("user");
    Cookies.remove("authTokenUser");

    Cookies.remove("authTokenUserId");
    toast.success("Logged Out");
    navigate("/");
  };
  const handleManageBookings = () => {
    navigate("/user/manage-bookings"); // Replace with your actual route
  };

  const handleAccountSettings = () => {
    navigate("/user/account-settings"); // Replace with your actual route
  };

  return (
    <Container className="mt-5" style={{ backgroundColor: 'transparent', minHeight: '100vh', position: 'relative' }}>
      <Navbar bg="white" expand="md" className="shadow-sm rounded mb-4 px-3" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <Navbar.Brand className="fw-bold" style={{ fontSize: '1.3rem', color: '#4e54c8'}}>
          User Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar-nav" />
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {/* Removed Account Settings from navbar */}
            <Nav.Link
              as="span"
              className="d-flex align-items-center text-danger p-0"
              style={{ margin: 0 }}
            >
              <Button
                variant="outline-danger"
                className="d-flex align-items-center px-3 py-1"
                style={{ fontWeight: 500, borderRadius: '20px' }}
                onClick={handleLogout}
              >
                <BiLogOut size={20} className="me-1" />
                Logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h2 className="mb-4 text-center fw-bold" style={{color: '#4e54c8'}}>
        Welcome, {userName || user?.name || "User"}!
      </h2>
      <p className="lead text-center" style={{color: '#fff'}}>
        Manage your gas delivery bookings with ease
      </p>
      <Row className="mt-4 g-4">
        <Col xs={12} md={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-3 text-primary">
                <BiBox size={32} className="me-2" style={{color: '#4e54c8'}}/>
                <Card.Title className="mb-0 fw-bold" style={{color: '#4e54c8'}}>
                  Book Gas Delivery
                </Card.Title>
              </div>
              <Card.Text className="text-center text-muted">
                Browse gas providers and book a delivery slot at your
                convenience.
              </Card.Text>
              <Button
                variant="primary"
                style={{background: '#4e54c8'}}
                className="rounded-pill px-4 py-2 mt-auto"
                onClick={handleBookGas}
              >
                View Providers
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="shadow-lg border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-3 text-success">
                <BiCalendarCheck size={32} className="me-2" />
                <Card.Title className="mb-0 fw-bold">
                  Manage Bookings
                </Card.Title>
              </div>
              <Card.Text className="text-center text-muted">
                View, modify or cancel your existing gas delivery bookings.
              </Card.Text>
              <Button
                variant="success"
                className="rounded-pill px-4 py-2 mt-auto"
                onClick={handleManageBookings}
              >
                My Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-4 mb-md-0">
          <Card className="shadow-lg border-0 h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-3 text-warning">
                <BiCog size={32} className="me-2" />
                <Card.Title className="mb-0 fw-bold">
                  Account Settings
                </Card.Title>
              </div>
              <Card.Text className="text-center text-muted">
                Update your profile details and preferences.
              </Card.Text>
              <Button
                variant="outline-warning"
                className="rounded-pill px-4 py-2 mt-auto"
                onClick={handleAccountSettings}
              >
                Settings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Delivery Timeline */}
    </Container>
  );
};

export default UserDashboard;
