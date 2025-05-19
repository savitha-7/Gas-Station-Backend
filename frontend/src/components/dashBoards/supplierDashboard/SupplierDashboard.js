import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BiGasPump, BiBox, BiListUl, BiHistory, BiLogOut, BiCog, BiEdit } from 'react-icons/bi';
import { getSupplierOrders } from '../../../redux/orderActions';
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';
import { GiGasStove } from "react-icons/gi";
import { MdEvent } from "react-icons/md";

import  { useState } from 'react';
import axios from 'axios';
const base_url = process.env.REACT_APP_API_BASE_URL;

const SupplierDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const supplier = useSelector(state => state.auth.supplier);
    const orders = useSelector(state => state.order.supplierOrders);
    const [formData, setFormData] = useState({
        quantity: '',
        price: '',
        total_orders: '',
      });
    // Mock data for available cylinders and total orders (replace with actual state)
    const availableCylinders = 50; // Placeholder, update with actual state
    const totalOrders = orders?.length || 0;

    useEffect(() => {
        if (supplier && supplier._id) {
            dispatch(getSupplierOrders(supplier._id));
        }
    }, [dispatch, supplier, navigate]); // Added navigate to dependency array

    const handleLogout = () => {
        // Dispatch logout action (replace with actual action)
        localStorage.removeItem("fuelStation");
    Cookies.remove("authToken");
     Cookies.remove("authTokenSellerId");
    toast.success("Logged Out");
        navigate('/');
    };



      useEffect(() => {
    const fetchSupplierData = async () => {

      try {
        // Fetch supplier details
        const detailsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/me`, {
          headers: 
          { 
            Authorization: `${Cookies.get('authToken')}`,
         }, // Add token if required
        });
        const supplier = detailsResponse.data;
        setFormData({
            name: supplier.name,
            name: supplier.name,
         quantity: supplier.quantity,
        price: supplier.price,
        total_orders: supplier.totalOrders,
        });
console.log('Supplier details:', formData);
     
      } catch (err) {
        // setError('Failed to load supplier data. Please try again.');
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);



    return (
        <Container className="mt-5 mb-5" style={{ backgroundColor: 'transparent', minHeight: '80vh', position: 'relative' }}>
            <Navbar bg="white" expand="md" className="shadow-sm rounded mb-4 px-3" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                <Navbar.Brand className="fw-bold" style={{ fontSize: '1.3rem', color: '#4e54c8' }}>
                    Supplier Dashboard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="supplier-navbar-nav" />
                <Navbar.Collapse id="supplier-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-2">
                        <Nav.Link className="d-flex align-items-center" onClick={() => navigate('/supplier/account-settings')}>
                            <BiCog size={22} className="me-1" />
                            <span className="d-md-inline">Account Settings</span>
                        </Nav.Link>
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
            <style jsx>{`
                .dashboard-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                    transition: transform 0.2s;
                }
                .dashboard-card:hover {
                    transform: translateY(-5px);
                }
                .summary-card {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                }
                .summary-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #343a40;
                }
                .summary-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #007bff;
                }
                .action-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .action-text {
                    font-size: 0.9rem;
                }
                .rounded-pill {
                    padding: 10px 24px;
                    font-weight: 500;
                }
            `}</style>
            <h2 className="mb-3 text-center fw-bold" style={{ color: "#4e54c8"}}>
                Welcome, {supplier?.username || formData.name || 'Supplier'}!
            </h2>
            <p className="lead text-center mb-5" style={{ color: "#f8f9fa"}}>
                Manage your gas supply operations with ease
            </p>
            {/* Summary Section */}
            <Row className="">
                <Col md={6}>
                    <Card className="summary-card mb-4 mb-lg-5">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-center mb-2 text-primary">
                                <GiGasStove size={32} className="me-2" style={{ color: '#f47983'}}/>
                                <h3 className="summary-title mb-0">Available Cylinders</h3>
                            </div>
                            <p className="summary-value">{formData.quantity}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="summary-card mb-4 mb-lg-5">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-center mb-2 text-success">
                                <BiListUl size={32} className="me-2" />
                                <h3 className="summary-title mb-0">Total Orders</h3>
                            </div>
                            <p className="summary-value">{formData.total_orders}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Action Cards */}
            <Row className="g-4">
                <Col md={3}>
                    <Card className="dashboard-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3 text-primary">
                                <MdEvent size={32} className="me-2" />
                                <Card.Title className="action-title mb-0">Add slot</Card.Title>
                            </div>
                            <Card.Text className="text-center text-muted action-text">
                                Add stock  by adding new time.
                            </Card.Text>
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 py-2 mt-auto"
                                onClick={() => navigate('/supplier/add-slots')}
                            >
                                Add Stock
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="dashboard-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3" style={{ color: '#4e54c8' }}>
                                <BiEdit size={32} className="me-2" />
                                <Card.Title className="action-title mb-0">Update Quantity</Card.Title>
                            </div>
                            <Card.Text className="text-center text-muted action-text">
                                Update your Quantity and price by adding new gas cylinders.
                            </Card.Text>
                            <Button
                                style={{ backgroundColor: '#4e54c8', borderColor: '#4e54c8' }}
                                className="rounded-pill px-4 py-2 mt-auto"
                                onClick={() => navigate('/supplier/update-quantity')}
                            >
                                Update Quantity
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="dashboard-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3 text-success">
                                <BiListUl size={32} className="me-2" />
                                <Card.Title className="action-title mb-0">Orders</Card.Title>
                            </div>
                            <Card.Text className="text-center text-muted action-text">
                                View and manage all customer orders.
                            </Card.Text>
                            <Button
                                variant="success"
                                className="rounded-pill px-4 py-2 mt-auto"
                                onClick={() => navigate('/supplier/orders')}
                            >
                                View Orders
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="dashboard-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-3 text-info">
                                <BiHistory size={32} className="me-2" />
                                <Card.Title className="action-title mb-0">View History</Card.Title>
                            </div>
                            <Card.Text className="text-center text-muted action-text">
                                Check your past supply and order history.
                            </Card.Text>
                            <Button
                                variant="info"
                                className="rounded-pill px-4 py-2 mt-auto text-white"
                                onClick={() => navigate('/supplier/history')}
                            >
                                View History
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SupplierDashboard;