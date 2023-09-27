import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Registration.css'
function SearchRestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await fetch(`/api/restaurants/search?keyword=${keyword}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No need to include a body in a GET request
        });
  
        if (response.status===200) {
          const responseData = await response.json();
          setRestaurants(responseData);
        } else {
          console.log("Handle HTTP error responses");
        }
      } catch (error) {
        console.log('Error sending data: ' + error.message);
      }
    };
    sendData();
  }, [keyword]);
  
  

  return (
    <div className='search-container'>
      <h1 className='text-center' >Restaurant List</h1>
      <div className="card-container">
        {restaurants.map((restaurant) => (
          <div key={restaurant.RestaurantId} className="card card-div">
          <img src={restaurant.images} className="card-img-top home-images" alt="..."/>
          <div className="card-body">
            <h5 className="card-title">{restaurant.Name}</h5>
            <p className="card-text">{restaurant.Location}</p>
            <a href={`/api/restaurants/${restaurant.RestaurantID}/details`} className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

export default SearchRestaurantList;
