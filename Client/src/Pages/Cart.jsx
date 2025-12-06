import React, { useEffect, useState } from "react";
import Header from "../Components/Headernav";
import { getCart, updateCartItem, deleteCartItem } from "../Components/CartApi";
import { useNavigate } from "react-router-dom";
function Cart() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;
    const Navigate = useNavigate();

    useEffect(() => {
        if (!userId || !token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        getCart(userId, token)
            .then((res) => {
                const data = res.data?.data || [];
                setItems(data);
            })
            .catch((e) => {
                console.error("Cart error", e);
                setItems([]);
            })
            .finally(() => setLoading(false));
    }, [userId, token]);

    const handleChangeQty = async (productId, newQty) => {
        if (!userId || !token) return;
        if (newQty < 1) newQty = 0;

        try {
            await updateCartItem(userId, productId, newQty, token);

            setItems((prev) =>
                prev
                    .map((item) =>
                        item.product_id === productId
                            ? { ...item, quantity: newQty }
                            : item
                    )
                    .filter((item) => item.quantity > 0)
            );
        } catch (e) {
            console.error("Update cart error", e);
        }
    };

    const handleDeleteItem = async (productId, newQty) => {
        if (!userId || !token) return;

        try {
            await deleteCartItem(userId, productId, newQty, token);
            setItems((prev) =>
                prev.filter((item) => item.product_id !== productId)
            );
        } catch (e) {
            console.error("Delete cart item error", e);
        }
    };
    console.log(items);
    const itemsTotal = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
    ); //[web:68][web:71]

    if (!token || !userId) {
        return (
            <p className="text-center p-8">
                من فضلك قم بتسجيل الدخول لرؤية السلة
            </p>
        );
    }

    if (loading) {
        return <p className="text-center p-8">Loading...</p>;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <p className="text-center p-8">لا توجد منتجات في السلة</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6 text-right">
                    سلة المشتريات
                </h1>

                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex items-center gap-4 border-b last:border-b-0 pb-4"
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            )}

                            <div className="flex-1 text-right">
                                <p className="font-semibold text-gray-800">
                                    {item.name || `منتج رقم ${item.product_id}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                    السعر: {item.price} ج.م
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handleChangeQty(
                                            item.product_id,
                                            item.quantity - 1
                                        )
                                    }
                                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        handleChangeQty(
                                            item.product_id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteItem(
                                            item.product_id,
                                            item.quantity
                                        )
                                    }
                                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                                >
                                    حذف
                                </button>
                            </div>

                            <div className="w-24 text-right font-semibold">
                                {(item.price * item.quantity).toFixed(2)} ج.م
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <p className="text-lg font-bold">
                        الإجمالي: {itemsTotal.toFixed(2)} ج.م
                    </p>
                    <button
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
                        onClick={() => Navigate("/order/set")}
                    >
                        إكمال الطلب
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Cart;
