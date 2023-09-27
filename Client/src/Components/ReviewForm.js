// ReviewForm.js
import React, { useState } from 'react';
import './Registration.css';
function ReviewForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleReviewSubmit = async(e) => {
    e.preventDefault();
    const reviewData = { name, rating, comment };
    try {
      // Send a POST request to your server to save the review
      const response = await fetch(`/api/restaurants/reviews`, {
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

    // Validate inputs here if needed

    // Call the onSubmit function with the review data
    onSubmit({ name, rating, comment });

    // Clear the form inputs
    setName('');
    setRating('');
    setComment('');
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
      <button type="submit">Submit Review</button>
    </form>
    </div>
    </div>
  );
}

export default ReviewForm;
