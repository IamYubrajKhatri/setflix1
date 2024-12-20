import React from 'react'
import { useState,useEffect } from 'react';
import useAuthCheck from './AuthCheck';
import Cards from './Cards';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';

function Favourite() {
  const { userId } = useParams(); // Extract the user ID from the URL
     useAuthCheck();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


    

  useEffect(() => {
    // Fetch the user's favorite movies when the component loads
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/api/movies/favorites/{:userId}', {
          withCredentials: true, // Send the JWT cookie
        });

        if (response.status === 200) {
          setFavorites(response.data.favorites); // Set the fetched favorites in state
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <p>Loading your favorite movies...</p>;
  }

     
  return (
    <>
    <div className='max-w-screen-2xl container mx-auto  md:px-20 px-4 bg-white m-20'>
        <h2 className=' text-2xl font-bold text-center  '>Your Favourites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {favorites.map((item) => (
          <Cards key={item.id} item={item} />
        ))}
      </div>
        
    </div>
      
    </>
  )
}

export default Favourite