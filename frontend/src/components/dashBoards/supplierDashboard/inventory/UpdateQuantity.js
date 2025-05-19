import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { BiEdit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { updateGasStationQuantity } from "../../../../redux/stationSlice"

// Mock Redux action


// Mock API call
const fetchCurrentStock = async (supplierId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                quantity: 0,
                price: 0,
            });
        }, 1000);
    });
};

const UpdateQuantity = () => {
    const navigate = useNavigate();

    // Mock supplier data
    const supplier = { _id: "sup12345", username: "gasSupplier1", name: "John's Gas Supply", email: "john@gassupply.com" };

    const [formData, setFormData] = useState({
        quantity: "",
        price: "",
    });
    const [currentStock, setCurrentStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!supplier?._id) {
            setError("Supplier information not found. Please log in again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        fetchCurrentStock(supplier._id)
            .then((data) => {
                if (currentStock !== data.quantity || formData.quantity !== data.quantity.toString()) {
                    setCurrentStock(data.quantity);
                    setFormData({
                        quantity: data.quantity.toString(),
                        price: data.price.toString(),
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch current stock. Please try again.");
                setLoading(false);
            });
    }, [supplier?._id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const quantity = parseInt(formData.quantity);
        const price = parseFloat(formData.price);

        if (isNaN(quantity) || quantity < currentStock) {
            setError(`Quantity must be at least the current stock (${currentStock} cylinders).`);
            return;
        }
        if (isNaN(price) || price <= 0) {
            setError("Please enter a valid price per cylinder (greater than 0).");
            return;
        }

        const payload = {
            quantity,
            price,
          };
        
          try {
            await updateGasStationQuantity(payload);
            setSuccess("Inventory updated successfully!");
            setCurrentStock(quantity);
            setFormData({
              quantity: quantity.toString(),
              price: price.toString(),
            });
        
            setTimeout(() => navigate("/supplier/dashboard"), 2000);
          } catch (err) {
            console.error(err);
            setError("Failed to update inventory. Please try again.");
          }
    };

    if (loading) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "transparent", minHeight: "100vh" }}>
                <div className="text-center p-4" style={{ background: "white", borderRadius: '12px' }}>
                    <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem", color: "#4e54c8" }} />
                    <p className="mt-3 fs-5 fw-bold" style={{ color: "#4e54c8" }}>Fetching stock...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-5" style={{ backgroundColor: "transparent", minHeight: "80vh" }}>
            <style jsx>{`
                .inventory-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                    padding: 1.5rem;
                    background-color: #ffffff;
                }
                .form-title {
                    color: #212529;
                    font-weight: 700;
                    font-size: clamp(1.2rem, 4vw, 1.5rem);
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                .form-label {
                    font-weight: 500;
                    color: #343a40;
                    font-size: clamp(0.9rem, 3vw, 1rem);
                }
                .form-control {
                    border-radius: 8px;
                    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
                    padding: 0.75rem;
                }
                .rounded-pill {
                    padding: 0.5rem 1.5rem;
                    font-weight: 500;
                    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
                }
                .alert {
                    border-radius: 8px;
                    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
                    margin-bottom: 1rem;
                }
                @media (max-width: 576px) {
                    .inventory-card {
                        padding: 1rem;
                    }
                    .form-title {
                        font-size: 1.4rem;
                    }
                    .rounded-pill {
                        width: 100%;
                        margin-bottom: 0.5rem;
                    }
                    .button-group {
                        flex-direction: column;
                    }
                }
            `}</style>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="inventory-card">
                        <Card.Body>
                            <h2 className="form-title">
                                <BiEdit className="me-2" style={{ color: "#007bff" }} /> Update Gas Cylinder Stock
                            </h2>
                            {error && <Alert variant="danger" className="alert">{error}</Alert>}
                            {success && <Alert variant="success" className="alert">{success}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="quantity">
                                    <Form.Label className="form-label">Quantity of Cylinders (Current: {currentStock})</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Enter number of cylinders"
                                        min={currentStock}
                                        required
                                        className="form-control"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="price">
                                    <Form.Label className="form-label">Price per Cylinder (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price per cylinder"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        className="form-control"
                                    />
                                </Form.Group>
                                <div className="d-flex gap-3 button-group justify-content-lg-around justify-content-end">
                                    <Button
                                        variant="outline-secondary"
                                        style={{ minWidth: '180px'}}
                                        className="rounded-pill"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        style={{ backgroundColor: '#4e54c8'}}
                                        type="submit"
                                        className="rounded-pill"
                                    >
                                        Update Inventory
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateQuantity;