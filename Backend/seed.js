import mongoose from "mongoose";
import Movie from "./model/movie.model.js";
const seedMovies =[
    {
        "id":1,
        "name":"Titanic",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Buy",
        "videoUrl":"myVideo.mp4"
    },
    {
        "id":2,
        "name":"Titanic2",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Buy",
        "videoUrl": "/videos/inception.mp4"

    },
        {"id":3,
        "name":"Titanic3",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Buy",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    },
    {
        "id":4,
        "name":"Titanic4",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Free",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    },
    {
        "id":5,
        "name":"Titanic5",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Free",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    },
    {
        "id":6,
        "name":"Titanic6",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Free",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    },
    {
        "id":7,
        "name":"Titanic7",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Free",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    },
    {
        "id":8,
        "name":"Titanic8",
        "image":"https://saarlouis.my-movie-world.de/images/Breite_235px_RGB/p_19228.jpg",
        "description":"Titanic is a 1997 American epic romantic disaster film directed, written, co-produced and co-edited by James Cameron. ",
        "price":"Free",
        "videoUrl":"https://www.youtube.com/watch?v=6stlCkUDG_s&list=PL4Gr5tOAPttLOY9IrWVjJlv4CtkYI5cI_&ab_channel=FreeHDvideos-nocopyright"

    }

];
// Seed Function
const seedDatabase = async () => {
    try {
//connect to database
await mongoose.connect("mongodb+srv://yubrajkhatri:nR8ehGCzdCwAr3tV@cluster0.twv65.mongodb.net/setflix_db?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
  
      // Clear existing data
      await Movie.deleteMany({});
      console.log("Cleared old movies");
  
      // Insert new data
      await Movie.insertMany(seedMovies);
      console.log("Inserted seed movies");
  
      // Close connection
      mongoose.connection.close();
      console.log("Database seeding completed");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  
  seedDatabase();