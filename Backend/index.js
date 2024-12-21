// const is a variable deklaration
//setflix_db the name of my database :i gave it to my mongodburi before the?
/*const express = require('express');
const dotenv = require('dotenv');
*/

import express from "express";
import path from 'path';

import authRoute from "./route/auth.route.js";
import moviesRoute from "./route/movie1.router.js"
import adminRoute from "./route/admin.route.js"

// Import CORS middleware helps to connet twi different front and backend ports
import cors from 'cors'; 

import { Env_Vars } from "./config/env.Vars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

import cookieParser from "cookie-parser";


const app = express();
const __dirname = path.resolve();


app.use(cors({
  origin: Env_Vars.NODE_ENV === 'production' ? 'https://setflix.azurewebsites.net' : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));


//connect to mongo db
//console.log("Mongouri ", process.env.MongoDBURI); this code shows where is it connected on which uri in console

const PORT=Env_Vars.PORT;

app.use(express.json());// will allow us to use req.body ..for eg i use postman to give the data entry in json format.
app.use(cookieParser());
//we created a variable name authRoutes for the files and imported it above so it goes to specific destination
app.use("/api/auth", authRoute);
app.use("/api/movies",protectRoute,moviesRoute)
app.use("/api/admin", adminRoute);

//this knows where the frontend projekt is stored and where it runs
if(Env_Vars.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"/Frontend/dist")));//now this is our react app

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"Frontend","dist","index.html"))
  })
  
}

/*
app.get('/', (req, res) => {         // / is a home route
  res.send('Hello World! yubraj khatri')
})
*/


//to show on terminal if its actually running or not
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();//function called for a database connection

})