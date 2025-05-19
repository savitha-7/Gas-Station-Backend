import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BiListUl, BiArrowBack, BiCheck, BiX, BiCheckCircle } from 'react-icons/bi';
import moment from 'moment';
import Cookies from 'js-cookie';
import { fetchSupplierOrdersCurrent, acceptOrder, cancelOrder, deliverOrder } from '../../../../redux/orderSlice';

// Set axios defaults for Authorization header
// const setupAxiosInterceptors = () => {
//   axios.interceptors.request.use(
//     (config) => {
//       const token = Cookies.get('authToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };

const ViewOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.order.supplierOrders?.orders || []);
  const loading = useSelector((state) => state.order.loading);
  const error = useSelector((state) => state.order.error);

  // Set up axios interceptors and fetch orders
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
    //   setupAxiosInterceptors();
      dispatch(fetchSupplierOrdersCurrent());
    } else {
      console.log('Token missing');
      navigate('/login');
    }
  }, [dispatch, navigate]);

  // Handle order status updates
  const handleUpdateStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    if (newStatus === 'Accepted') {
      dispatch(acceptOrder(orderId));
      // window.location.reload()
    } else if (newStatus === 'Cancelled') {
      dispatch(cancelOrder(orderId));

    } else if (newStatus === 'Delivered') {
      dispatch(deliverOrder(orderId));

    }
     setTimeout(() => {
  window.location.reload();
}, 3000); // 5000 milliseconds = 5 se
  };
  

  // Map API response to UI structure and determine status
  const formattedOrders = orders.map((order) => ({
    _id: order._id,
    userDetails: { name: order.user.name }, // Placeholder: Fetch user details if needed
    paymentType: order.method?.online ? 'Online' : 'N/A',
    paymentStatus: order.method?.online?.status || 'N/A',
    deliveryAddress: {
      street: order.address?.AddressLine || 'N/A',
      city: order.address?.cityName || 'N/A',
      state: order.address?.state || 'N/A',
      postalCode: order.address?.pinCode || 'N/A',
    },
    quantity: order.quantity || 0,
    price: order.price || 0,
    deliveryDate: order.slot?.date || new Date(),
    status: order.isDelivered?.status
      ? 'Delivered'
      : order.isCanceled?.status
      ? 'Cancelled'
      : order.isAccepted?.status
      ? 'Accepted'
      : 'Pending',
  }));

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
        <div className="text-center p-4" style={{backgroundColor: "#f8f9fa", borderRadius: "12px"}}>
          <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', color: "#4e54c8" }} />
          <p className="mt-3 fs-5 fw-bold" style={{ color: '#4e54c8' }}>Loading orders...</p>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh'}}>
      <style jsx>{`
        .main-content {
          padding: 1.5rem;
        }
        .orders-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          padding: 1.5rem;
          background-color: #ffffff;
          margin-top: 1rem;
        }
        .orders-title {
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
        .status-pending {
          color: #dc3545;
          font-weight: 500;
        }
        .status-delivered {
          color: #28a745;
          font-weight: 500;
        }
        .status-cancelled {
          color: #6c757d;
          font-weight: 500;
        }
        .status-accepted {
          color: #007bff;
          font-weight: 500;
        }
        .payment-pending {
          color: #dc3545;
          font-weight: 500;
        }
        .payment-paid {
          color: #28a745;
          font-weight: 500;
        }
        .payment-pending {
          color: #dc3545;
          font-weight: 500;
        }
        .payment-paid {
          color: #28a745;
          font-weight: 500;
        }
        .action-button {
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          line-height: 1;
          margin-right: 0.5rem;
        }
        .action-button svg {
          margin-right: 0.3rem;
        }
        .no-orders {
          color: #6c757d;
          font-size: clamp(0.9rem, 3vw, 1rem);
          text-align: center;
          margin-top: 1.5rem;
        }
        .order-card {
          border: none;
          border-radius: 12px;
          ;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #ffffff;
          transition: transform 0.2s;
        }
        .order-card:hover {
          transform: translateY(-5px);
        }
        .order-card p {
          margin: 0.4rem 0;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          color: #343a40;
        }
        .order-card p strong {
          color: #212529;
          font-weight: 600;
        }
        .back-button {
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
          padding: 0.3rem 1rem;
          display: flex;
          align-items: center;
          background-color: #28a745;
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
          .orders-card {
            padding: 1rem;
          }
          .orders-title {
            font-size: 1.4rem;
          }
          .table {
            display: none;
          }
          .order-card {
            display: block;
          }
          .back-button {
            width: 100%;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .action-button {
            font-size: 0.75rem;
            padding: 0.2rem 0.5rem;
            width: 48%;
            margin-bottom: 0.5rem;
          }
          .action-button svg {
            margin-right: 0.2rem;
          }
          .action-buttons {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            flex-wrap: wrap;
            flex-wrap: wrap;
          }
        }
        @media (min-width: 769px) {
          .order-card {
            display: none;
          }
        }
        @media (max-width: 576px) {
          .orders-card {
            padding: 0.75rem;
          }
          .orders-title {
            font-size: 1.2rem;
          }
          .order-card p {
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
                  Error loading orders: {error}
                </Alert>
              </Col>
            </Row>
          )} */}
          <Row className="justify-content-center">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card className="orders-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="orders-title">
                      <BiListUl className="me-2" style={{ color: '#28a745' }} /> Supplier Orders
                    </h2>
                    <Button
                      className="back-button rounded-pill"
                      style={{ backgroundColor: '#14A44D' }}
                      onClick={() => navigate('/supplier/dashboard')}
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
                              <th>Payment Status</th>
                              <th>Payment Status</th>
                              <th>Address</th>
                              <th>Quantity</th>
                              <th>Price ($)</th>
                              <th>Delivery Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formattedOrders.map((order) => (
                              <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.userDetails?.name || 'N/A'}</td>
                                <td>{order.paymentType || 'N/A'}</td>
                                <td
                                  className={
                                    order.paymentStatus === 'pending'
                                      ? 'payment-pending'
                                      : 'payment-paid'
                                  }
                                >
                                  {order.paymentStatus.charAt(0).toUpperCase() +
                                    order.paymentStatus.slice(1)}
                                </td>
                                <td
                                  className={
                                    order.paymentStatus === 'pending'
                                      ? 'payment-pending'
                                      : 'payment-paid'
                                  }
                                >
                                  {order.paymentStatus.charAt(0).toUpperCase() +
                                    order.paymentStatus.slice(1)}
                                </td>
                                <td>
                                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{' '}
                                  {order.deliveryAddress?.state} - {order.deliveryAddress?.postalCode}
                                </td>
                                <td>{order.quantity}</td>
                                <td>{order.price.toFixed(2)}</td>
                                <td>{moment(order.deliveryDate).format('YYYY-MM-DD HH:mm')}</td>
                                <td
                                  className={
                                    order.status === 'Pending'
                                      ? 'status-pending'
                                      : order.status === 'Delivered'
                                      ? 'status-delivered'
                                      : order.status === 'Accepted'
                                      ? 'status-accepted'
                                      : 'status-cancelled'
                                  }
                                >
                                  {order.status}
                                </td>
                                <td>
                                  {order.status === 'Pending' && order.paymentStatus === 'paid' ? (
                                    <>
                                      <Button
                                        variant="primary"
                                        className="action-button rounded-pill"
                                        onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                                      >
                                        <BiCheck /> Accept
                                      </Button>
                                      <Button
                                        variant="danger"
                                        className="action-button rounded-pill"
                                        onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                                      >
                                        <BiX /> Cancel
                                      </Button>
                                    </>
                                  ) : order.status === 'Accepted' ? (
                                    <Button
                                      variant="success"
                                      className="action-button rounded-pill"
                                      onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                    >
                                      <BiCheckCircle /> Deliver
                                    </Button>
                                  ) : order.paymentStatus==='pending' && order.status!='Cancelled'? (
                                    <Button
                                        variant="danger"
                                        className="action-button rounded-pill"
                                        onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                                      >
                                        <BiX /> Cancel
                                      </Button>
                                  ): null}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {/* Mobile: Card View */}
                      {formattedOrders.map((order) => (
                        <Card className="order-card" key={order._id}>
                          <Card.Body>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Name:</strong> {order.userDetails?.name || 'N/A'}</p>
                            <p><strong>Payment Type:</strong> {order.paymentType || 'N/A'}</p>
                            <p
                              className={
                                order.paymentStatus === 'pending'
                                  ? 'payment-pending'
                                  : 'payment-paid'
                              }
                            >
                              <strong>Payment Status:</strong>{' '}
                              {order.paymentStatus.charAt(0).toUpperCase() +
                                order.paymentStatus.slice(1)}
                            </p>
                            <p>
                              <strong>Address:</strong> {order.deliveryAddress?.street},{' '}
                              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{' '}
                              {order.deliveryAddress?.postalCode}
                            </p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
                            <p>
                              <strong>Delivery Date:</strong>{' '}
                              {moment(order.deliveryDate).format('YYYY-MM-DD HH:mm')}
                            </p>
                            <p
                              className={
                                order.status === 'Pending'
                                  ? 'status-pending'
                                  : order.status === 'Delivered'
                                  ? 'status-delivered'
                                  : order.status === 'Accepted'
                                  ? 'status-accepted'
                                  : 'status-cancelled'
                              }
                            >
                              <strong>Status:</strong> {order.status}
                            </p>
                            {(order.status === 'Pending' && order.paymentStatus === 'paid') ||
                            order.status === 'Accepted' ? (
                              <div className="action-buttons mt-2">
                                {order.status === 'Pending' && order.paymentStatus === 'paid' && (
                                  <>
                                    <Button
                                      variant="primary"
                                      className="action-button rounded-pill"
                                      onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                                    >
                                      <BiCheck /> Accept
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="action-button rounded-pill"
                                      onClick={() => handleUpdateStatus(order._id, 'Cancelled')}
                                    >
                                      <BiX /> Cancel
                                    </Button>
                                  </>
                                )}
                                {order.status === 'Accepted' && (
                                  <Button
                                    variant="success"
                                    className="action-button rounded-pill"
                                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                  >
                                    <BiCheckCircle /> Delivered
                                  </Button>
                                )}
                              </div>
                            ) : null}
                          </Card.Body>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <p className="no-orders">No orders found.</p>
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

export default ViewOrders;