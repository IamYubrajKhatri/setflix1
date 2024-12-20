import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Cards({ item }) {
  const [isFavorite, setIsFavorite] = useState(false); // Track whether the movie is a favorite
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle clicking the heart icon
  const handleFavoriteClick = async () => {
    setIsLoading(true); // Set loading to true while waiting for API response
    try {
      if (isFavorite) {
        // If already a favorite, remove from favorites
        const response = await axios.delete(
          `/api/movies/favorites/${item._id}`, // Use backticks for dynamic value
          {
            data: { movieId: item._id }, // Send movieId in the body
            withCredentials: true, // Send JWT with request
          }
        );

        if (response.status === 200) {
          setIsFavorite(false); // Update UI state to reflect removal
          toast.success('Removed from favorites');
        }
      } else {
        // If not a favorite, add to favorites
        const response = await axios.post(
          '/api/movies/favorites',
          { movieId: item._id }, // Send movieId in the body
          { withCredentials: true } // Send JWT with request
        );

        if (response.status === 200) {
          setIsFavorite(true); // Update UI state to reflect addition
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false); // Set loading to false after API call
    }
  };

  const heartIcon = (
    <div>
      <button className="btn btn-error">
        <Heart size={20} color= 'white' />
      </button>
    </div>
  );

  return (
    <div className="my-4 p-3">
      <div className="card bg-base-300 p-3 shadow-xl mx-1 hover:scale-105 duration-200">
        <figure>
          <img src={item.image} alt="Imagemovie" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p>{item.description}</p>
          <div className="card-actions justify-between">
            <button
              className="hover:text-black"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={handleFavoriteClick}
              disabled={isLoading} // Disable button while loading
            >
              {heartIcon}
            </button>
            <button
              className="btn btn-error text-white hover:text-black"
              onClick={() =>
                navigate(`/video-player/${item._id}`, { state: { movie: item } })
              } // Use backticks for template literals
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;
