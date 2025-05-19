import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import notFound from "../assets/not-found.png";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-dark" style={{ background: 'transparent'}}>
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} className="d-flex flex-column align-items-center">
        <img
          src={notFound}
          alt="Not Found"
          style={{
            maxWidth: '400px',
            width: '70vw',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        />
        <p className="m-3 mb-4 text-center">
          Sorry, the page you are looking for does not exist.
        </p>
        <Button
          className="px-4 py-2 fw-bold"
          style={{ backgroundColor: '#4e54c8', color: '#fff', borderRadius: '20px' }}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
