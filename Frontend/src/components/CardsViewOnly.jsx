import React from 'react'

function CardsViewOnly({item}) {
  return (
    <>
    <div className='my-4 p-3'>

    
       <div className="card  bg-base-100 p-3 shadow-xl mx-1 hover:scale-105 duration-200">
  <div className="card-body">
    <h2 className="card-title">{item.name}</h2>
    <p>{item.description}</p>
  </div>
  <figure>
    <img
      src={item.image}
      alt="Imagemovie" />
  </figure>
</div>  
</div>
    </>
  )
}

export default CardsViewOnly
