// src/Pages/Talabatk.jsx
import React, { useEffect, useState } from "react";
import Header from "../Components/Headernav";
import { getUserOrders } from "../Components/OrderApi";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserOrders(userId, token)
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        setOrders(list);
      })
      .catch((e) => {
        console.error("Orders error", e);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  if (!token || !userId) {
    return (
      <p className="text-center p-8">
        من فضلك قم بتسجيل الدخول لرؤية طلباتك
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-right">طلباتك</h1>

        {loading ? (
          <p className="text-center p-4">جاري التحميل...</p>
        ) : orders.length === 0 ? (
          <p className="text-center p-4">لا توجد طلبات حتى الآن</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const total =
                Number(order.total_price || 0) ||
                Number(order.sub_total || 0) + Number(order.delivery_fees || 0);

              return (
                <div
                  key={order.order_id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      طلب رقم #{order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      الحالة: {order.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      العنوان: {order.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      التاريخ:{" "}
                      {order.date_placed
                        ? new Date(order.date_placed).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <div className="text-left mt-2 md:mt-0">
                    <p className="text-sm">
                      المجموع الفرعي: {order.sub_total} ج.م
                    </p>
                    <p className="text-sm">
                      التوصيل: {order.delivery_fees} ج.م
                    </p>
                    <p className="text-base font-bold text-red-600">
                      الإجمالي: {total.toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Order;
