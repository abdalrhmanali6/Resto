import { FiEdit2, FiX } from "react-icons/fi";
import foodImg from "./../../assets/food.webp";
import { products } from "./../../data";
import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";

export default function AdminFood() {
    const [showAll, setShowAll] = useState(false);
    const visibleProducts = showAll ? products : products.slice(0, 6);

    const handleEdit = (id) => {
        console.log("تعديل المنتج:", id);
    };

    const handleDelete = (id) => {
        console.log("حذف المنتج:", id);
    };

    return (
        <div className="profile-page">
            <div className="food-head">
                <div className="page-header">
                    <h1>إدارة الأطعمة</h1>
                    <p>عرض وتعديل وحذف المنتجات الغذائية</p>
                </div>
                <button
                    className="view-more-btn"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "إظهار أقل" : "مشاهدة المزيد"}
                    <BiChevronLeft size={20} />
                </button>
            </div>

            <div className="products-grid">
                {visibleProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="product-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="product-image">
                            <img src={foodImg} alt="" />
                        </div>

                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <span className="price">{product.price} جنيه</span>
                        </div>

                        <div className="product-actions">
                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(product.id)}
                            >
                                <FiEdit2 />
                                تعديل
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(product.id)}
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
