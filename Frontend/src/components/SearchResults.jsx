import React from "react";
import { useLocation } from "react-router-dom";
import Cards from "./Cards";

function SearchResults() {
  const location = useLocation();
  const { results } = location.state || { results: [] }; // Get search results from state

  return (
    <div className="max-w-screen-2xl mx-auto md:px-20 px-4 py-6">
      <h1 className=" mt-20 text-center text-2xl font-bold">Search Results</h1>
      <hr />
      {results.length === 0 ? (
        <p className="text-gray-500">No movies found. Try another search!</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {results.map((movie) => (
            <Cards key={movie._id} item={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
