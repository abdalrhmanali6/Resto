import React from 'react';

function FoodCard({ foodName, foodPrice, image }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full">
      
      <div className="w-full h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={foodName}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
          }}
        />
      </div>

      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate text-lg">{foodName}</h3>
        <p className="text-xl font-bold text-red-500 mt-2">£ {foodPrice}</p>
        <button className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200 font-medium cursor-pointer">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
