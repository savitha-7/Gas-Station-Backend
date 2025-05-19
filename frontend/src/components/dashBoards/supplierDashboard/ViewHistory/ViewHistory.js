import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BiHistory, BiArrowBack } from "react-icons/bi";
import moment from "moment";
import { fetchSupplierOrders } from "../../../../redux/orderSlice"; // Adjust the import path as necessary
import axios from "axios";

// Set axios defaults for Authorization header
// const setupAxiosInterceptors = (token) => {
//   axios.interceptors.request.use(
//     (config) => {
//       if (token) {
//         config.headers.Authorization = `${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };

const ViewHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token); // Assuming token is stored here
  const orders = useSelector(
    (state) => state.order.supplierOrders?.orders || []
  );
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.error);

  // Set up axios interceptors and fetch orders
  useEffect(() => {
    // if (token) {
    //   setupAxiosInterceptors(token);
    dispatch(fetchSupplierOrders());
    // } else {
    //   console.log('Token missing');
    //   navigate('/login'); // Redirect to login if token is missing
    // }
  }, [dispatch, token, navigate]);

  // Filter orders (redundant since API filters for delivered=true, but kept for safety)
  const completedOrders = orders.filter((order) => order.isDelivered?.status);

  // Map API response to match UI expectations
  const formattedOrders = completedOrders.map((order) => ({
    _id: order._id,
    userDetails: { name: order.user.name }, // Placeholder: Fetch user details if needed
    paymentType: order.method?.online ? "Online" : "N/A",
    deliveryAddress: {
      street: order.address?.AddressLine || "N/A",
      city: order.address?.cityName || "N/A",
      state: order.address?.state || "N/A",
      postalCode: order.address?.pinCode || "N/A",
    },
    quantity: order.quantity || 0,
    price: order.price || 0,
    deliveryDate: order.slot?.date || new Date(),
    status: "Delivered", // All orders from API should be delivered
  }));

  if (loading) {
    return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "transparent", minHeight: "100vh" }}
      >
        <div
          className="text-center p-4"
          style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
        >
          <Spinner
            animation="border"
            role="status"
            style={{ width: "3rem", height: "3rem", color: "#4e54c8" }}
          />
          <p className="mt-3 fs-5 fw-bold" style={{ color: "#4e54c8" }}>
            Loading history...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "transparent", minHeight: "100vh" }}>
      <style jsx>{`
        .main-content {
          padding: 1.5rem;
        }
        .history-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          padding: 1.5rem;
          background-color: #ffffff;
        }
        .history-title {
          color: #212529;
          font-weight: 700;
          font-size: clamp(1.5rem, 5vw, 1.8rem);
          margin-bottom: 1rem;
          text-align: center;
        }
        .table {
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          margin-bottom: 0;
          background-color: #ffffff;
        }
        .table th {
          background-color: #e9ecef;
          color: #343a40;
          font-weight: 600;
          padding: 0.75rem;
          border-bottom: 2px solid #dee2e6;
        }
        .table td {
          padding: 0.75rem;
          vertical-align: middle;
          border-top: 1px solid #dee2e6;
          color: #343a40;
        }
        .table tr:hover {
          background-color: #f1f3f5;
          transition: background-color 0.2s;
        }
        .status-delivered {
          color: #28a745;
          font-weight: 500;
        }
        .status-cancelled {
          color: #6c757d;
          font-weight: 500;
        }
        .no-history {
          color: #6c757d;
          font-size: clamp(0.9rem, 3vw, 1rem);
          text-align: center;
          margin-top: 1.5rem;
        }
        .history-card-item {
          border: none;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #ffffff;
          transition: transform 0.2s;
        }
        .history-card-item:hover {
          transform: translateY(-5px);
        }
        .history-card-item p {
          margin: 0.4rem 0;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          color: #343a40;
        }
        .history-card-item p strong {
          color: #212529;
          font-weight: 600;
        }
        .back-button {
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          padding: 0.3rem 1rem;
          display: flex;
          align-items: center;
          background-color: #007bff;
          color: #ffffff;
          border: none;
        }
        .back-button svg {
          margin-right: 0.5rem;
        }
        .back-button:hover {
          background-color: #0056b3;
          color: #ffffff;
        }
        .alert {
          border-radius: 8px;
          font-size: clamp(0.85rem, 2.5vw, 0.95rem);
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem 0.5rem;
          }
          .history-card {
            padding: 1rem;
          }
          .history-title {
            font-size: 1.4rem;
          }
          .table {
            display: none;
          }
          .history-card-item {
            display: block;
          }
          .back-button {
            width: 100%;
            justify-content: center;
            margin-bottom: 1rem;
          }
        }
        @media (min-width: 769px) {
          .history-card-item {
            display: none;
          }
        }
        @media (max-width: 576px) {
          .history-card {
            padding: 0.75rem;
          }
          .history-title {
            font-size: 1.2rem;
          }
          .history-card-item p {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid  style={{ backgroundColor: "#f8f9fa", minHeight: "95vh", borderRadius: "12px" }}>
          {/* {error && (
            <Row className="justify-content-center">
              <Col xs={12} sm={10} md={8}>
                <Alert variant="danger" className="text-center alert">
                  Error loading history: {error}
                </Alert>
              </Col>
            </Row>
          )} */}
          <Row className="justify-content-center">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card className="history-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="history-title">
                      <BiHistory
                        className="me-2"
                        style={{ color: "#28a745" }}
                      />{" "}
                      Order History
                    </h2>
                    <Button
                      className="back-button rounded-pill"
                      onClick={() => navigate("/supplier/dashboard")}
                    >
                      <BiArrowBack /> Back to Dashboard
                    </Button>
                  </div>
                  {formattedOrders.length > 0 ? (
                    <>
                      {/* Desktop: Table View */}
                      <div className="table-responsive">
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Name</th>
                              <th>Payment Type</th>
                              <th>Address</th>
                              <th>Quantity</th>
                              <th>Price ($)</th>
                              <th>Delivery Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formattedOrders.map((order) => (
                              <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userDetails?.name || "N/A"}</td>
                                <td>{order.paymentType || "N/A"}</td>
                                <td>
                                  {order.deliveryAddress?.street},{" "}
                                  {order.deliveryAddress?.city},{" "}
                                  {order.deliveryAddress?.state} -{" "}
                                  {order.deliveryAddress?.postalCode}
                                </td>
                                <td>{order.quantity}</td>
                                <td>{order.price.toFixed(2)}</td>
                                <td>
                                  {moment(order.deliveryDate).format(
                                    "YYYY-MM-DD HH:mm"
                                  )}
                                </td>
                                <td className="status-delivered">
                                  {order.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {/* Mobile: Card View */}
                      {formattedOrders.map((order) => (
                        <Card className="history-card-item" key={order._id}>
                          <Card.Body>
                            <p>
                              <strong>Order ID:</strong> {order._id}
                            </p>
                            <p>
                              <strong>Name:</strong>{" "}
                              {order.userDetails?.name || "N/A"}
                            </p>
                            <p>
                              <strong>Payment Type:</strong>{" "}
                              {order.paymentType || "N/A"}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {order.deliveryAddress?.street},{" "}
                              {order.deliveryAddress?.city},{" "}
                              {order.deliveryAddress?.state} -{" "}
                              {order.deliveryAddress?.postalCode}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {order.quantity}
                            </p>
                            <p>
                              <strong>Price:</strong> ${order.price.toFixed(2)}
                            </p>
                            <p>
                              <strong>Delivery Date:</strong>{" "}
                              {moment(order.deliveryDate).format(
                                "YYYY-MM-DD HH:mm"
                              )}
                            </p>
                            <p className="status-delivered">
                              <strong>Status:</strong> {order.status}
                            </p>
                          </Card.Body>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <p className="no-history">No completed orders found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ViewHistory;
