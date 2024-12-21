import { BlobServiceClient } from "@azure/storage-blob";
import { Env_Vars } from "../config/env.Vars.js";

// Create a BlobServiceClient to interact with the Azure Blob Storage account
const blobServiceClient = BlobServiceClient.fromConnectionString(Env_Vars.AZURE_BLOB_STORAGE);

// Get a reference to the container (you must have already created this container in your Azure Storage account)
const containerClient = blobServiceClient.getContainerClient('videos');  // Replace with your container name

const imageContainerClient = blobServiceClient.getContainerClient('images');

// Function to upload video to Azure Blob Storage
export const uploadVideoToBlob = async (videoBuffer, videoName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(videoName);  // Video name is used as the blob name
  
    // Upload video buffer to Blob Storage
  const uploadResponse = await blockBlobClient.uploadData(videoBuffer, {
    blobHTTPHeaders: { blobContentType: 'video/mp4' },  // Set content type for videos (adjust if needed)
  });

  console.log(`Upload successful: ${uploadResponse.requestId}`);

  // Return the URL of the uploaded video
  return blockBlobClient.url;
};

export const uploadImageToBlob = async (imageBuffer, imageName) => {
  const blockBlobClient = imageContainerClient.getBlockBlobClient(imageName);  // Image name is used as the blob name

  try {
 
      // Upload image buffer to Blob Storage
      const uploadResponse = await blockBlobClient.uploadData(imageBuffer, {
          blobHTTPHeaders: { blobContentType: 'image/jpeg'  },  // Set content type for images (jpeg or png)
      });

      console.log(`Image upload successful: ${uploadResponse.requestId}`);

      // Return the URL of the uploaded image
      return blockBlobClient.url;
  } catch (error) {
      console.error(`Error uploading image to Azure Blob Storage: ${error.message}`);
      throw new Error('Failed to upload image to Azure Blob Storage');
  }
};

