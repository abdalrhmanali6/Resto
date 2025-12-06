import { FiEdit2, FiTrash2, FiTruck } from "react-icons/fi";
import { users } from "./../../data";
import { useState } from "react";
import img from "./../../assets/profile.png";
import { BiChevronLeft } from "react-icons/bi";

export default function AdminUsers() {
    const [showAll, setShowAll] = useState(false);
    const visibleUsers = showAll ? users : users.slice(0, 6);

    const handleUpdate = (id) => {
        console.log("تحديث المستخدم:", id);
    };

    const handleDelete = (id) => {
        console.log("حذف المستخدم:", id);
    };

    const handleMakeDelivery = (id) => {
        console.log("تحويل إلى توصيل:", id);
    };

    return (
        <div className="profile-page">
            <div className="users-head">
                <div className="page-header">
                    <h1>إدارة المستخدمين</h1>
                    <p>عرض وتعديل وحذف حسابات المستخدمين</p>
                </div>
                <button
                    className="view-more-btn"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "إظهار أقل" : "مشاهدة المزيد"}
                    <BiChevronLeft size={20} />
                </button>
            </div>

            <div className="users-grid">
                {visibleUsers.map((user) => (
                    <div key={user.id} className="user-card">
                        <div className="user-info">
                            <div className="user-avatar">
                                <img src={img} alt="" />
                            </div>
                            <div className="user-details">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className="user-actions">
                            <button
                                className="update-btn"
                                onClick={() => handleUpdate(user.id)}
                            >
                                <FiEdit2 />
                                تحديث
                            </button>
                            <button
                                className="make-delivery-btn"
                                onClick={() => handleMakeDelivery(user.id)}
                            >
                                <FiTruck />
                                توصيل
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(user.id)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
