// RestaurantDetail.js
import React from 'react';
import './IndividualRestaurant.css'
import { Link } from 'react-router-dom';
function RestaurantDetail({ restaurant }) {
  return (
      <div className="Individual-details">
        <div>
        <img src={restaurant.restaurant.images} className="restaurant-image text-center" alt="..." />
        </div>
        <div className="Individual-details-content mt-4">
          <h5 className="card-title">{restaurant.restaurant.name}</h5>
          <p className="card-text">{restaurant.restaurant.location}</p>
          <div className='menu-items'>
            <h5 className=''>Menu Items</h5>
            <ul>
              {restaurant.menuItems.map((menu)=>(
                <div key={menu.MenuItemID} className='menu-align'>
                  <div className='menu-image-container'>
                    <img src={menu.item_url} className='menu-item-image' alt=''/>
                  </div>
                  <div>
                  <h5>{menu.Name}</h5>
                  <h>{menu.Description}</h>
                  <p>Price : ${menu.Price}</p>
                  </div>
                  <hr/>
                </div>
              ))}
            </ul>
          </div>
          <div className='review-container' >
            <div className='review-section'>
            <p>Reviews</p>
            <ul>
            {restaurant.reviews.map((review) => (
            <li key={review.ReviewID}>
            <p><strong>{review.CustomerName}</strong> Rating: {review.Rating} {review.Comment} </p>
            </li>
            ))}
            </ul>
            </div>
            <div className="add-review-section">
        <Link className="submit-button" to={`/api/restaurants/${restaurant.restaurant.RestaurantID}/reviews`}>Add Review</Link>
      </div>
          </div>
        </div>
    </div>
  );
}

export default RestaurantDetail;
