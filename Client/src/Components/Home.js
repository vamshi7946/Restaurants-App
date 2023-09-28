import React,{useState} from 'react'
import './Registration.css';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import RestaurantCard from './CardList';
export default function Home() {
  const navigate=useNavigate();
  const [search,setSearch]=useState('');
  const handleSearch= async (e)=>{
    e.preventDefault();
    navigate(`/api/restaurants/search?keyword=${search}`);
  };
  return (
    <div className='main'>
      <div className='d-flex flex-column justify-content-center text-center'>
        <div className='about-card main-container pt-3'>
          <h2 className='main-heading'>Restaurants App</h2>
          <p className='content-para'>Discover the best food & drink</p>
          <form className="d-flex" role="search">
        <input className="form-control me-2 home-search"
        type="search"
        placeholder="Search for restaurant, location or cusine"
        aria-label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSearch} type="submit">Search</button>
      </form>
        </div>
      </div>
      <div>
        <RestaurantCard/>
      </div>
    </div>
  )
}
