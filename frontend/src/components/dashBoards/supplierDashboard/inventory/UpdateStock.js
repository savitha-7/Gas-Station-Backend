import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdInventory } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Mock Redux action (replace with actual action)
const updateInventory = (inventoryData) => ({
    type: 'UPDATE_INVENTORY',
    payload: inventoryData,
});

// Mock API call to fetch current stock (replace with actual API)
const fetchCurrentStock = async (supplierId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                quantity: 50,
                price: 45.99
            });
        }, 1000);
    });
};

const UpdateInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

     // const supplier = useSelector((state) => state.auth.supplier); // Expected: { _id: "sup12345", username: "gasSupplier1", name: "John's Gas Supply", email: "john@gassupply.com" }
     const supplier = { _id: "sup12345", username: "gasSupplier1", name: "John's Gas Supply", email: "john@gassupply.com" }; // Expected: { _id: "sup12345", username: "gasSupplier1", name: "John's Gas Supply", email: "john@gassupply.com" }

    const [formData, setFormData] = useState({
        quantity: '',
        price: '',
        deliveriesPerSlot: '',
    });
    const [currentStock, setCurrentStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const slotTimes = [
        { label: '09:00 AM', type: 'morning' },
        { label: '10:00 AM', type: 'morning' },
        { label: '11:00 AM', type: 'morning' },
        { label: '12:00 PM', type: 'morning' },
        { label: '02:00 PM', type: 'evening' },
        { label: '03:00 PM', type: 'evening' },
        { label: '04:00 PM', type: 'evening' },
        { label: '05:00 PM', type: 'evening' },
    ];

    const handleSlotClick = (slot) => {
        setSelectedSlots((prev) =>
            prev.includes(slot)
                ? prev.filter((s) => s !== slot)
                : [...prev, slot]
        );
    };

    // Fetch current stock on mount
    useEffect(() => {
        if (!supplier?._id) {
            setError('Supplier information not found. Please log in again.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        fetchCurrentStock(supplier._id)
            .then((data) => {
                if (currentStock !== data.quantity || formData.quantity !== data.quantity.toString()) {
                    setCurrentStock(data.quantity);
                    setFormData({
                        quantity: data.quantity.toString(),
                        price: data.price.toString(),
                        deliveriesPerSlot: formData.deliveriesPerSlot,
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch current stock. Please try again.');
                setLoading(false);
            });

        console.log('useEffect ran with supplier:', supplier);
    }, [supplier?._id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const quantity = parseInt(formData.quantity);
        const price = parseFloat(formData.price);
        const deliveriesPerSlot = parseInt(formData.deliveriesPerSlot);

        if (isNaN(quantity) || quantity < currentStock) {
            setError(`Quantity must be at least the current stock (${currentStock} cylinders).`);
            return;
        }
        if (isNaN(price) || price <= 0) {
            setError('Please enter a valid price per cylinder (greater than 0).');
            return;
        }
        if (isNaN(deliveriesPerSlot) || deliveriesPerSlot < 1) {
            setError('Please enter a valid number of deliveries per slot (greater than or equal to 1).');
            return;
        }

        const inventoryData = {
            supplierId: supplier?._id,
            quantity: quantity,
            price: price,
            deliveriesPerSlot: deliveriesPerSlot,
        };

        dispatch(updateInventory(inventoryData));
        setSuccess('Inventory updated successfully!');
        setCurrentStock(quantity);
        setFormData({ quantity: quantity.toString(), price: price.toString(), deliveriesPerSlot: deliveriesPerSlot.toString() });

        setTimeout(() => navigate('/supplier/dashboard'), 2000);
    };

    if (loading) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 fs-5" style={{ color: '#212529' }}>Fetching stock...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
                    font-size: clamp(1.2rem, 4vw, 1.5rem); /* Decreased size */
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
                .calendar-label {
                    font-weight: 500;
                    color: #343a40;
                    font-size: clamp(0.95rem, 3vw, 1.05rem);
                    margin-bottom: 0.5rem;
                }
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__input-container input {
                    width: 100%;
                    border-radius: 8px;
                    padding: 0.75rem;
                    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
                    border: 1px solid #ced4da;
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
                    .calendar-label {
                        font-size: 0.95rem;
                    }
                }
            `}</style>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="inventory-card">
                        <Card.Body>
                            <h2 className="form-title">
                                <MdInventory className="me-2" style={{ color: '#007bff' }} /> Add/Update Gas Cylinder Stock
                            </h2>
                            {/* Calendar Date Picker */}
                            <div className="mb-4">
                                <div className="calendar-label">Select Date</div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    className="form-control"
                                    popperPlacement="bottom"
                                    showPopperArrow={false}
                                />
                            </div>
                            <div className="mb-4">
                                <div className="mb-2 text-start form-label" style={{ fontWeight: 500, color: '#343a40', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Morning Slots</div>
                                <div className="d-flex flex-wrap justify-content-between mb-3" style={{ gap: '8px' }}>
                                    {slotTimes.filter(s => s.type === 'morning').map((slot) => (
                                        <Button
                                            key={slot.label}
                                            variant={selectedSlots.includes(slot.label) ? 'primary' : 'outline-primary'}
                                            className="rounded-pill px-3"
                                            onClick={() => handleSlotClick(slot.label)}
                                        >
                                            {slot.label}
                                        </Button>
                                    ))}
                                </div>
                                <div className="mb-2 text-start form-label" style={{ fontWeight: 500, color: '#343a40', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Evening Slots</div>
                                <div className="d-flex flex-wrap justify-content-between" style={{ gap: '8px' }}>
                                    {slotTimes.filter(s => s.type === 'evening').map((slot) => (
                                        <Button
                                            key={slot.label}
                                            variant={selectedSlots.includes(slot.label) ? 'warning' : 'outline-warning'}
                                            className="rounded-pill px-3"
                                            onClick={() => handleSlotClick(slot.label)}
                                        >
                                            {slot.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                {error && <Alert variant="danger" className="alert">{error}</Alert>}
                                {success && <Alert variant="success" className="alert">{success}</Alert>}

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

                                <Form.Group className="mb-4" controlId="deliveriesPerSlot">
                                    <Form.Label className="form-label">No of Deliveries per Slot</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deliveriesPerSlot"
                                        value={formData.deliveriesPerSlot || ''}
                                        onChange={handleChange}
                                        placeholder="Enter number of deliveries per slot"
                                        min="1"
                                        required
                                        className="form-control"
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-3 button-group">
                                    <Button
                                        variant="outline-secondary"
                                        className="rounded-pill"
                                        onClick={() => navigate(-1)} // Navigate back to previous page
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
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

export default UpdateInventory;