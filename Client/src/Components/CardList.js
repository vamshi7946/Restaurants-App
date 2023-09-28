// RestaurantCard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Registration.css';
function RestaurantCard() {
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
      // Fetch data from your Node.js server's API endpoint
      fetch('/api')
        .then((response) => response.json())
        .then((data) => setRestaurants(data))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);
  return (
    <div>
      <div className="card-container">
        {restaurants.map((restaurant) => (
          <div key={restaurant.RestaurantId} className="card card-div">
                <img src={restaurant.images} className="card-img-top home-images" alt="..."/>
                <div className="card-body">
                  <h5 className="card-title">{restaurant.Name}</h5>
                  <p className="card-text">{restaurant.Location}</p>
                  <Link to={`/api/restaurants/${restaurant.RestaurantID}/details`} className="btn btn-primary">Enter Restaurant</Link>
                </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantCard;
