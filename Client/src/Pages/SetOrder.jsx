// src/Pages/SetOrder.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Headernav";
import { placeOrder } from "../Components/OrderApi";
import PaymentForm from "../Components/PaymentCard";
import PaymentWallet from "../Components/PaymentWallet";
import { getCart } from "../Components/CartApi";

function SetOrder() {
    const [location, setLocation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [cardData, setCardData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [warning, setWarning] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [items, setItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId || !token) {
            setCartLoading(false);
            return;
        }

        setCartLoading(true);
        getCart(userId, token)
            .then((res) => {
                const data = res.data?.data || [];
                setItems(data);
            })
            .catch((e) => {
                console.error("Cart error", e);
                setItems([]);
            })
            .finally(() => setCartLoading(false));
    }, [userId, token]);

    if (!token || !userId) {
        return (
            <p className="text-center p-8">
                من فضلك قم بتسجيل الدخول لإكمال الطلب
            </p>
        );
    }

    const validateCardData = () => {
        if (!cardData) return false;
        return Object.values(cardData).every((v) => String(v).trim() !== "");
    };

    const itemsTotal = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
    );

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (!location.trim()) {
            return setWarning("من فضلك أدخل عنوان التوصيل");
        }

        if (paymentMethod === "Wallet" && !walletData) {
            return setWarning(
                "من فضلك اختر المحفظة وأدخل رقم الهاتف لإتمام الدفع"
            );
        }

        if (paymentMethod === "Card" && !validateCardData()) {
            return setWarning("من فضلك أدخل بيانات البطاقة كاملة");
        }

        setWarning("");
        setError("");

        try {
            setPlacing(true);

            await placeOrder(
                userId,
                {
                    location: location.trim(),
                },
                token
            );

            setSuccess(true);
            setTimeout(() => navigate("/order/current"), 1500);
        } catch (err) {
            console.error("Place order error", err);
            setError(
                err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب"
            );
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6 text-right">
                    تأكيد الطلب
                </h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <section className="flex-1 bg-white rounded-xl shadow p-6 space-y-4">
                        <div className="text-right">
                            <p className="font-semibold text-gray-800">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user.phone}
                            </p>
                        </div>

                        <label className="block text-right font-semibold mb-1">
                            عنوان التوصيل
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 text-right"
                            placeholder="مثال: مدينة نصر، شارع ..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <label className="block text-right font-semibold mb-1 mt-4">
                            اختر طريقة الدفع
                        </label>
                        <select
                            className="w-full border rounded-lg px-4 py-2 text-right"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash">دفع نقداً عند الاستلام</option>
                            <option value="Wallet">محفظة إلكترونية</option>
                            <option value="Card">بطاقة بنكية</option>
                        </select>

                        {paymentMethod === "Card" && (
                            <>
                                <PaymentForm setCardData={setCardData} />
                                {warning && (
                                    <p className="text-red-500 text-sm text-center mt-2">
                                        {warning}
                                    </p>
                                )}
                            </>
                        )}

                        {paymentMethod === "Wallet" && (
                            <>
                                <PaymentWallet setWalletData={setWalletData} />
                                {warning && (
                                    <p className="text-red-500 text-sm text-center mt-2">
                                        {warning}
                                    </p>
                                )}
                            </>
                        )}
                    </section>

                    <section className="w-full md:w-80 bg-white rounded-xl shadow p-6 flex flex-col">
                        <p className="text-xl font-semibold mb-4 text-right">
                            مراجعة الطلب
                        </p>

                        {cartLoading ? (
                            <p className="text-center text-sm text-gray-500">
                                جاري تحميل السلة...
                            </p>
                        ) : items.length === 0 ? (
                            <p className="text-center text-sm text-gray-500">
                                لا توجد منتجات في السلة
                            </p>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
                                    {items.map((item) => (
                                        <div
                                            key={item.product_id}
                                            className="flex items-center space-x-10 justify-between text-sm"
                                        >
                                            <span className="text-right flex-1 ml-2">
                                                {item.name ||
                                                    `منتج رقم ${item.product_id}`}{" "}
                                                × {item.quantity}
                                            </span>
                                            <span className="text-left">
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}{" "}
                                                ج.م
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-700 text-right">
                                    عنوان التوصيل:{" "}
                                    {location || "لم يتم إدخاله بعد"}
                                </p>
                                <p className="text-sm text-gray-700 text-right">
                                    طريقة الدفع:{" "}
                                    {paymentMethod === "Cash"
                                        ? "نقداً عند الاستلام"
                                        : paymentMethod === "Wallet"
                                        ? "محفظة إلكترونية"
                                        : "بطاقة بنكية"}
                                </p>

                                <p className="text-base font-bold text-red-600 text-right mt-3">
                                    إجمالي المنتجات: {itemsTotal.toFixed(2)} ج.م
                                </p>
                            </>
                        )}
                        <div className="mt-auto flex justify-center gap-4 pt-6">
                            <button
                                type="button"
                                className="bg-gray-300 hover:bg-gray-400 rounded-2xl font-medium py-2 px-6"
                                onClick={() => navigate("/cart")}
                            >
                                رجوع إلى السلة
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmOrder}
                                disabled={placing}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium py-2 px-6 disabled:opacity-60"
                            >
                                {placing ? "جاري الإرسال..." : "تأكيد"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-3">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="font-semibold text-md text-green-600 text-center mt-3">
                                تم إنشاء الطلب بنجاح
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default SetOrder;
