import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [loggedIn, SetLoggedIn] = useState(false);
  const location = useLocation();
  const Navigate = useNavigate();
  return (
    <header>
      {location.pathname === "/" && (
        <>
          <div className="flex items-center space-x-6 flex-1">
            <button className="bg-[#d44211]/20 p-2 rounded-xl hover:bg-[#d44211]/30 active:opacity-50 cursor-pointer">
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 256 256"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </button>
            {loggedIn ? (
              <button className="header-button">اطلب الأن</button>
            ) : (
              <>
                <button
                  className="header-button"
                  onClick={() => Navigate("/Login")}
                >
                  سجل الدخول
                </button>
                <button
                  className="header-button"
                  onClick={() => Navigate("/Register")}
                >
                  حساب جديد
                </button>
              </>
            )}
          </div>

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav">الدعم الفني</p>
            <p className="header-nav">التقيمات</p>
            <p className="header-nav">طلباتك</p>
            <p className="header-nav text-[#d44211]">القائمة الرئيسية</p>
          </nav>
        </>
      )}

      {location.pathname === "/Register" && (
        <>
          <div className="flex items-center space-x-6 flex-1">
            <button
              className="header-button"
              onClick={() => Navigate("/Login")}
            >
              سجل الدخول
            </button>
          </div>

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav">الدعم الفني</p>
            <p className="header-nav"
             onClick={()=>Navigate("/")}>القائمة الرئيسية</p>
          </nav>
        </>
      )}

      
      {location.pathname === "/Login" && (
        <>
          <div className="flex items-center space-x-6 flex-1">
            <button
              className="header-button"
              onClick={() => Navigate("/Register")}
            >
              حساب جديد
            </button>
          </div>

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav">الدعم الفني</p>
            <p className="header-nav"
             onClick={()=>Navigate("/")}>القائمة الرئيسية</p>
          </nav>
        </>
      )}
      <div className="flex-1 flex items-center justify-end ">
        <img src="logo.png" alt="سيخ كفتة" className="w-20" />
      </div>
    </header>
  );
}

export default Header;
