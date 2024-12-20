import bcryptjs from "bcryptjs";
import User from "../model/user.model.js"
import { Env_Vars } from "../config/env.Vars.js";
import mongoose from "mongoose";
import Movie from "../model/movie.model.js";
import { uploadVideoToBlob } from "../middleware/azureBlobService.js";
import { BlobServiceClient } from "@azure/storage-blob";
const blobServiceClient = BlobServiceClient.fromConnectionString(Env_Vars.AZURE_BLOB_STORAGE);



export async function createUser(req,res){

    try {
        const { username, email, password,} = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
    if(!emailRegex.test(email)){
        return res.status(400).json({sucess:false,message:"Invalid email"});}

    if(password.length < 6){
        return res.status(400).json({sucess:false,message:"Password must be at least 6 characters long"});}

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified:true,
            isAdmin:false,
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully by Admin", user: newUser });
    } catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        // Ensure that the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in database" });
        }

        if (user.isAdmin === true) {
            return res.status(404).json({ success: false, message: "Admin User cannot be deleted" });
        }

        // Delete the user
        await user.deleteOne();
        res.status(200).json({ success: true, message: "User deleted successfully by admin" });
    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        res.status(500).json({ success: false, message: "Internal server error while deleting user" });
    }
}

export async function uploadVideo(req,res){
    const { title, description } = req.body;
    const videoFile = req.file;

    //const adminId = req.user._id;
    if (!title || !description || !videoFile) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Generate a unique video name
    const videoName = title || `${Date.now()}_${videoFile.originalname}`;

    // Upload the video to Azure Blob Storage and get the video URL
    const videoUrl = await uploadVideoToBlob(videoFile.buffer, videoName);

    try {
        const newVideo = new Movie({
            name:videoName,
            description:description,
            videoUrl:videoUrl,
           // uploadedBy: adminId,
        });
        await newVideo.save();
        res.status(201).json({ success: true, message: "Video uploaded successfully", video: newVideo });
    } catch (error) {
        console.error("Error uploading video:", error.message);
        res.status(500).json({ success: false, message: "Internal server error during video upload" });
    }
}

export async function deleteVideo(req, res) {
    // Extract videoId and videoUrl from the request body
    const { videoId, videoUrl } = req.body;  

    console.log('Request Body:', req.body);  // Log the body to check if videoUrl is there

    // Ensure that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ success: false, message: "Invalid video ID format" });
    }

    try {
        // 1. Check if the videoUrl is provided and delete from Azure Blob Storage
        if (videoUrl) {
            // Extract the blob name from the URL (last part after '/')
            let blobName = videoUrl.split('/').pop();  
            blobName = decodeURIComponent(blobName);  // Decode URL-encoded blob name

            console.log('Blob Name:', blobName);  // Check the extracted and decoded blob name

            const containerName = 'videos';  // Replace with your actual container name
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);

            // Delete the blob (video) from the container
            const deleteResponse = await blobClient.deleteIfExists();

            if (!deleteResponse.succeeded) {
                console.log(`Error deleting video from Azure Blob Storage`);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete video from Azure Blob Storage.',
                });
            }

            console.log(`Deleted video from Azure Blob Storage: ${blobName}`);
        } else {
            console.warn('No video URL provided, skipping Azure Blob deletion');
        }

        // 2. Delete the video record from the database
        const deletedVideo = await Movie.findByIdAndDelete(videoId);

        if (!deletedVideo) {
            return res.status(404).json({
                success: false,
                message: 'Video not found.',
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Video deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete video. Please try again.',
        });
    }
}



export async function getAllUser(req,res) {
    try {
        const users = await User.find();
        res.status(200).json({success:true,users});
        
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        res.status(500).json({ success: false, message: "Internal server error during fetching user" });
    
    }
    
}