import mongoose from "mongoose";

//now we deifine schema for user that every our user needs to have

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
    password :{
        type: String,
        required: true,
    },
    resetPasswordOtp :{
        type: String,
        default:undefined,
    },
    resetPasswordOtpExpires :{
        type: Date,
        default:undefined,
    },
    previousPasswords:{
        type: [String], // This will store an array of password hashes
    default: [],
    },
    verificationCode:String,
    searchHistory :{
        type: Array,
        default: []
    },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    isAdmin:{
        type: Boolean,
        default: false,//default is a regular user
    },
    isLoggedin:{
        type:Boolean,
        default:false,
    },isVerified:{
        type:Boolean,
        default:false,
    },
    isPasswordReseted:{
        type:Boolean,
        default:false,
    }

},{timestamps:true})


//now we create a modele for avobe designed schema
//this code means whater data is given in userSchema it is stored in USer collection
const User = mongoose.model("User",userSchema);
export default User;