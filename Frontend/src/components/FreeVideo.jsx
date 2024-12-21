import React from 'react'
{/* All for sliders*/}
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useState,useEffect } from 'react';
import axios from 'axios';
import CardsViewOnly from './CardsViewOnly';
function FreeVideo() {

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

  const filterData=movies.filter((data)=> data.price === "Free");


   
{/* All for sliders*/}
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
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


  return (
    <>
      <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
       
       <div>
       <h1 className='font-semibold text-xl pb-2' >Now Showing Content</h1>
        <p>After logging in, you can instantly access a wide selection of movies available to watch right now. From thrilling blockbusters to heartwarming dramas and binge-worthy series, enjoy uninterrupted streaming. Explore curated favorites, browse trending titles, and dive into exclusive content tailored for you—all accessible the moment you're logged in!
        </p>
        </div> 
      
      {/* All for sliders*/}
      <div>
      <Slider {...settings}>
        {filterData.map((item)=>(
          <CardsViewOnly item={item} key={item._id}/> 
        ))}
      </Slider>
      </div>
      </div>
    </>
  )
}

export default FreeVideo
