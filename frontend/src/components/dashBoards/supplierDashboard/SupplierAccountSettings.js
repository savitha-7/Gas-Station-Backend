import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { BiUser, BiEnvelope, BiPhone, BiMap, BiEdit } from 'react-icons/bi';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // Replace with your actual base URL
const SELLER_ID = Cookies.get('authTokenSellerId'); // Replace with dynamic ID from auth context

const SupplierAccountSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '', // Maps to location (pincode + cityName)
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [initialImagePreview, setInitialImagePreview] = useState(null); // Store initial image URL
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch supplier details and image on mount
useEffect(() => {
  const fetchSupplierData = async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      if (!authToken) {
        throw new Error('No auth token found. Please log in again.');
      }

      // Fetch supplier details
      const detailsResponse = await axios.get(`${BASE_URL}/api/seller/${SELLER_ID}`, {
        headers: { Authorization: `${authToken}` }, // Add token to match image call
      });
      console.log('Supplier Details Response:', detailsResponse.data); // Debug API response
      const supplier = detailsResponse.data;
      const newFormData = {
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone?.toString() || '',
        address: supplier.location?.[0]
          ? `${supplier.location[0].cityName}, ${supplier.location[0].pincode}`
          : '',
      };
      setFormData(newFormData);
      console.log('Set formData:', newFormData); // Debug state update

      // Fetch supplier image
      const imageResponse = await axios.get(`${BASE_URL}/api/seller/image/${SELLER_ID}`, {
        headers: { Authorization: `${authToken}` },
      });
      console.log('Image Response:', imageResponse.data); // Debug image response
      const imageUrl = imageResponse.data.url || `${BASE_URL}/api/seller/image/${SELLER_ID}`; // Use response URL if available
      setImagePreview(imageUrl);
      console.log('Set imagePreview:', imageUrl); // Debug state update

    } catch (err) {
      setError('Failed to load supplier data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchSupplierData();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update image if changed
      const imageFormData = new FormData();
      imageFormData.append('image', image);
      const imageResponse = await axios.put(
        `${BASE_URL}/api/seller/image/`,
        imageFormData,
        {
          headers: {
            Authorization: `${Cookies.get('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (imageResponse.data.imageUrl) {
        setImagePreview(imageResponse.data.imageUrl);
        setInitialImagePreview(imageResponse.data.imageUrl); // Update initial image URL
        setImage(null); // Clear selected image
        setSuccess('Image uploaded successfully!');
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {

      setLoading(false);
      window.location.reload();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update supplier details (assumed API)
      const [cityName, pincode] = formData.address.split(',').map((s) => s.trim());
      await axios.put(
        `${BASE_URL}/api/seller/update`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: [{ cityName, pincode: parseInt(pincode) || 0 }],
        },
        {
          headers: { Authorization:  `${Cookies.get('authToken')}` },
        }
      );

      setSuccess('Account details updated successfully!');
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      setError('Failed to update details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImage(null);
    setImagePreview(initialImagePreview); // Revert to initial image URL
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <BiUser size={60} className="mb-2" style={{ color: '#4e54c8' }} />
        <h2 className="fw-bold" style={{ color: '#4e54c8' }}>
          Supplier Account Settings
        </h2>
      </div>
      {loading && !formData.name ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ color: '#4e54c8' }} />
        </div>
      ) : (
        <Form
          onSubmit={handleSubmit}
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
                <BiEdit size={20} /> Edit
              </Button>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-4 text-center">
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '120px',
                height: '120px',
              }}
            >
              <img
                src={imagePreview || 'https://via.placeholder.com/120x120?text=Profile'}
                alt="Profile Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e9ecef',
                }}
              />
              {isEditing && (
                <>
                  <Form.Label
                    htmlFor="profile-image-upload"
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer',
                      border: '2px solid #4e54c8',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <span role="img" aria-label="upload" style={{ fontSize: '1.2rem' }}>
                      📷
                    </span>
                  </Form.Label>
                  <Form.Control
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                </>
              )}
            </div>
            <div className="small text-muted mt-2">Upload profile image (max 5MB)</div>
            {isEditing && (
              <Button
                variant="secondary"
                onClick={
                    handleImageSubmit}
                disabled={loading || !image}
                className="mt-2 fw-bold"
                style={{ borderRadius: '8px', backgroundColor: '#6c757d', border: 'none' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </Button>
            )}
          </div>

          {/* Name Field */}
          <div className="mb-3">
            <Form.Label className="fw-bold" style={{ color: '#4e54c8' }}>
              <BiUser className="me-2" />
              Company Name
            </Form.Label>
            {isEditing ? (
              <InputGroup>
                <InputGroup.Text style={{ background: '#4e54c8', color: '#f8f9fa' }}>
                  <BiUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                  style={{ borderRadius: '0 8px 8px 0' }}
                  disabled={loading}
                />
              </InputGroup>
            ) : (
              <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                {formData.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <Form.Label className="fw-bold" style={{ color: '#4e54c8' }}>
              <BiEnvelope className="me-2" />
              Email
            </Form.Label>
            {isEditing ? (
              <InputGroup>
                <InputGroup.Text style={{ background: '#4e54c8', color: '#f8f9fa' }}>
                  <BiEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  style={{ borderRadius: '0 8px 8px 0' }}
                  disabled={loading}
                />
              </InputGroup>
            ) : (
              <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                {formData.email}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-3">
            <Form.Label className="fw-bold" style={{ color: '#4e54c8' }}>
              <BiPhone className="me-2" />
              Phone
            </Form.Label>
            {isEditing ? (
              <InputGroup>
                <InputGroup.Text style={{ background: '#4e54c8', color: '#f8f9fa' }}>
                  <BiPhone />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  style={{ borderRadius: '0 8px 8px 0' }}
                  disabled={loading}
                />
              </InputGroup>
            ) : (
              <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                {formData.phone}
              </div>
            )}
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <Form.Label className="fw-bold" style={{ color: '#4e54c8' }}>
              <BiMap className="me-2" />
              Address (City, Pincode)
            </Form.Label>
            {isEditing ? (
              <InputGroup>
                <InputGroup.Text style={{ background: '#4e54c8', color: '#f8f9fa' }}>
                  <BiMap />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter city, pincode"
                  style={{ borderRadius: '0 8px 8px 0' }}
                  disabled={loading}
                />
              </InputGroup>
            ) : (
              <div className="form-control bg-light" style={{ borderRadius: '8px' }}>
                {formData.address}
              </div>
            )}
            <Form.Text className="text-muted">
              Format: City, Pincode (e.g., Bangalore, 560001)
            </Form.Text>
          </div>

          {/* Buttons for Edit Mode */}
          {isEditing && (
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="fw-bold flex-grow-1"
                style={{ backgroundColor: '#4e54c8', border: 'none', borderRadius: '8px' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleCancel}
                disabled={loading}
                className="fw-bold"
                style={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Back to Dashboard Button */}
          <div className="d-flex justify-content-center mt-2">
            <Button
              variant="outline-secondary"
              className="fw-bold d-flex align-items-center"
              style={{ borderRadius: '8px', gap: '0.5rem' }}
              onClick={() => navigate('/supplier/dashboard')}
            >
              <BiArrowBack size={20} /> Back to Dashboard
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default SupplierAccountSettings;