import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import {
    MdDeliveryDining,
    MdPerson,
    MdLocationOn,
    MdAccessTime,
    MdAttachMoney,
    MdOutlineCancel,
} from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { orders as ordersData } from "./../../data";
import avatar from "./../../assets/avatar.png"; // الصورة الجديدة

export default function AdminOrders() {
    const [showAll, setShowAll] = useState(false);
    const [orders, setOrders] = useState(ordersData);

    const visibleOrders = showAll ? orders : orders.slice(0, 6);

    const statusLabels = {
        preparing: "جاري التحضير",
        ready: "جاهز",
        on_the_way: "في الطريق",
        delivered: "تم التوصيل",
        cancelled: "ملغي",
    };

    const statusOptions = [
        { value: "preparing", label: "جاري التحضير" },
        { value: "ready", label: "جاهز" },
        { value: "on_the_way", label: "في الطريق" },
        { value: "delivered", label: "تم التوصيل" },
    ];

    const handleStatusChange = (id, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? {
                          ...order,
                          status: newStatus,
                          date_arrived:
                              newStatus === "delivered"
                                  ? new Date().toLocaleString("ar-EG")
                                  : order.date_arrived,
                      }
                    : order
            )
        );
    };

    const handleCancel = (id) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id ? { ...order, status: "cancelled" } : order
            )
        );
    };

    return (
        <div className="profile-page">
            <div className="food-head">
                <div className="page-header">
                    <h1>إدارة الطلبات</h1>
                    <p>عرض وتعديل حالات الطلبات</p>
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
                {visibleOrders.map((order, index) => (
                    <div
                        key={order.id}
                        className="product-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="product-image order-img">
                            <img src={avatar} alt="avatar" className="order-avatar" />
                        </div>

                        <div className="product-info">
                            <h3>طلب رقم #{order.id}</h3>
                            <span className="price">
                                {statusLabels[order.status]}
                            </span>
                        </div>

                        <div className="order-details-box">
                            <p>
                                <MdPerson /> العميل: {order.user_id}
                            </p>
                            <p>
                                <MdDeliveryDining /> المندوب:{" "}
                                {order.delivery_id}
                            </p>
                            <p>
                                <MdLocationOn /> {order.location}
                            </p>
                            <p>
                                <MdAccessTime /> وقت الطلب: {order.date_placed}
                            </p>
                            <p>
                                <MdAttachMoney /> السعر: {order.total_price} ج.م
                            </p>
                        </div>

                        <div className="product-actions">
                            {order.status !== "cancelled" &&
                                order.status !== "delivered" && (
                                    <>
                                        <select
                                            className="edit-btn"
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {statusOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleCancel(order.id)
                                            }
                                        >
                                            <MdOutlineCancel />
                                        </button>
                                    </>
                                )}

                            {order.status === "delivered" && (
                                <div className="delivered-done">
                                    <AiOutlineCheckCircle />
                                    تم التوصيل
                                </div>
                            )}

                            {order.status === "cancelled" && (
                                <div className="cancelled-done">
                                    <MdOutlineCancel />
                                    تم الإلغاء
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
