
/*
mongo db _clustero-username yubrajkhatri
password: nR8ehGCzdCwAr3tV 

mongo uri : mongodb+srv://yubrajkhatri:<db_password>@cluster0.twv65.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

*/

import mongoose from "mongoose";
import { Env_Vars } from "./env.Vars.js";

export const connectDB = async () => {
try {
    const conn = await mongoose.connect(Env_Vars.MongoDBURI)
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Error: ", error);
    process.exit(1);// o -successfull  1- faliur
    
}
}