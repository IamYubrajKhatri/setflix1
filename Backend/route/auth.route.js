import express from "express";
//we import signup function from controller.js
import { signup,VerifyEmail,Login ,Logout,forgotPassword,resetPassword } from "../controller/auth.controller.js";
import { protectRoute} from "../middleware/protectRoute.js";

const router = express.Router();
//the Router acts as a mini app that you can attach middelware and route handler to.
//post method beacuse user send the data to us to be controlled and saved by us
router.post("/signup",signup);
router.post("/verifyemail",VerifyEmail);
router.post("/login",Login);
router.post("/logout",protectRoute,Logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me",protectRoute,(req,res)=>{res.status(200).json({success:true,user:req.user})});




export default router ;
//with this export keyword we can use the function router on other files