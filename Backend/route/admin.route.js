import express from "express";
import {createUser, deleteUser, uploadVideo,deleteVideo, getAllUser} from "../controller/admin.controller.js";
import multer from "multer";

// Multer setup for video file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
router.post("/create-user",createUser)
router.delete("/delete-user/:userId",deleteUser)
router.delete("/delete-video/",deleteVideo)
router.get("/getAllUsers",getAllUser)
router.post('/upload-video', upload.single('video'), uploadVideo);


export default router ;