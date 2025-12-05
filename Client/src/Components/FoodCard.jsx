import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import Api from "./Api"; // Your axios instance

function FoodCard({ foodName, foodPrice, image, foodId }) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Quantity,setQuantity]=useState(1);
  const Navigate = useNavigate();

  const handleCardClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    Navigate(`/food/${foodId}`);
  };
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        alert("من فضلك قم بتسجيل الدخول أولاً");
        return;
      }

      setQuantity(Quantity+1)
      const user = JSON.parse(storedUser); 
      console.log("user id =", user.id); 

      await Api.post(
        `/cart/${user.id}`, 
        { product_id: foodId, quantity:Quantity }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("تمت إضافة الطلب إلى السلة");
    } catch (err) {
      console.error("Add to cart error", err);
      alert("حدث خطأ أثناء إضافة الطلب");
    }
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full cursor-pointer"
      onClick={handleCardClick}
    >
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

      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-gray-800 truncate text-lg">
          {foodName}
        </h3>
        <p className="text-xl font-bold text-red-500 mt-2">{foodPrice}</p>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </div>
  );
}

export default FoodCard;
