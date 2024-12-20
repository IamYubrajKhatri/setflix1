import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function CardsAdminUser({ item, onDelete }) {  // Destructure props here
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const imageUrl = `/${item.image}`;  // Assuming 'item.image' contains 'profile.avif'


  const handleDelete = () => {
    // Call the parent's onDelete function passed via props
    onDelete(item._id);
  };

  return (
    <div className="my-4 p-3">
      <div className="card bg-base-300 p-3 shadow-xl mx-1 hover:scale-105 duration-200">
        <figure>
          <img src="https://img.freepik.com/vektoren-kostenlos/blauer-kreis-mit-weissem-benutzer_78370-4707.jpg" alt="Profile image" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{item.username}</h2>
          <p>{item.email}</p>
          <div className="card-actions justify-between">
            {/* Delete Button */}
            <button
              className="btn btn-error text-white hover:text-black"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardsAdminUser;
