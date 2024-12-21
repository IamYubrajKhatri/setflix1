import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CardsAdmin({ item, onDelete }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(item._id, item.videoUrl);
      toast.success('Video deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete video.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4 p-3">
      <div className="card bg-base-300 p-3 shadow-xl mx-1 hover:scale-105 duration-200">
        <figure>
          <img
            src={item.image || '/Video.jpg'}
            alt={`Thumbnail for ${item.name}`}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p>{item.description}</p>
          <div className="card-actions justify-between">
            <button
              className="btn btn-error text-white hover:text-black"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
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
  );
}

export default CardsAdmin;
