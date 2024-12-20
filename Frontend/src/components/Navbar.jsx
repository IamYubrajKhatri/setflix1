import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

function Navbar() {
  const navigate = useNavigate();

  const [sticky, setSticky] = useState(false);
  const [user, setUser] = useState(null); // State to track logged-in user
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [searchResults, setSearchResults] = useState([]); // Search results

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check login state when component mounts
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        axios.defaults.withCredentials = true; // Ensure cookies are sent
        const res = await axios.get("/api/auth/me");
        setUser(res.data.user); // Set user info if logged in
      } catch (err) {
        setUser(null); // If error, assume user is not logged in
      }
    };

    checkLoginState();
  }, []);

  // Handle logout button click
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null); // Clear user state after logout
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Restrict access for logged-out users
  const handleRestrictedAccess = (path) => {
    if (user) {
      navigate(path);
    } else {
      toast.error("Please login to access this feature!");
      document.getElementById("my_modal_3").showModal(); // Open login modal
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return toast.error("Please enter a search term!");
    }

    try {
      const res = await axios.get(`/api/movies/search?query=${searchTerm}`);
      setSearchResults(res.data.results); // Set search results

      if (res.data.results.length === 0) {
        toast.error("No results found!");
      } else {
        navigate("/search-results", { state: { results: res.data.results } }); // Redirect to search results page
      }
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Error fetching search results!");
    }
  };

  // Navigation items
  const navItems = (
    <>
      <li><a href="/">Home</a></li>
      <li><a onClick={() => handleRestrictedAccess("/movies")}>Movies</a></li>
      <li><a onClick={() => handleRestrictedAccess("/admin")}>Admin</a></li>
      <li className="md:hidden">
        {/* Mobile search bar */}
        <a
          className="btn"
          onClick={() => document.getElementById("mobile_search_modal").showModal()}
        >
          Search
        </a>

        <dialog id="mobile_search_modal" className="modal">
  <form
    method="dialog"
    className="modal-box bg-base-100 p-4 shadow-lg rounded-md"
  >
    <h3 className="font-bold text-lg">Search</h3>
    <input
      type="text"
      className="w-full input input-bordered mt-2"
      placeholder="Search for movies..."
      value={searchTerm}  // Use searchTerm instead of searchQuery
      onChange={handleSearchChange}  // Use handleSearchChange
    />
    <div className="modal-action">
      <button
        className="btn"
        type="submit"
        onClick={handleSearchSubmit}  // Use handleSearchSubmit
      >
        Search
      </button>
      <button className="btn btn-error">Close</button>
    </div>
  </form>
</dialog>

      </li>
    </>
  );

  const heartIcon = (
    <div>
      <button className="btn btn-error" onClick={() => handleRestrictedAccess("/favourites")}>
        <Heart size={20} color="white" />
      </button>
    </div>
  );

  return (
    <>
      <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 z-50 ${sticky ? "sticky-navbar shadow-md bg-base-200 duration-200 transition-all ease-in-out" : ""}`}>
        <div className="navbar">
          {/* Navbar start */}
          <div className="navbar-start">
            {/* Dropdown for mobile */}
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>

              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                {navItems}
              </ul>
            </div>

            <a className="btn btn-ghost text-2xl font-bold">Setflix</a>
            <a className="hidden lg:block">
              {user ? <span>Welcome, {user.username}!</span> : null}
            </a>
          </div>

          {/* Navbar end */}
          <div className="navbar-end space-x-3">
            {/* Navigation links for large screens */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{navItems}</ul>
            </div>

            {/* Searchbar */}
            <div className="hidden md:block">
              <form onSubmit={handleSearchSubmit}>
                <label className="flex items-center gap-2 w-45 h-12 border px-1 py-1">
                  <input
                    type="text"
                    className="grow outline-none"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </label>
              </form>
            </div>

            {/* Heart */}
            {heartIcon}

            {/* Login/Logout Button */}
            <div>
              {user ? (
                <button onClick={handleLogout} className="btn btn-error text-white hover:text-black">
                  Logout
                </button>
              ) : (
                <a className="btn" onClick={() => document.getElementById("my_modal_3").showModal()}>Login</a>
              )}

              <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
