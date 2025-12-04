import { React, useEffect, useState, useMemo } from "react";
import FoodCard from "./FoodCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Api from "../Components/Api";

function FoodCategory() {
  const [Products, SetProducts] = useState([]);
  const [Categories, SetCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    Api.get("/products")
      .then((res) => {
        const productData = res.data.data || res.data;
        SetProducts(Array.isArray(productData) ? productData : []);
      })
      .catch((e) => {
        console.error("Products Error:", e);
        SetProducts([]);
      });

    Api.get("/products/categories")
      .then((res) => {
        const categoryData = res.data.data || res.data;
        SetCategories(Array.isArray(categoryData) ? categoryData : []);
      })
      .catch((e) => {
        console.error("Categories Error:", e);
        SetCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const productsByCategory = useMemo(() => {
    const grouped = {};
    Categories.forEach((cat) => {
      grouped[cat.id] = Products.filter((p) => p.category_id === cat.id);
    });
    return grouped;
  }, [Products, Categories]);

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (Categories.length === 0) return <p className="text-center p-8">No categories found</p>;
  if (Products.length === 0) return <p className="text-center p-8">No products found</p>;

  return (
    <div className="w-full bg-gray-50 py-8">

      {Categories.map((category) => {
        const categoryProducts = productsByCategory[category.id] || [];
        
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.id} className="w-full mb-12 px-4">
            
            <h2 className="font-bold text-2xl text-end text-gray-800 mb-6">{category.name}</h2>

            
            <div className="w-full">
              <Swiper
               modules={[Navigation, A11y, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="my-swiper"
                breakpoints={{
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                  1536: { slidesPerView: 5 },
                }}
              >
                {categoryProducts.map((food) => (
                  <SwiperSlide key={food.id}>
                    <div className="flex justify-center pb-4">
                      <FoodCard
                        foodName={food.name}
                        foodPrice={food.price}
                        image={food.image}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FoodCategory;
