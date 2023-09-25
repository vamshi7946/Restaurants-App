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
import { useAuth } from './Components/AuthContext';


export default function Routers() {
  //const { isLoggedIn, username,setUsername, setIsLoggedIn } = useAuth();

  //const [isLoggedIn,setIsLoggedIn]=useState(false)

  //const [username,setUsername]=useState('');

  return (
    <AuthProvider>
    <div>
    <Navbar/>
    <Router>
      <Routes>
        <Route path="/api" element={<Home/>}/>
        <Route path='/api/about' element={<About/>}/>
        <Route path="/api/register" element={<RegistrationForm/>}/>
        <Route path="/api/reset-password" element={<ResetPasswordForm/>}/>
        <Route path="/api/otp-confirmation" element={<OTPConfirmation/>}/>
        <Route path="/api/restaurants/:id" element={<IndividualRestaurantPage/>} />
        <Route path="/api/login" element={<Login />}/>
      </Routes>
    </Router>
    </div>
    </AuthProvider>
  )
}
