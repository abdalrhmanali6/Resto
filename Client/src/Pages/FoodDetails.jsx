import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../Components/Api";
import Header from "../Components/Headernav"; // adjust path if needed

function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    setLoading(true);
    Api.get(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const data = res.data?.data;
        setFood(data); // data is an array [item]
      })
      .catch((e) => {
        console.error("Food details error", e);
        setFood(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center p-8">Loading...</p>;
  }

  if (!food || !food[0]) {
    return <p className="text-center p-8">Food not found</p>;
  }

  const item = food[0];

  const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      alert("من فضلك قم بتسجيل الدخول أولاً");
      return;
    }

    const user = JSON.parse(storedUser);   // convert string → object
    console.log("user id =", user.id);     // or user.user_id based on backend

    await Api.post(
      `/cart/${user.id}`,                  // make sure backend expects :user_id
      { product_id: item.id, quantity },   // your backend expects product_id
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


  const handleOrderNow = () => {
    // later you can navigate to checkout page
    handleAddToCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header on top */}
      <Header />

      {/* content */}
      <main className="max-w-6xl mx-auto py-10 px-4">
         <div className="flex flex-col md:flex-row gap-10 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow p-6">
            <div className="w-full md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400?text=No+Image";
                }}
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {item.name}
                </h1>
                <p className="text-xl text-red-500 font-semibold mb-4">
                  {item.price} ج.م
                </p>
                {item.description && (
                  <p className="text-gray-700 mb-6">{item.description}</p>
                )}
              </div>
{/* quantity */}
    <div className="flex items-center gap-3 mb-6">
      <span className="font-semibold text-gray-700">الكمية:</span>
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value) || 1))
          }
          className="w-16 text-center outline-none"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  
              {/* bottom buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  إضافة إلى السلة
                </button>
                <button
                  onClick={handleOrderNow}
                  className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
                >
                  اطلب الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FoodDetails;
