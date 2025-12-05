import React from "react";
import { useNavigate } from "react-router-dom";

function LoginPopup({ isOpen, onClose }) {
  const Navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateLogin = () => {
    Navigate("/Login");
    onClose();
  };

  const handleNavigateRegister = () => {
    Navigate("/Register");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          تسجيل الدخول مطلوب
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          يجب عليك تسجيل الدخول أو إنشاء حساب جديد قبل إضافة طلب
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleNavigateLogin}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold transition"
          >
            سجل الدخول
          </button>

          <button
            onClick={handleNavigateRegister}
            className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-semibold transition"
          >
            إنشاء حساب جديد
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
