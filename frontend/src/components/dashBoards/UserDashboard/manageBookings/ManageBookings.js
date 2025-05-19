import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaListAlt, FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import bharatGas from '../../../../assets/logos/bharat-gas-logo.png';
import hpGas from '../../../../assets/logos/hp-gas-logo.png';
import indaneGas from '../../../../assets/logos/indane-gas-logo.png';
import superGas from '../../../../assets/logos/super-gas-logo.png';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

// Provider mapping based on stationId
const providerMap = {
  '681901cdb5617cd0158997bc': { name: 'Bharat Gas', logo: bharatGas },
  '681f7fa2f52f82d6842fc86f': { name: 'HP Gas', logo: hpGas },
  '6820da9cd9678a7efcd1bdc3': { name: 'Indane Gas', logo: indaneGas },
  default: { name: 'Super Gas', logo: superGas },
};

// Set axios interceptors for Authorization header
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
//
//   axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         Cookies.remove('authToken');
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );
// };
//
// // Call interceptors once
// setupAxiosInterceptors();

const BookingCard = ({ booking, onCancel }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
      <div
        className="card shadow-md border-0"
        style={{
          borderRadius: '10px',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <div className="card-body p-4">
          <div className="row align-items-start">
            <div className="col-3 col-md-2 text-center">
              <img
                src={booking.logo}
                alt={`${booking.provider} Logo`}
                className="img-fluid rounded"
                style={{ maxWidth: '60px', maxHeight: '40px', objectFit: 'contain' }}
              />
            </div>
            <div className="col-9 col-md-10 d-flex flex-column justify-content-center align-items-end">
              <h5 className="card-title mb-1 text-primary">{booking.provider}</h5>
              <p className="card-subtitle text-muted mb-2 d-flex align-items-center gap-2">
                <FaClock className="me-1" />
                <span>{booking.date}</span>
                <span className="text-muted">•</span>
                <span>{booking.time}</span>
              </p>
            </div>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa', marginBottom: '15px' }}>
            <div className="row">
              <div className="col-6">
                <p className="mb-1">
                  <small className="text-muted">Booking ID</small>
                  <br />
                  <strong>{booking._id}</strong>
                </p>
              </div>
              <div className="col-6 text-end">
                <p className="mb-1">
                  <small className="text-muted">Amount Paid</small>
                  <br />
                  <strong>₹{booking.price}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="row align-items-center">
              <div className="col-6">
                <p className="mb-0">
                  <small className="text-muted">Booked On</small>
                  <br />
                  <strong>{booking.createdAt}</strong>
                </p>
              </div>
              <div className="col-6 text-end">
                <span
                  className={`badge ${
                    booking.status === 'Cancelled'
                      ? 'bg-danger'
                      : booking.status === 'Delivered'
                      ? 'bg-success'
                      : booking.status === 'Upcoming'
                      ? 'bg-warning'
                      : booking.status === 'Accepted'
                      ? 'bg-info'
                      : 'bg-secondary'
                  } rounded-pill`}
                >
                  {booking.status === 'Cancelled' && <FaTimesCircle className="me-1" />}
                  {booking.status === 'Delivered' && <FaCheckCircle className="me-1" />}
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
          {(booking.status === 'Pending' || booking.status === 'Upcoming') && (
            <div className="mt-3 text-end">
              <button
                className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={() => onCancel(booking._id)}
              >
                <FaBan className="me-1" /> Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ManageBookingsHeader = ({ activeFilter, setActiveFilter }) => {
  const navigate = useNavigate();
  return (
    <Navbar expand="md" bg="light" variant="light" className="py-3 shadow-sm mb-4">
      <Container>
        <Navbar.Brand href="#" style={{ color: '#4e54c8', fontWeight: 'bold' }}>
          Manage Bookings
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-start ps-3 ps-md-0">
            <Nav.Link
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              style={activeFilter === 'all' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaListAlt className="me-1" /> All
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'upcoming'}
              onClick={() => setActiveFilter('upcoming')}
              style={activeFilter === 'upcoming' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaClock className="me-1" /> Upcoming
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'Delivered'}
              onClick={() => setActiveFilter('Delivered')}
              style={activeFilter === 'Delivered' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaCheckCircle className="me-1" /> Delivered
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'cancelled'}
              onClick={() => setActiveFilter('cancelled')}
              style={activeFilter === 'cancelled' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaTimesCircle className="me-1" /> Cancelled
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'morning'}
              onClick={() => setActiveFilter('morning')}
              style={activeFilter === 'morning' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaClock className="me-1" /> Morning
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'afternoon'}
              onClick={() => setActiveFilter('afternoon')}
              style={activeFilter === 'afternoon' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaClock className="me-1" /> Afternoon
            </Nav.Link>
            <Nav.Link
              active={activeFilter === 'evening'}
              onClick={() => setActiveFilter('evening')}
              style={activeFilter === 'evening' ? { color: '#4e54c8', fontWeight: 'bold' } : {}}
            >
              <FaClock className="me-1" /> Evening
            </Nav.Link>
            {/* Back button only visible on md and up */}
            <span className="ms-3 d-none d-md-inline">
              <Button
          variant="primary"
          className="d-flex align-items-center"
          style={{ background: '#4e54c8', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 500 }}
          onClick={() => navigate('/user/dashboard')}
        >
          <FaArrowLeft className="me-2" />
          Back
        </Button>
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const ManageBookings = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrdersData = async () => {
      const token = Cookies.get('authTokenUser');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching orders with token:', token);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order`, {
          headers: { Authorization: `${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [navigate]);

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const token = Cookies.get('authTokenUser');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}/cancel`,
        { isCanceled: { status: true } },
        { headers: { Authorization: `${token}` } }
      );
      setOrders((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order._id === orderId ? { ...order, isCanceled: { status: true } } : order
        ),
      }));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  // Map API orders to BookingCard props
  const formattedBookings = orders.orders
    .map((order) => {
      const providerInfo = providerMap[order.stationId] || providerMap.default;
      const bookedOn = moment(order.createdAt).format('DD/MM/YYYY');
      const deliveryDate = moment(order.slot.date).format('DD/MM/YYYY');
      const isFutureDate = moment(order.slot.date).isAfter(moment(), 'day');
      const ispaymentPending = order.method.online.status=="pending"? true : false;
      const status = order.isCanceled.status
        ? 'Cancelled'
        : order.isDelivered.status
        ? 'Delivered'
        : order.isAccepted.status
        ? 'Accepted'
        :ispaymentPending?
        'pending payment'
        : isFutureDate
        ? 'Upcoming'
        
        : 'Pending';
      console.log('Booking status:', order.station.name);
      console.log('Formatted booking:', {
        _id: order._id,
        provider: order.station.name,
        logo: `${process.env.REACT_APP_API_BASE_URL}/api/seller/image/${order.station._id}`,
        date: deliveryDate,
        time: order.slot.startTime,
        price: order.price,
        createdAt: bookedOn,
        status,
        rawDate: order.slot.date, // For sorting
      });
      return {
        _id: order._id,
        provider: order.station.name,
        logo: `${process.env.REACT_APP_API_BASE_URL}/api/seller/image/${order.station._id}`,
        date: deliveryDate,
        time: order.slot.startTime,
        price: order.price,
        createdAt: bookedOn,
        status,
        rawDate: order.slot.date, // For sorting
      };
    })
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)); // Sort by latest date

  // Filter bookings based on activeFilter
  const filteredBookings = formattedBookings.filter((booking) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return ['Upcoming', 'Pending', 'Accepted'].includes(booking.status);
    if (activeFilter === 'Delivered') return booking.status === 'Delivered';
    if (activeFilter === 'cancelled') return booking.status === 'Cancelled';
    if (activeFilter === 'morning') {
      const time = moment(booking.time, 'HH:mm');
      return time.isBetween(moment('06:00', 'HH:mm'), moment('11:59', 'HH:mm'), undefined, '[]');
    }
    if (activeFilter === 'afternoon') {
      const time = moment(booking.time, 'HH:mm');
      return time.isBetween(moment('12:00', 'HH:mm'), moment('17:59', 'HH:mm'), undefined, '[]');
    }
    if (activeFilter === 'evening') {
      const time = moment(booking.time, 'HH:mm');
      return time.isBetween(moment('18:00', 'HH:mm'), moment('23:59', 'HH:mm'), undefined, '[]');
    }
    return true;
  });

  return (
    <div>
      <ManageBookingsHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <div className="container">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            Error: {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center my-5">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="row">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancelOrder} />
            ))}
          </div>
        )}
      </div>
      {/* Back button only visible on small devices */}
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

export default ManageBookings;