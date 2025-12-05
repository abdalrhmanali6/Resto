import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import Api from "./Api"; // Your axios instance

function FoodCard({ foodName, foodPrice, image, foodId }) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

  
    if (!token) {
      setShowLoginPopup(true);
      return;
    }


    setLoading(true);
    try {
      const response = await Api.post(
        "/cart/add",
        {
          foodId: foodId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      alert("تم إضافة المنتج إلى السلة بنجاح!");
      console.log("Added to cart:", response.data);
    } catch (error) {
      console.log("Error adding to cart:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setShowLoginPopup(true);
      } else {
        alert("حدث خطأ. حاول مرة أخرى لاحقا");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full">
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={image}
            alt={foodName}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200?text=No+Image";
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate text-lg">
            {foodName}
          </h3>
          <p className="text-xl font-bold text-red-500 mt-2">£ {foodPrice}</p>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري الإضافة..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}

export default FoodCard;
