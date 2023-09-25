// RestaurantDetail.js
import React from 'react';

function RestaurantDetail({ restaurant }) {
  return (
    <div>
      <div className="card card-div">
        <img src={restaurant.images} className="card-img-top home-images" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{restaurant.Name}</h5>
          <p className="card-text">{restaurant.Location}</p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
      {/* Add more restaurant-specific information as needed */}
    </div>
  );
}

export default RestaurantDetail;
