// RegistrationForm.js

import React, { useState } from 'react';
import './Registration.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router

function RegistrationForm() {
  const [formData, setFormData] = useState({ username:'' ,email: '', password: '' });
  const navigate = useNavigate(); // Initialize history

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data={username:formData.username,email:formData.email,password:formData.password}
//     console.log(data);
//     // Send a POST request to register the user with formData
//     try {
//         const response = await fetch('/api/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//         });
    
//         if (response.status === 201) {
//           // Registration successful, you can redirect or show a success message
//           console.log('User registered successfully');
//           alert('User registered successfully')
//           navigate('/api/login')
//         } else if (response.status === 400) {
//           // Handle validation or duplicate email errors
//           console.error('User registration failed: Invalid data or duplicate email');
//         } else {
//           // Handle other registration errors
//           console.error('User registration failed');
//         }
//       } catch (error) {
//         console.error('Registration error:', error);
//       }    
    
// };

const handleSendOTP = async (e) => {
  e.preventDefault();
  try {
    // Prepare the request data
    const data = {
      email: formData.email,
      username: formData.username,
      password:formData.password,
    };

    // Send a POST request to the server to send OTP
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log('successful');
      // Navigate to the OTP confirmation page with the email as a parameter
      navigate(`/api/otp-confirmation?email=${responseData.email}&username=${responseData.username}`);
    } else if (response.status === 400) {
      // Handle error: OTP sending failed due to invalid email or other reasons
      console.error('OTP sending failed');
    } else {
      // Handle other errors
      console.error('An error occurred while sending OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};


  return (
    <div className='registration-container'>
        <div className='registration-board'>
    <form className="registration-form" onSubmit={handleSendOTP}>
    <h2>Register</h2>
    <input
        type="text"
        placeholder="UserName"
        className="input-field"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="input-field"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        required
      />
      <button type="submit"className="submit-button">
        Register
      </button>
    </form>
    </div>
    </div>
  );
}

export default RegistrationForm;
