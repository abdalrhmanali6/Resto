import React from 'react'
import Header from '../Components/Headernav'
import FoodCategory from "../components/FoodCatogery.jsx";

function Home() {
  return (
    <>
      <Header />
      
      <div className="bg-linear-to-r from-red-500 to-red-600 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">استمتع بألذ الأطباق الشرقية الأصيلة</h1>
        <p className="text-lg mt-2">جودة عالية وطعم لا يُنسى</p>
      </div>

      <FoodCategory />
    </>
  );
}

export default Home;