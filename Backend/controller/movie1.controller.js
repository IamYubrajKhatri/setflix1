import User from "../model/user.model.js"

import mongoose from 'mongoose';
import Movie from "../model/movie.model.js";

// Get all movies
export async function getAllMovies(req, res) {
  try {
    const movies = await Movie.find(); // Fetch all movies from MongoDB
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get single movie
export async function getMovieById(req, res)  {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  export async function addMovieToFavorite(req,res){
 
    //data comes from url,used to capture a dynamic segment in url like _id
  const { movieId } = req.body;
  //data comes from response of a body,uded to send data via HTTP method
  try {
    const userId = req.user._id || req.params.userId; 
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure that user.favorite is initialized as an array if not already
    if (!user.favorite) {
      user.favorite = [];
    }

    //user.favourite is a array,include(movieId) checks  if movieId already exists in the array,!means no ---if there is no movie id in the array 
    if (!user.favorite.includes(movieId)) {
      user.favorite.push(movieId); // Add movieId to the favorites array
      await user.save();
    }

    res.status(200).json({ message: 'Favorite added successfully', favorite: user.favorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }

  }

  export async function getUserFavorite(req,res){
    const userId = req.user || req.params.userId; 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
  }
    try {
  
      const user = await User.findById(userId).populate('favorite'); // Populate movie details
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ favorites: user.favorite });
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
    }
  }


  export async function deleteMovieFromUserFavorite(req,res){
    const userId = req.user._id;
      const { movieId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
    

    try {
      
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove movie from favorites
      user.favorite = user.favorite.filter(fav => fav.toString() !== movieId);
      await user.save();
      return res.status(200).json({ favorite: user.favorite,message:'Movie has been removed' });
    } catch (error) {
      return res.status(500).json({ message: 'Error removing movie from favorites', error: error.message });
    }
  }

  export const searchMovies = async (req, res) => {
    try {
        const { query } = req.query; // Extract the query parameter from the request

        // Ensure the query parameter is provided
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // Search logic: Look for movies where name or description matches the query
        const results = await Movie.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Case-insensitive search
                { description: { $regex: query, $options: "i" } },
            ],
        });

        // Respond with the search results
        res.status(200).json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

