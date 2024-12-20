//we have defined the data structure of user model in  user.model.js ,thats why we imported this function
//await can only be used when we have async funktion
import User from "../model/user.model.js"
//to hash the password we use bycryptjs
import bcryptjs from "bcryptjs";
//to send verification code
import { SendVerificationCode, sendResetPasswordOtp,WelcomeEmail ,resetPasswordSuccessfullEmail} from "../middleware/Email.js"
import { generateTokenAndSetCookie } from "../utils/generateToken.js"


// export const signup=(req,res)=>{} an alternative to down one
export async function signup(req,res){
    try {
        //this is a postman entry to check 
        //these three are the input 
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({sucess:false,message:"All fields are required"});
        }
        //the Regex is a email validator it checks all edge case for valid email  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!emailRegex.test(email)){
            return res.status(400).json({sucess:false,message:"Invalid email"});
        }
        if(password.length < 6){
            return res.status(400).json({sucess:false,message:"Password must be at least 6 characters long"});
        }

        //this User is a database modele we created
        const existingUserEmail = await User.findOne({ email: email});
        if(existingUserEmail){
            return res.status(400).json({ sucess: false, message: "Email already exist"})
        }
         
        const existingUserUsername = await User.findOne({username:username});
        if(existingUserUsername){
            return res.status(400).json({ sucess: false, message: "Username already exist"})
        }
        //hash the password here with help of bcrypt 
        const salt =await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        //lets create a otp or verification code
        //this generate a otp of 6 digit for every user
        //math floor round up to nearest one and math random a float number between 0 and 1
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

         // Check if the user is an admin .This sets isAdmin to true for the specified emails, otherwise false.
         const isAdmin = (email === "yubraj.khatri@mnd.thm.de" || email === "khatriyubraj1157@gmail.com");

        //we store a input of userdata here
        const createdNewUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationCode,
            isAdmin
            })

            //the down code saves the data in database
        await createdNewUser.save();

        SendVerificationCode(createdNewUser.email,verificationCode);
        res.status(201).json({message:"User created successfully",createdNewUser})
        
    } catch (error) {

        console.log("Error: " + error.message);
        res.status(500).json({sucess:false,message: "Internal server error"})
    }
}
//email verification through email push
export const VerifyEmail=async(req,res)=>{
    try {
        //
        const { email,code } =req.body
        //find the user from database with the help of matching verificationCode
        //left datenbank right cleint side or frontend
        const toBeVerifiedUser=await User.findOne({
            verificationCode:code,
            email:email
        })
        if(!toBeVerifiedUser){
            return res.status(400).json({sucess:false,message:"Invalid or expired code"})
        }

        //if the verification code matches then set the isVerified to true and the verification code to undifined and save the user
        toBeVerifiedUser.isVerified=true,
        //createdNewUser.verificationCode=undefined;
        await WelcomeEmail(toBeVerifiedUser.email,toBeVerifiedUser.username);
        await toBeVerifiedUser.save();
       
        return res.status(200).json({sucess:true,message:"Email verified successfully"})
        
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({sucess:false,message: "Internal server error"})
    }
}

//login
export async function Login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // Check if the user's email is verified
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email to login" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // Check if the user is an admin
        //if (user.isAdmin) {
        //generateTokenAndSetCookieAdmin(user._id, res);
        //return res.status(200).json({ success: true, message: "Login as admin successful" });
        //}

        // Mark user as logged in and save
        user.isLoggedin = true;
        await user.save();

        // Generate token and start session
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({ success: true, message: "Login successful", user });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


//logout
export async function Logout(req,res) {
    try {
        const userId = req.user?._id; // user info is in req.user from middleware
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized/No token available" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isLoggedin = false;
        await user.save();

        res.clearCookie("jwt-setflix");
        res.status(200).json({sucess:true, message: "Logged out successfully"});
        
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({sucess: false, message: "Internal server error-Logout"});
    }
    
}

//otp generation endpoint 
export async function forgotPassword(req,res){
    const { email }= req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })};

            //user.isLoggedin === true
            if (user.isLoggedin) {
                return res.status(403).json({ success: false, message: "You cannot reset your password while logged in" });
            }

        // Generate a 6-digit OTP 
        const resetPasswordOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP expiration (e.g., 10 minutes)
        //left sides are the variables that i created and will be saved in database
        user.resetPasswordOtp = resetPasswordOtp;
        user.resetPasswordOtpExpires = Date.now() + 600000; // 10 minutes from now(10 min = 10*60*1000 ms)
        await user.save();

        sendResetPasswordOtp(user.email,resetPasswordOtp);
        res.status(200).json({ success: true, message: "OTP sent to email" });
          
    } catch (error) {
        console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ success: false, message: "Internal server error while forget  password" });
    }
}

//otp verefication and password reset endpoint
export async function resetPassword(req,res) {

    

    const { resetPasswordOtp ,newPassword } =req.body;

    try {
        // Find the user by the OTP and check if it has expired
        const user = await User.findOne({
          resetPasswordOtp,
          resetPasswordOtpExpires: { $gt: Date.now() }  // Check if OTP is still valid
        });

    
        if (!user) {
          return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Check if the new password is the same as the old password
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as the old password" });
    }

//this compares all the encrypted password of the array parally 
    const isPreviousPassword = await Promise.all(user.previousPasswords.map(async (prevPassword) => {
        return await bcryptjs.compare(newPassword, prevPassword);
      }));
  
      // If the new password matches any of the previous passwords, return an error
      if (isPreviousPassword.includes(true)) {
        return res.status(400).json({ success: false, message: "New password cannot be the same as any of the previous passwords" });
      }

      
    
        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        user.password=hashedPassword;
    

        user.previousPasswords.unshift(hashedPassword); // Add new password to the front of the array
      if (user.previousPasswords.length > 3) {
        user.previousPasswords.pop(); // Remove the oldest password to maintain the array length (3 in this case)
      }



        // Clear the OTP and expiration fields after the password is reset
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;

        user.isPasswordReseted = true,
        await resetPasswordSuccessfullEmail(user.email,user.username);
        user.isPasswordReseted = false,
        await user.save();
    
        res.status(200).json({ success: true, message: "Password reset successful" });

    }catch(error){
        console.error("Error in resetPassword:", error.message);
    res.status(500).json({ success: false, message: "Internal server error resetting password" });
    }
}

    
    

