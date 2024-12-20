import jwt from "jsonwebtoken"
import { Env_Vars } from "../config/env.Vars.js"

export const generateTokenAndSetCookie = (userId,res) =>{
  //rhis line create  jws web token with three things payload(userId),secret(my secret to sign the token)and expiration
  const token = jwt.sign({userId}, Env_Vars.JWT_SECRET, {expiresIn:"5 hours"}) ; 



  //this function stores the jwt token in a cookie called jwt-setflix
  res.cookie("jwt-setflix",token,{
    maxAge:5*60*60*1000, // 1 days in ms
    httpOnly:true,//true cannot be accessed by javascript,false can be accessed
    sameSite: "lax",//'strict'for only in same origin(port) 'lax' for vross origin
    //secure: Env_Vars.NODE_ENV !== "development",//only be sent over https during produvtion so token will not be exposed
    secure:false//disable secure in development

})

return token;//its optional ,it sends the token back to calling function in my case to login route
}

//tokens ,such as Jwts are typically not stored in the database along wirh other user details.Instead they are issued by server during the authentication process and then stored on client side(eg cookie or local storage ) for later use

export const generateTokenAndSetCookieAdmin = (userId,res) =>{
  
  const token = jwt.sign({userId}, Env_Vars.ADMIN_SECRET_KEY, {expiresIn:"1d"}) ; 

  res.cookie("jwt-setflix-Admin",token,{
    maxAge: 24*60*60*1000,
    httpOnly:true,
    sameSite: "strict",
    secure: Env_Vars.NODE_ENV !== "development",

})

return token;
}