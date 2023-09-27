// ReviewForm.js
import React, { useState } from 'react';
import './Registration.css';
import { useParams } from 'react-router-dom';
function ReviewForm(props) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const username=props.username;
  const { restaurant_id } = useParams();
    console.log(restaurant_id);
  const handleReviewSubmit = async(e) => {
    e.preventDefault();
    console.log(props.username)
    if(!props.username){
      console.log('Login to add review');
    }
    else{
    const reviewData = {username, rating, comment};
    try {
      // Send a POST request to your server to save the review
      const response = await fetch(`/api/restaurants/${restaurant_id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        // Review successfully submitted
        console.log('Review submitted successfully');
      } else {
        // Handle errors here
        console.error('Failed to submit review');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
  }
};

  return (
    <div className='registration-container'>
    <div className='registration-board'>
    <form className="registration-form" onSubmit={handleReviewSubmit}>
        <div>
        <label>Name:</label>
        <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Rating:</label>
        <input type="number" min="0.5" max="5" className="input-field" value={rating} onChange={(e) => setRating(e.target.value)} required />
      </div>
      <div>
        <label>Comment:</label>
        <textarea value={comment} className="input-field" onChange={(e) => setComment(e.target.value)} required />
      </div>
      <button className="submit-button" type="submit">Submit Review</button>
    </form>
    </div>
    </div>
  );
}

export default ReviewForm;
