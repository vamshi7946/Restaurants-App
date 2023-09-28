import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './EditForm.css';
export default function EditForm() {
  const [alterRestaurant_id,setAlterRestaurant_id]=useState('');
  const [deleteRestaurant_id,setDeleteRestaurant_id]=useState('');
  const onDelete=async(e)=>{
    e.preventDefault();
    try{
      const response = await fetch('/api/edit', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({deleteRestaurant_id}),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Redirect or perform actions for successful login
      } else {
        const data = await response.json();
        alert('data.message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
    <h2 className='text-center welcome-text'>Welcome Super User! How do you do..</h2>
    <div className='edit-container'>
      <div className='edit-inner-container'>
      <div className=' card edit-inner-card registration-form'>
      <h2 className='edit-card-heading'>Add the restaurant</h2>
        <p>To add restaurant you need to gather all the information regarding that restaurant and add when it is trust worthy.</p>
        <Link to={'/api/addRestaurant'} className='btn btn-primary'>Add Restaurant</Link>
      </div>
      <div className=' card edit-inner-card registration-form'>
      <h2 className='edit-card-heading'>Alter the restaurant</h2>
        <p>To alter the restaurant details enter the restaurant id here</p>
        <label htmlFor='alter-restaurant_id'>RestaurantID:</label>
        <input 
        className='input-field'
        type='text'
        value={alterRestaurant_id}
        id='alter-restaurant_id'
        onChange={(e) => setAlterRestaurant_id(e.target.value)}
        placeholder='Enter restaurant Id'
        required
        />
        <Link to={`/api/restaurants/${alterRestaurant_id}`} className='btn btn-primary'>Alter Restaurant</Link>
      </div>
      <div className='card edit-inner-card registration-form'>
        <h2 className='edit-card-heading'>Delete the restaurant</h2>
        <p>To delete a restaurant please enter the restaurant id below:</p>
        <label htmlFor='delete-restaurant_id'>RestaurantID:</label>
        <input 
        className='input-field'
        type='text'
        value={deleteRestaurant_id}
        id='delete-restaurant_id'
        onChange={(e) => setDeleteRestaurant_id(e.target.value)}
        placeholder='Enter restaurant Id'
        required
        />
        <button onClick={onDelete} className='btn btn-primary'>Delete Restaurant</button>
        </div>
      </div>
    </div>
    </>
  )
}
