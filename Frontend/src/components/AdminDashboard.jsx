import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CardsAdmin from './CardsAdmin';
import CardsAdminUser from './CardsAdminUser';
import useAuthCheckAdmin from './useAuthCheckAdmin';

function AdminDashboard() {
  const isAdminAuthenticated = useAuthCheckAdmin(); // Check if the user is authenticated
   
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword]= useState('');
  const [movies, setMovies] = useState([]); // Movie list
  const [users, setUsers] = useState([]);


  // Fetch movies and users from the backend
  useEffect(() => {
    if (isAdminAuthenticated === null) return; // Don't run until the authentication state is available

    const fetchData = async () => {
      try {
        const movieResponse = await axios.get('/api/movies/');
        setMovies(movieResponse.data);

        const userResponse = await axios.get('/api/admin/getAllUsers');
         // Check if the response contains the 'users' array
      if (userResponse.data.success && Array.isArray(userResponse.data.users)) {
        setUsers(userResponse.data.users); // Extract the users array
      } else {
        console.error('Unexpected API response:', userResponse.data);
        toast.error('Unexpected response format.');
        setUsers([]); // Fallback to an empty array
      }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data. Please try again.');
      }
    };

    fetchData();
  }, [isAdminAuthenticated]);

  // Handle file input change
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  // Upload video
  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      toast.error('Please select a video to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);

    try {
      const response = await axios.post('/api/admin/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Required for file uploads
      });
      toast.success('Video uploaded successfully!');
      setMovies((prev) => [...prev, response.data]); // Update movie list

      // Clear the form
      setTitle('');
      setDescription('');
      setVideo(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload video. Please try again.');
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId,videoUrl) => {

   
    try {
      await axios.request({
        method: 'DELETE',
        url: `/api/admin/delete-video`,
        data: { videoId, videoUrl }, // Pass both ID and URL in the request body
      });
      toast.success('Video deleted successfully!');
      setMovies((prev) => prev.filter((movie) => movie._id !== videoId)); // Update UI
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete video. Please try again.');
    }

  
  };

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error('Please provide all user details.');
      return;
    }

    try {
      const response = await axios.post('/api/admin/create-user', { username, email,password });
      toast.success('User added successfully!');
      setUsers((prev) => [...prev, response.data]); // Update user list

      // Clear the form
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add user. Please try again.');
    }
  };

// Delete user from database
const handleDeleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/api/admin/delete-user/${userId}`);
    if (response.data.success) {
      toast.success('User deleted successfully!');
      setUsers((prev) => prev.filter((user) => user._id !== userId)); // Update user list
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete user. Please try again.');
  }
};
  
// Conditionally render based on the authentication state
if (isAdminAuthenticated === false) {
  return (
    <div className="text-center mt-20">
      <h2>You are not authorized. Please log in as admin to access this page.</h2>
    </div>
  );
}

// Display loading message when the authentication state is still loading
if (isAdminAuthenticated === null) {
  return (
    <div className="text-center mt-20">
      <h2>Loading...</h2>
    </div>
  );
}

  
  

  

  return (
    <div className="flex-col max-w-screen-2xl container mx-auto md:px-20 px-4 bg-white">
      {/* Upload Video Section */}
      <div className="flex  items-center justify-center flex-col mt-20 space-y-8">
        <div>
          <button onClick={() => document.getElementById('video_modal').showModal()} className="btn btn-primary">
            Upload Video
          </button>

          <dialog id="video_modal" className="modal">
            <div className="modal-box">
              <button
                onClick={() => document.getElementById('video_modal').close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Upload a Video</h3>

              <form onSubmit={handleVideoUpload}>
                <div className="mt-4 space-y-2 py-1">
                  <label htmlFor="title" className="block font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter title"
                    className="w-full px-4 py-2 border rounded-md outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4 space-y-2 py-1">
                  <label htmlFor="description" className="block font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter description"
                    className="w-full px-4 py-2 border rounded-md outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="video" className="block font-medium">
                    Upload Video
                  </label>
                  <input
                    type="file"
                    id="video"
                    accept="video/*"
                    className="mt-2"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn btn-success text-white hover:text-black">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>

        {/* Add User Section */}
        <div>
          <button onClick={() => document.getElementById('user_modal').showModal()} className="btn btn-secondary">
            Add User
          </button>

          <dialog id="user_modal" className="modal">
            <div className="modal-box">
              <button
                onClick={() => document.getElementById('user_modal').close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Add a User</h3>

              <form onSubmit={handleAddUser}>
                <div className="mt-4 space-y-2 py-1">
                  <label htmlFor="username" className="block font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border rounded-md outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4 space-y-2 py-1">
                  <label htmlFor="email" className="block font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-2 border rounded-md outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                     </div>
                  
                     <div className="mt-4 space-y-2 py-1">
                  <label htmlFor="password" className="block font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="Password"
                    placeholder="Enter a password"
                    className="w-full px-4 py-2 border rounded-md outline-none"
                    value={password}
                    onChange={(e) =>setPassword(e.target.value)}
                    required
                  />
                  </div>

             

                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn btn-success text-white hover:text-black">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>

      {/* Video Section */}
      <div>
        <h2 className="my-5 text-center text-2xl font-bold">Videos</h2>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {movies.map((item) => (
            <CardsAdmin item={item} key={item._id} onDelete={handleDeleteVideo} />
          ))}
        </div>
      </div>

      {/* User Section */}
      <div>
        <h2 className="my-5 text-center text-2xl font-bold">Users</h2>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {users.length === 0 ? (
        <p>No users available.</p>
      ) : (
        users.map((user) => (
          <CardsAdminUser item={user} key={user._id} onDelete={handleDeleteUser} />
        ))
      )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
