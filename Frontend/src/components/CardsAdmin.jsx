import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

function CardsAdmin({ item, onDelete }) {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


   




    // Function to handle deleting the video
  const handleDelete = async () => {
   onDelete(item._id,item.videoUrl)
  };


  return (
    <>
     <div className="my-4 p-3">
      <div className="card bg-base-300 p-3 shadow-xl mx-1 hover:scale-105 duration-200">
        <figure>
          <img src={item.image} alt="Video Thumbnail" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p>{item.description}</p>
          <div className="card-actions justify-between">
            {/* Delete Button */}
            <button
              className="btn btn-error text-white hover:text-black"
              onClick={handleDelete}
            >
              Delete
            </button>
            {/* Play Button */}
            <button
              className="btn btn-primary text-white hover:text-black"
              onClick={() =>
                navigate(`/video-player/${item._id}`, { state: { movie: item } })
              }
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
      
    </>
  )
}

export default CardsAdmin
