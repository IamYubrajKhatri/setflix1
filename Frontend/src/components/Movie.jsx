import React from 'react'
import Cards from './Cards'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import useAuthCheck from './AuthCheck';
import axios from 'axios';
import { useState,useEffect } from 'react';


function Movie() {
  const isAuthenticated = useAuthCheck(); // Check if the user is authenticated
  

  // State for movies fetched from the backend
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from the backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies/"); 
        setMovies(response.data); // Assuming the API returns an array of all movies
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array ensures it runs once on component mount


// Handle delete request
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/admin/delete-video/`); // Backend endpoint for deletion
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id)); // Update state
    } catch (err) {
      console.error("Error deleting movie:", err);
      setError("Failed to delete movie");
    }
  };


  // If the user is not authenticated, return a message or a redirect.
  if (isAuthenticated === false) {
    return (
      <div className="text-center mt-20">
        <h2>You are not authorized. Please log in to access this page.</h2>
      </div>
    );
  }
  // If the authentication status is still loading, we can display a loading message or spinner.
  if (isAuthenticated === null) {
    return (
      <div className="text-center mt-20">
        <h2>Loading...</h2>
      </div>
    );
  }


// Filter movies based on price
  const filterData=movies.filter((data)=> data.price === "Free");
  const filterDataB=movies.filter((data)=> data.price === "Buy");

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },

      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  {/* All for sliders*/}
  return (
    <>
    <div className='max-w-screen-2xl container mx-auto md:px-20 px-4 bg-white'>
      <div>
      <h2 className='mt-20 text-center text-2xl font-bold '>Trending</h2>
      <hr />
      <div className=''>
      <Slider {...settings}>
      {filterDataB.map((item)=>(
          <Cards item={item} key={item._id} onDelete={handleDelete}/> // Use _id as key if MongoDB is used
        ))}
        </Slider>
      </div>
      </div>
      <br />
      <br />
      <div>
      <h2 className=' text-center text-2xl font-bold '>Action</h2>
      <hr />
      <div className=''>
      <Slider {...settings}>
      {filterData.map((item)=>(
          <Cards item={item} key={item._id} onDelete={handleDelete}/> 
        ))}
        </Slider>
      </div>
      </div>


    </div>
    </>
    
  )
}

export default Movie
//this page takes all the movies from backend and bring it together with cards and sliders.