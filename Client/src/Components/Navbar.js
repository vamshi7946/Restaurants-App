import React from 'react'
//import { useState,useEffect } from 'react';
//import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import './Registration.css';
import { useAuth } from './AuthContext'; // Import the useAuth hook

  function Navbar() {
  //const navigate=useNavigate();
  const { isLoggedIn, setIsLoggedIn, username } = useAuth(); // Use the useAuth hook to access user authentication state
  const handleLogin = async (e) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ isLoggedIn }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        //setIsLoggedIn(data.isLoggedIn)
        //alert(data.message);
        // Redirect or perform actions for successful login
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout =  (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
  };
  console.log(isLoggedIn)


  return (
    <div>
      <div>
      <nav className="navbar navbar-dark sticky-top navbar-expand-lg  bg-body-black">
  <div className="container-fluid">
    <a className="navbar-brand" href="/api"><img src='https://e7.pngegg.com/pngimages/1016/591/png-clipart-chef-chef-cartoon-characters.png' className='navbar-image' alt=''/></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/api">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/api/about">About</a>
        </li>
        <>
        {isLoggedIn ? (
          <>
            <li className="nav-item">
            <a className="nav-link" onClick={handleLogout} href="/api">Logout</a>
          </li>
          <li className="nav-item">
          <a className="nav-link" href='/api/user'>{username}</a>
          </li>
          </>
          ) :(
            <>
        <li className="nav-item">
          <a className="nav-link"  href="/api/login">Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/api/register">Register</a>
        </li>
        </>
          )}
        </>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true" href='/'>Disabled</a>
        </li>
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
      </nav>
      </div>
    </div>
  )
}
export default React.memo(Navbar);