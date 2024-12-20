import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import toast from 'react-hot-toast';

// This is the function to check if the user is authorized
const useAuthCheckAdmin = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null); // Track admin authentication status
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuthStatus = async () => {
      try {
        // Assuming you are using cookies with JWT token
        axios.defaults.withCredentials = true;

        // Backend route to fetch user information, including admin status
        const response = await axios.get("/api/auth/me");

        // Check if the user has admin privileges
        if (response.data.user && response.data.user.isAdmin) {
          setIsAdminAuthenticated(true); // Set admin authentication to true
        } else {
          setIsAdminAuthenticated(false);
          toast.error("Access denied. Admins only!");
          navigate("/"); // Redirect to home page if not an admin
        }
      } catch (error) {
        setIsAdminAuthenticated(false); // Unauthorized access
        toast.error("Please login as admin to access this feature!");
        navigate("/"); // Redirect to home page
        // The setTimeout ensures modal opens after navigation finishes
        setTimeout(() => {
          document.getElementById("my_modal_3").showModal(); // Open login modal
        }, 500);
      }
    };

    checkAdminAuthStatus(); // Run the check when component mounts
  }, [navigate]);

  return isAdminAuthenticated;
};

export default useAuthCheckAdmin;
