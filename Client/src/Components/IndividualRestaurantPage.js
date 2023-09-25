// IndividualRestaurantPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantDetail from './RestaurantDetail'; // Import the RestaurantDetail component

function IndividualRestaurantPage() {
  // Use the useParams hook to get the restaurant ID from the URL
  const { id } = useParams();
    console.log(id);
  // State to store the restaurant data
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    // Function to fetch restaurant data based on the ID
    async function fetchRestaurantData() {
      try {
        // Replace this with your actual API fetch code to retrieve restaurant data
        const response = await fetch(`/api/restaurants/${id}`); // Assuming your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setRestaurantData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Call the fetchRestaurantData function to retrieve restaurant data
    fetchRestaurantData();
  }, [id]); // Make sure to include 'id' as a dependency to refetch when the ID changes

  if (!restaurantData) {
    return <div>Loading...</div>;
  }

  return <RestaurantDetail restaurant={restaurantData} />;
}

export default IndividualRestaurantPage;
