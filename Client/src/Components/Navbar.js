import React from 'react'
import { useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import './Registration.css';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

  function Navbar(props) {
  const navigate=useNavigate();
  //const { isLoggedIn, setIsLoggedIn, username } = useAuth(); // Use the useAuth hook to access user authentication state
  const [search,setSearch]=useState('');

  const handleLogout = () => {
    props.setUsername(null);
    props.setSuperUser(false);
    props.onLogout();
  };

  const handleSearch= async (e)=>{
    e.preventDefault();
    navigate(`/api/restaurants/search?keyword=${search}`);
  };


  return (
    <div>
      <div>
      <nav className="navbar navbar-dark sticky-top navbar-expand-lg  bg-body-black">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/api"><img src='https://e7.pngegg.com/pngimages/1016/591/png-clipart-chef-chef-cartoon-characters.png' className='navbar-image' alt=''/></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto  mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/api">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/api/about">About</Link>
        </li>
        {props.isAuthenticated ? (
          <>
            <li className="nav-item">
            <Link className="nav-link" onClick={handleLogout} to="/api">Logout</Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to='/api/user'>{props.username}</Link>
          </li>
          </>
          ) :(
            <>
        <li className="nav-item">
          <Link className="nav-link"  to="/api/login">Login</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/api/register">Register</Link>
        </li>
        </>
          )}
        <li className="nav-item">
          <Link className="nav-link disabled" aria-disabled="true" to='/'>Disabled</Link>
        </li>
        {props.superUser?(
        <li className="nav-item">
        <Link className="nav-link" to="/api/edit">Edit</Link>
      </li>
      ):""}
      </ul>
      {/* <form className="d-flex" role="search">
        <input className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-success" onClick={handleSearch} type="submit">Search</button>
      </form> */}
    </div>
  </div>
      </nav>
      </div>
    </div>
  )
}
export default Navbar;