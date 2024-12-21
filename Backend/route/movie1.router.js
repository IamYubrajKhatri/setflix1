import express from "express";
import { getAllMovies,getMovieById, addMovieToFavorite, getUserFavorite,deleteMovieFromUserFavorite, searchMovies } from "../controller/movie1.controller.js";
const router = express.Router();

// Routes
router.get('/',getAllMovies); // Fetch all movies
router.get('/search',searchMovies); // search movies
router.get('/:id',getMovieById); // Fetch a specific movie by ID
router.post('/favorites',addMovieToFavorite)//add movie to favourite
router.get('/favorites/:userId',getUserFavorite)//show all favourite
router.delete('/favorites/:id',deleteMovieFromUserFavorite)//delete a movie fromfavourite

export default router;
