import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_API_BASE_URL; // Replace with your actual base URL
const USER_ID = Cookies.get('authTokenUserId'); // Replace with dynamic ID from auth context

const AccountSettings = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  });

  // Fetch user data on mount
  useEffect(() => {
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/user/${USER_ID}`, {
          headers: { Authorization: `${Cookies.get('authTokenUser')}` },
        });
        const user = response.data;
        setInitialValues({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone?.toString() || '',
        });
      } catch (err) {
        setError('Failed to load user data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Form submission handler
  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(
        `${BASE_URL}/api/user/`,
        {
          name: values.name,
          email: values.email,
          phone: parseInt(values.phone),
        },
        {
          headers: { Authorization: `${Cookies.get('authTokenUser')}` },
        }
      );
      setSuccess('Account details updated successfully!');
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      setError('Failed to update details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <div className="container py-5" style={{ background: 'transparent', borderRadius: '16px' }}>
      <div className="text-center mb-4">
        <FaUserCircle size={80} style={{ color: '#4e54c8' }} className="mb-2" />
        <h2 className="fw-bold" style={{ color: '#4e54c8' }}>Account Settings</h2>
      </div>
      {loading && !initialValues.name ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize // Update form when initialValues change
        >
          {({ isSubmitting }) => (
            <Form
              className="shadow p-4 rounded"
              style={{ maxWidth: '500px', margin: '0 auto', background: '#fff' }}
            >
              {error && <Alert variant="danger" className="rounded">{error}</Alert>}
              {success && <Alert variant="success" className="rounded">{success}</Alert>}

              {/* Edit Button */}
              {!isEditing && (
                <div className="text-end mb-3">
                  <Button
                    variant="link"
                    onClick={() => setIsEditing(true)}
                    className="p-0"
                    style={{ color: '#4e54c8' }}
                  >
                    <FaEdit size={20} /> Edit
                  </Button>
                </div>
              )}

              {/* Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold" style={{ color: '#4e54c8' }}>
                  Name
                </label>
                {isEditing ? (
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    disabled={isSubmitting || loading}
                  />
                ) : (
                  <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                    {initialValues.name}
                  </div>
                )}
                <ErrorMessage name="name" component="div" className="text-danger mt-1" />
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold" style={{ color: '#4e54c8' }}>
                  Email
                </label>
                {isEditing ? (
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    disabled={isSubmitting || loading}
                  />
                ) : (
                  <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                    {initialValues.email}
                  </div>
                )}
                <ErrorMessage name="email" component="div" className="text-danger mt-1" />
              </div>

              {/* Phone Field */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-bold" style={{ color: '#4e54c8' }}>
                  Phone Number
                </label>
                {isEditing ? (
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    disabled={isSubmitting || loading}
                  />
                ) : (
                  <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                    {initialValues.phone}
                  </div>
                )}
                <ErrorMessage name="phone" component="div" className="text-danger mt-1" />
              </div>

              {/* Back to Dashboard button for md and up */}
              {!isEditing && (
                <div className="d-none d-md-flex justify-content-center mb-3">
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
              )}

              {/* Buttons for Edit Mode */}
              {isEditing && (
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || loading}
                    className="fw-bold flex-grow-1"
                    style={{ backgroundColor: '#4e54c8', border: 'none', borderRadius: '8px' }}
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting || loading}
                    className="fw-bold"
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
      {/* Back to Dashboard button for small devices */}
      {!isEditing && (
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
      )}
    </div>
  );
};

export default AccountSettings;