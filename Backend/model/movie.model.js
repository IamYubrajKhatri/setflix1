import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image:{ type:String},
  type:{ type:String},
  videoUrl: { type: String,
    required: true,
   }, // URL for video (YouTube or local)
  createdAt: { type: Date, default: Date.now },
 
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
