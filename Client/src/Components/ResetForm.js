// ResetPasswordForm.js
import React, { useState } from 'react';
import './Registration.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
function ResetPasswordForm({ onResetSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    newPassword:'',
  });
  const navigate = useNavigate(); // Initialize history

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (onResetSuccess) {
          onResetSuccess();
        }
        navigate('/api/login')
      } else {
        throw new Error('Reset password failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className='registration-container'>
        <div className='registration-board'>
      <div className='registration-form'>
      <h2>Reset Password</h2>
      <input type="text" name="email" className='input-field' placeholder="Email" onChange={handleInputChange} />
      <input type="password" name="newPassword" className='input-field' placeholder="newPassword" onChange={handleInputChange}/>
      <button onClick={handleResetPassword}>Reset Password</button>
      </div>
      </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
