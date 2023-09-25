import React, { useState } from 'react';
import './Registration.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import ResetPasswordForm from './ResetForm';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';



function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn, setUsername } = useAuth(); // Accessing authentication state and functions
  // const [resetEmail, setResetEmail] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const navigate = useNavigate(); // Initialize history



  const handleLogin = async (e) => {
    e.preventDefault();
        alert(`Logged in with email: ${email} and Password: ${password}`);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setIsLoggedIn(true);
        //console.log(data);
        setUsername(data.username);
        alert(data.message);
        navigate('/api')
        // Redirect or perform actions for successful login
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const handlePasswordReset = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Send a request to your backend to initiate the password reset process
  //     const response = await fetch('/password-reset-request', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email: resetEmail }),
  //     });

  //     if (response.status === 200) {
  //       alert('Password reset email sent');
  //       // Add logic here to handle the email sent confirmation
  //     } else {
  //       const data = await response.json();
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  return (
    <div className="login-container">
      <div className='login-board'>
        {showLoginForm && (
         <form  className='registration-form' method='POST' onSubmit={handleLogin}>
          <h2>Login</h2>
         <label htmlFor="email">Email:</label>
         <input
           type="text"
           id="email"
           className="input-field"
           value={email}
           onChange={(e) => setemail(e.target.value)}
           required
         />
         <br />
         <label htmlFor="password">Password:</label>
         <input
           type="password"
           id="password"
           className="input-field"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
         />
         <br />
         <input type="submit" value="Login" />
         <Link className='mx-3' to="/api/reset-password">Forgot your password?</Link>
       </form>
        )}
        {!showLoginForm && showPasswordResetForm && (
          <div>
            <ResetPasswordForm/>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
