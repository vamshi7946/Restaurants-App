// RestaurantDetail.js
import React from 'react';
import './IndividualRestaurant.css'
import ReviewForm from './ReviewForm';
function RestaurantDetail({ restaurant }) {
  console.log(restaurant)
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
        <h4>Add a Review</h4>
        <a href={`/api/restaurants/${restaurant.restaurant.RestaurantID}/reviews`}>Add Review</a>
      </div>
        </div>
    </div>
  );
}

export default RestaurantDetail;
