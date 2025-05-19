import React, { useState, useEffect } from "react";
import { useDispatch} from "react-redux";

import { addSlot } from "../../../../redux/slotSlice"; 

import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { MdEvent } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

// Mock Redux action for slots
const addSlots = (slotData) => ({
    type: "ADD_SLOTS",
    payload: slotData,
});

const AddSlots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mock supplier data (replace with useSelector(state => state.auth.supplier))
    const supplier = { _id: "sup12345", username: "gasSupplier1", name: "John's Gas Supply", email: "john@gassupply.com" };

    const [formData, setFormData] = useState({
        deliveriesPerSlot: "",
    });
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const slotTimes = [
        { label: "09:00 AM", type: "morning" },
        { label: "10:00 AM", type: "morning" },
        { label: "11:00 AM", type: "morning" },
        { label: "12:00 PM", type: "morning" },
        { label: "02:00 PM", type: "evening" },
        { label: "03:00 PM", type: "evening" },
        { label: "04:00 PM", type: "evening" },
        { label: "05:00 PM", type: "evening" },
    ];

    const handleSlotClick = (slot) => {
        setSelectedSlots((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name +" "+value)
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (!supplier?._id) {
            setError("Supplier information not found. Please log in again.");
            setLoading(false);
        }
    }, [supplier?._id]);


const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const deliveriesPerSlot = parseInt(formData.deliveriesPerSlot);

    if (selectedSlots.length === 0) {
        setError("Please select at least one slot.");
        return;
    }
    if (isNaN(deliveriesPerSlot) || deliveriesPerSlot < 1) {
        setError("Please enter a valid number of deliveries per slot (≥ 1).");
        return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

    const formatSlotTime = (label) => {
        const [time, modifier] = label.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const payload = {
        date: formattedDate,
        slots: selectedSlots.map((label) => ({
            startTime: formatSlotTime(label),
            capacity: deliveriesPerSlot,
        })),
    };

    try {
        await dispatch(addSlot(payload)).unwrap();
        setSuccess("Slots added successfully!");
        setTimeout(() => navigate("/supplier/dashboard"), 2000);
    } catch (err) {
        setError(err || "Something went wrong.");
    }
};

    

    if (loading) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" role="status" style={{ width: "3rem", height: "3rem" }} />
                    <p className="mt-3 fs-5" style={{ color: "#212529" }}>Loading...</p>
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
                                <MdEvent className="me-2" style={{ color: "#007bff" }} /> Add Delivery Slots
                            </h2>
                            {error && <Alert variant="danger" className="alert">{error}</Alert>}
                            {success && <Alert variant="success" className="alert">{success}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <div className="calendar-label">Select Date</div>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        className="form-control"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="mb-2 text-start form-label">Morning Slots</div>
                                    <div className="d-flex flex-wrap justify-content-between mb-3" style={{ gap: "8px" }}>
                                        {slotTimes
                                            .filter((s) => s.type === "morning")
                                            .map((slot) => (
                                                <Button
                                                    key={slot.label}
                                                    variant={selectedSlots.includes(slot.label) ? "primary" : "outline-primary"}
                                                    className="rounded-pill px-3"
                                                    onClick={() => handleSlotClick(slot.label)}
                                                >
                                                    {slot.label}
                                                </Button>
                                            ))}
                                    </div>
                                    <div className="mb-2 text-start form-label">Evening Slots</div>
                                    <div className="d-flex flex-wrap justify-content-between" style={{ gap: "8px" }}>
                                        {slotTimes
                                            .filter((s) => s.type === "evening")
                                            .map((slot) => (
                                                <Button
                                                    key={slot.label}
                                                    variant={selectedSlots.includes(slot.label) ? "warning" : "outline-warning"}
                                                    className="rounded-pill px-3"
                                                    onClick={() => handleSlotClick(slot.label)}
                                                >
                                                    {slot.label}
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                                <Form.Group className="mb-4" controlId="deliveriesPerSlot">
                                    <Form.Label className="form-label">No of Deliveries per Slot</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="deliveriesPerSlot"
                                        value={formData.deliveriesPerSlot || ""}
                                        onChange={handleChange}
                                        placeholder="Enter number of deliveries per slot"
                                        min="1"
                                        required
                                        className="form-control"
                                    />
                                </Form.Group>
                                <div className="d-flex gap-3 button-group" style={{ justifyContent: 'space-around' }}>
                                    <Button
                                        variant="outline-secondary"
                                        style={{ minWidth: '140px' }}
                                        className="rounded-pill"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="rounded-pill"
                                    >
                                        Add Slots
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

export default AddSlots;