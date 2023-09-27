// OTPConfirmation.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OTPConfirmation() {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get('email');
  const userParam = searchParams.get('username')  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request to verify the OTP
    try {
      const data = {
        email:emailParam,
        username:userParam,
        otp:parseInt(otp),
      };
      console.log(data);
      const response = await fetch(`/api/otp-confirmation?email=${data.email}&username=${data.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        // OTP verification successful, you can redirect or show a success message
        console.log('OTP verification successful');
        alert('OTP verification successful');
        navigate('/api/login'); // Redirect to the login page or wherever needed
      } else {
        // Handle OTP verification failure
        console.error('OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  return (
    <div className='registration-container'>
      <div className='registration-board'>
      <form className="registration-form"  onSubmit={handleSubmit}>
      <h2>OTP Confirmation</h2>
          <div>
          <label>Enter OTP:</label>
          <input
          className='input-field'
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">Verify OTP</button>
      </form>
      </div>
    </div>
  );
}

export default OTPConfirmation;
