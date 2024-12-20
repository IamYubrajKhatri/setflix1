import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import toast from 'react-hot-toast';

// This is the function to check if the user is authorized
const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Assuming you are using cookies with JWT token
        axios.defaults.withCredentials = true;
        const response = await axios.get("/api/auth/me"); // The backend route to check for user status
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false); // If there is an error, set to false (unauthorized)
        toast.error("Please login to access this feature!");
        navigate("/"); // Redirect to home page
    //The setTimeout function ensures that the modal is opened after the page has redirected (giving time for the redirect to complete).
        setTimeout(() => {
            // Wait for navigation to finish and then open the modal
            document.getElementById("my_modal_3").showModal(); // Open login modal
          }, 500); // Delay to make sure navigation happens before opening the modal
      }
    };

    checkAuthStatus(); // Run the check when component mounts
  }, [navigate]);

  return isAuthenticated;
};



export default useAuthCheck;
