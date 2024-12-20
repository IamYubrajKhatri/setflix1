import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import ReactPlayer from "react-player"; // Import  ReactPlayer
import axios from "axios";
import useAuthCheck from './AuthCheck';



function VideoPlayer() {
  const { id } = useParams(); // Extract the movie ID from the URL
  const [movie, setMovie] = useState(null); // State to store movie details
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useAuthCheck(); // Check if the user is authenticated
 

  useEffect(() => {

    // Fetch movie details from the backend
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`); 
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to fetch movie details");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); // Re-run if the ID changes



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


  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <h2>{error}</h2>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/movies")}
        >
          Go Back to Movies
        </button>
      </div>
    );
  }




  
  if (!movie) {
    return (
      <div className="text-center mt-20">
        <h2>No movie selected!</h2>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/movies")}
        >
          Go Back to Movies
        </button>
      </div>
    );
  }
   // Function to determine if the URL is an MP4 file
   const isMP4 = (url) => {
    return url.endsWith(".mp4");
  };

  return (
    <>
   
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 bg-white p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mt-20 ">{movie.name}</h2>
        <p className="my-8 text-gray-600">{movie.description}</p>
      </div>

      <div className="flex justify-center">
        {/* Check if the video is an MP4 file */}
        {isMP4(movie.videoUrl) ? (
          // Use the <video> element for MP4 files
          <video
            src={movie.videoUrl}
            controls
            width="100%"
            height="100%"
          />
        ) : (
          // Use ReactPlayer for non-MP4 videos (e.g., YouTube)
          <ReactPlayer
            url={movie.videoUrl}
            controls
          />
        )}
      </div>

      <div className="text-center mt-8">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/movies")}
        >
          Back to Movies
        </button>
      </div>
    </div>
    </>
  );

}

export default VideoPlayer;
