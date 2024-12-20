//to protect the route we have to decode the jwt token that user has created during login process.
import jwt from "jsonwebtoken"
import User from "../model/user.model.js"//because of deafult keyword
import { Env_Vars } from "../config/env.Vars.js"

export const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies["jwt-setflix"]
        //extracts token from our jwt-setflix cookies and it gives the information that we have stored during creating it like userID,maxage etc

        //checks if the token exists
        if(!token){
            return res.status(401).json({success: false,message:"unauthorized-No Token Provided"})
        }
         const decoded = jwt.verify(token,Env_Vars.JWT_SECRET);
         //it compares the user's given token stored in cookie and the signed key JWT_keys

         //checks if it mis matches
         if(!decoded){
            return res.status(401).json({success: false,message:"unauthorized-Invalid Token"})
         }

         //checks if the user exists in database and it doen't show password 
         const user = await User.findById(decoded.userId).select("-password");

         if(!user){
            return res.status(404).json({success: false,message:"User not found"})
         }

         //req.user = user the user data was attached to req.user,token was verified,now it can send the response to all the router it is decoded
         req.user = user;

         //then it go to next or next route like movie,tv
         next();

    } catch (error) {
        console.log("Error in protectRoute middelware",error.message);
        res.status(500).json({success: false,message:"Internal server eror during protecting routes"})
    }
}