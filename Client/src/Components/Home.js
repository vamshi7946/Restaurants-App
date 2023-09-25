import React from 'react'
import './Registration.css';
import Navbar from './Navbar';
import RestaurantCard from './CardList';
export default function Home() {
  return (
    <div className='main'>
      <div className='d-flex flex-column justify-content-center'>
        <div className='main-container pt-3'>
          <h2 className='main-heading'>Welocome To Our App</h2>
          <p className='content-para'>All the restaurants and their variety of menu can be available here</p>
          <p className='content-para'>Enjoy your food.</p>
        </div>
      </div>
      <div>
        <RestaurantCard/>
      </div>
    </div>
  )
}
