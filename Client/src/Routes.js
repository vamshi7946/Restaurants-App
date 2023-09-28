import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './Components/RegistrationForm';
import Home from './Components/Home';
import Login from './Components/Login';
import About from './Components/About';
import ResetPasswordForm from './Components/ResetForm';
import Navbar from './Components/Navbar';
import { useState } from 'react';
import IndividualRestaurantPage from './Components/IndividualRestaurantPage';
import OTPConfirmation from './Components/OTPConfirmation';
import { AuthProvider } from './Components/AuthContext';
import SearchRestaurantList from './Components/Search';
import ReviewForm from './Components/ReviewForm';
import EditForm from './Components/EditForm';
//import { useAuth } from './Components/AuthContext';


export default function Routers() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username,setUsername]=useState(null);
  const [superUser,setSuperUser]=useState(false)
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(null);
  };
  //const { isLoggedIn, username,setUsername, setIsLoggedIn } = useAuth();

  //const [isLoggedIn,setIsLoggedIn]=useState(false)


  return (
    <div>
    <Router>
    <Navbar  superUser={superUser} setSuperUser={setSuperUser} isAuthenticated={isAuthenticated} username={username} setUsername={setUsername} onLogout={handleLogout}/>
      <Routes>
        <Route path="/api" element={<Home/>}/>
        <Route path='/api/about' element={<About/>}/>
        <Route path="/api/register" element={<RegistrationForm/>}/>
        <Route path="/api/reset-password" element={<ResetPasswordForm/>}/>
        <Route path="/api/otp-confirmation" element={<OTPConfirmation/>}/>
        <Route path="/api/edit" element={<EditForm/>}/>
        <Route path="/api/restaurants/:restaurant_id/reviews" element={<ReviewForm username={username}/>}/>
        <Route path="/api/restaurants/search" element={<SearchRestaurantList/>}/>
        <Route path="/api/restaurants/:id/details" element={<IndividualRestaurantPage/>} />
        <Route path="/api/login" element={<Login setSuperUser={setSuperUser} setUsername={setUsername} onLogin={handleLogin}/>}/>
      </Routes>
    </Router>
    </div>
  )
}
