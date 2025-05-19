import React, { useEffect, useState } from "react";
import { useDispatch, useSelector }  from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaRupeeSign } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchStation, fetchUser, fetchTimeSlots, createBooking } from "../../../redux/userSlice";
import axios from "axios";
import Cookies from 'js-cookie';
import { registerUser } from "../../../redux/authSlice";

// Provider mapping based on stationId
const providerMap = {
  '681901cdb5617cd0158997bc': { name: 'Bharat Gas', logo: '/assets/logos/bharat-gas-logo.png' },
  '681f7fa2f52f82d6842fc86f': { name: 'HP Gas', logo: '/assets/logos/hp-gas-logo.png' },
  '6820da9cd9678a7efcd1bdc3': { name: 'Indane Gas', logo: '/assets/logos/indane-gas-logo.png' },
  default: { name: 'Super Gas', logo: '/assets/logos/super-gas-logo.png' },
};

const BookGas = () => {
  const { stationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { station, user, timeSlots, loading, error } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantity, setQuantity] = useState(5);
  const [address, setAddress] = useState({
    pinCode: "",
    cityName: "",
    AddressLine: "",
    state: "",
  });

  // Initialize address from user data
  useEffect(() => {
    console.log("User:", user);
    if (user?.address) {
      setAddress({
        pinCode: user.address.pinCode || 560001,
        cityName: user.address.cityName || "Bangalore",
        AddressLine: user.address.AddressLine || "123 MG Road",
        state: user.address.state || "Karnataka",
      });
    }
  }, [user]);

  // Format date to YYYY-MM-DD in UTC
  const formatDateToUTC = (date) => {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  };

  // Fetch data and check authentication
  useEffect(() => {
    const userId = Cookies.get('authTokenUserId');
    
    // Dispatch fetchStation and fetchTimeSlots
    dispatch(fetchStation(stationId));
    dispatch(fetchTimeSlots({ stationId, date: formatDateToUTC(selectedDate) }));

    // Fetch user details and update userDetails state
    if (userId) {
      dispatch(fetchUser(userId)).unwrap()
        .then((userData) => {
          console.log("Fetched user details:", userData);
          setUserDetails(userData);
        })
        .catch((err) => {
          console.error("Failed to fetch user details:", err);
        });
    } else {
      console.log("No userId found in cookies, redirecting to login");
      navigate("/login");
    }
  }, [dispatch, stationId, selectedDate, navigate]);

  // Log station and time slots, set default time
  useEffect(() => {
    console.log("Station:", station);
    console.log("stationId:", stationId);
    console.log("Time slots:", timeSlots);
    if (timeSlots && timeSlots.length > 0 && !selectedTime) {
      const firstAvailableSlot = timeSlots.find((slot) => slot.capacity > 0);
      if (firstAvailableSlot) {
        setSelectedTime(firstAvailableSlot.startTime);
      }
    }
  }, [timeSlots, selectedTime]);


  const groupedTimeSlots = {
    Morning: timeSlots?.filter((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0], 10);
      return hour >= 8 && hour < 12;
    }) || [],
    Afternoon: timeSlots?.filter((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0], 10);
      return hour >= 12 && hour < 16;
    }) || [],
    Evening: timeSlots?.filter((slot) => {
      const hour = parseInt(slot.startTime.split(":")[0], 10);
      return hour >= 16 && hour <= 20;
    }) || [],
  };

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Format time to "HH:MM"
  const formatTimeTo24Hour = (time) => {
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const formattedHour = String(hourNum).padStart(2, "0");
    const formattedMinute = String(parseInt(minute, 10)).padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  };

  // Handle quantity input
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 1) {
      setQuantity(1);
    } else {
      setQuantity(parsedValue);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }
    if (!address.pinCode || !address.cityName || !address.AddressLine || !address.state) {
      alert("Please fill in all address fields.");
      return;
    }
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      alert("Please select a valid quantity.");
      return;
    }

    const selectedSlot = timeSlots.find((slot) => slot.startTime === selectedTime);
    if (selectedSlot && quantity > selectedSlot.capacity) {
      alert(`Quantity exceeds available stock (${selectedSlot.capacity})`);
      return;
    }

    const midnightUTC = new Date(Date.UTC(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate()
    ));
    const formattedDate = midnightUTC.toISOString();
    const price = (station?.price || 950) * quantity;
    const bookingData = {
      address,
      price,
      quantity,
      method: {
        online: {
          transactionID: "",
          status: "pending",
          amount: price,
        },
      },
      stationId,
      slot: {
        date: formattedDate,
        startTime: formatTimeTo24Hour(selectedTime),
      },
    };

    console.log("Booking Data:", bookingData);

    try {
      const result = await dispatch(createBooking(bookingData)).unwrap();
      console.log("Booking result:", result.razorPayOrder.id);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }
      const token1 = Cookies.get('authTokenUser');

      console.log("Razorpay SDK loaded successfully");
      console.log("Razorpay Order:", result.razorPayOrder.id);
      console.log("currr", result.razorPayOrder.currency);
      console.log("Booking Data with transaction ID1:", result.order._id);
      
      // Get provider info
      const providerInfo = providerMap[stationId] || providerMap.default;
console.log("Provider Info:",process.env.REACT_APP_API_BASE_URL);
      const options = {
        key: "rzp_test_485wCYbGh1Jqaj",
        amount: bookingData.price * 100,
        currency: result.razorPayOrder.currency,
        order_id: result.razorPayOrder.id,
        name: "Gas Booking",
        description: `Payment for ${quantity} LPG Cylinders`,
        image: station?.logo || "https://via.placeholder.com/50?text=Logo",
        handler: async (response) => {
          try {
            console.log("Payment response 1111:", response);
            bookingData.method.online.transactionID = response.razorpay_payment_id;
            bookingData.method.online.status = "success";
            console.log("Payment response:", response.razorPayOrder);
            console.log("Booking Data with transaction ID:", result.order);
            const url= `${process.env.REACT_APP_API_BASE_URL}/api/order/verify/${result.order._id}`;
            const verifyResponse = await axios.post(
              url,
              {
                razorpayOrderId: result.razorPayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: result.order._id,
              },
              {
                headers: {
                  Authorization: `${token1}`,
                },
              }
            );
            console.log("Payment verification response:", verifyResponse.data);
            
            if (verifyResponse.data.msg === "Success") {
              const data={
                  bookingId: result.order._id,
                  provider: station.name,
                  providerLogo: `${process.env.REACT_APP_API_BASE_URL}/api/seller/image/${stationId}`,
                  deliveryDate: selectedDate.toLocaleDateString("en-GB"),
                  deliveryTime: selectedTime, // Keep as provided (e.g., "8:00 AM")
                  amount: price,
                };
              localStorage.setItem('bookingSuccessData', JSON.stringify(data));
              navigate("/booking-success",{ replace: true }, {
               
              });
            } else {
              throw new Error("Verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed: " + (error.response?.data?.message || "Unknown error"));
          }
        },
        prefill: {
          name: user?.username || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "1234567890",
        },
        theme: {
          color: "#4e54c8",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking: " + (error || "Unknown error"));
    }
  };

  const deliveryCharge = 0;
  const total = (station?.price || 0) * quantity + deliveryCharge;

  return (
    <div className="container py-5" style={{ backgroundColor: "transparent"}}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold mb-0 text-center" style={{ color: "#4e54c8", fontSize: "2rem" }}>Book a Gas Delivery Slot</h2>
        <div className="d-none d-md-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            style={{ borderRadius: "20px", padding: "0.5rem 1.5rem", fontWeight: "bold" }}
            onClick={() => navigate(-1)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4e54c8" viewBox="0 0 16 16" style={{ marginRight: '10px', marginLeft: '-2px'}}>
                <path fillRule="evenodd" d="M15 8a.75.75 0 0 1-.75.75H3.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 1 1 1.06 1.06L3.56 7.25H14.25A.75.75 0 0 1 15 8z"/>
              </svg>
              Back
            </span>
          </button>
          <button
            className="btn btn-outline-danger"
            style={{ borderRadius: "20px", padding: "0.5rem 1.5rem", fontWeight: "bold" }}
            onClick={() => navigate("/user/dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Loading booking details...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row g-5">
        <div className="col-12 col-lg-6" >
          <div className="p-4 shadow-lg rounded bg-white">
            <h2 className="fw-bold mb-4" style={{ color: "black", fontSize: "1.25rem" }}>
              <FaCalendarAlt style={{ color: "#4e54c8" }} className="me-2" /> Select Date
            </h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedTime(null);
                setSelectedDate(date);
              }}
              className="form-control mb-4"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />

            {/* Add background to the Select Time Slot section and its buttons */}
            <div style={{ background: '#f3f5f7', borderRadius: '16px', padding: '1.5rem 1rem' }}>
              <h4 className="fw-bold mb-4" style={{ color: "black", fontSize: "1.1rem" }}>
                <FaClock style={{ color: "#4e54c8" }} className="me-2" /> Select Time Slot
              </h4>
              {Object.keys(groupedTimeSlots).map((period) => (
                <div key={period} className="mb-4">
                  <h6 className="fw-bold text-secondary">{period}</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {groupedTimeSlots[period].length > 0 ? (
                      groupedTimeSlots[period].map((slot) => (
                        <button
                          key={slot.startTime}
                          className={`btn ${
                            selectedTime === slot.startTime ? "text-white" : "btn-outline-primary"
                          }`}
                          style={{
                            backgroundColor: selectedTime === slot.startTime ? "#4e54c8" : "transparent",
                            borderColor: "#4e54c8",
                            color: selectedTime === slot.startTime ? "#fff" : slot.capacity > 0 ? "#4e54c8" : "#ccc",
                            borderRadius: "20px",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            cursor: slot.capacity > 0 ? "pointer" : "not-allowed",
                            opacity: slot.capacity > 0 ? 1 : 0.5,
                          }}
                          onClick={() => slot.capacity > 0 && setSelectedTime(slot.startTime)}
                          disabled={slot.capacity <= 0}
                        >
                          {slot.startTime} ({slot.capacity} available)
                        </button>
                      ))
                    ) : (
                      <p className="text-muted">No slots available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 shadow-lg rounded bg-white mt-4">
            <h4 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
              Quantity
            </h4>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              placeholder="Enter quantity"
            />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-lg border-0 p-2" style={{ borderRadius: "8px" }}>
            <div className="card-body">
              <h4 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
                Booking Summary
              </h4>

              <div className="d-flex justify-content-between align-items-center mb-4 ms-2">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/seller/image/${stationId}` || "https://via.placeholder.com/50?text=Logo"}
                  alt={`${station?.name || "Provider"} Logo`}
                  className="img-fluid rounded me-3"
                  style={{ width: "60px", height: "60px" }}
                />
                <div className="me-2">
                  <h5 className="mb-0">{station?.name || "Loading..."}</h5>
                  <small className="text-muted">LPG Cylinder (Quantity: {quantity})</small>
                </div>
              </div>

              <div
                className="mb-4 p-3 rounded"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
              >
                <h6 className="fw-bold text-secondary">User Details</h6>
                <p className="mb-1">
                  <FaUser style={{ color: "#4e54c8" }} className="me-2" />
                  <strong>Name:</strong> {userDetails.name || "Loading..."}
                </p>
                <p className="mb-1">
                  <FaPhone style={{ color: "#4e54c8" }} className="me-2" />
                  <strong>Phone:</strong> {userDetails.phone || "Loading..."}
                </p>
              </div>

              <div
                className="mb-4 p-3 rounded"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
              >
                <h6 className="fw-bold text-secondary">
                  <FaMapMarkerAlt style={{ color: "#4e54c8" }} className="me-2" />
                  Delivery Address
                </h6>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#4e54c8' }}>Address Line</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address.AddressLine}
                    onChange={(e) =>
                      setAddress({ ...address, AddressLine: e.target.value })
                    }
                    placeholder="Enter address line"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#4e54c8' }}>City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address.cityName}
                    onChange={(e) =>
                      setAddress({ ...address, cityName: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </div>
                {/* State and Pin Code in one row for large devices */}
                <div className="row">
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" style={{ color: '#4e54c8' }}>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" style={{ color: '#4e54c8' }}>Pin Code</label>
                    <input
                      type="number"
                      className="form-control"
                      value={address.pinCode}
                      onChange={(e) =>
                        setAddress({ ...address, pinCode: e.target.value })
                      }
                      placeholder="Enter pin code"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary">
                  <FaCalendarAlt style={{ color: "#4e54c8" }} className="me-2" /> Date & Time
                </h6>
                <p className="mb-0">
                  {selectedDate.toLocaleDateString("en-GB")} • {selectedTime ? formatTimeTo24Hour(selectedTime) : "Select a time"}
                </p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-secondary">
                  <FaRupeeSign style={{ color: "#4e54c8" }} className="me-2" /> Price Details
                </h6>
                <div className="d-flex justify-content-between">
                  <span>Gas Price ({quantity} cylinders)</span>
                  <span>₹{station?.price || 0} x {quantity} = ₹{(station?.price || 0) * quantity}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between fw-bold border-top pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="d-grid mt-4">
                <button
                  className="btn fw-bold"
                  style={{
                    backgroundColor: "#4e54c8",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "0.75rem",
                  }}
                  onClick={handleProceedToPayment}
                  disabled={loading || !station || !selectedTime || !quantity}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
                {/* Mobile only: Back and Cancel below payment button */}
                <div className="d-md-none d-flex gap-2 mt-3">
                  <button
                    className="btn btn-outline-secondary w-50"
                    style={{ borderRadius: "20px", fontWeight: "bold" }}
                    onClick={() => navigate(-1)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4e54c8" viewBox="0 0 16 16" style={{ marginRight: '10px', marginLeft: '-2px'}}>
                        <path fillRule="evenodd" d="M15 8a.75.75 0 0 1-.75.75H3.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 1 1 1.06 1.06L3.56 7.25H14.25A.75.75 0 0 1 15 8z"/>
                      </svg>
                      Back
                    </span>
                  </button>
                  <button
                    className="btn btn-outline-danger w-50"
                    style={{ borderRadius: "20px", fontWeight: "bold" }}
                    onClick={() => navigate("/user/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookGas;