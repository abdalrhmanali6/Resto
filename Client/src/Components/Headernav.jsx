import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "./Api"; // Your axios instance

function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLoggedIn(true);
      fetchUserData(parsedUser);
    } else {
      setLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (user) => {
    try {
      setUserName(`${user?.first_name || ""} ${user?.last_name || ""}`.trim());
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggedIn(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserName("");
    Navigate("/Login", { replace: true });
  };

    if (loading) return <header className="p-4">Loading...</header>;

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      {location.pathname === "/" && (
        <>
          {loggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="header-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
                <span className="text-gray-800 font-semibold">
                  أهلا {userName}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button"
                onClick={() => Navigate("/Login", { replace: true })}
              >
                سجل الدخول
              </button>
              <button
                className="header-button"
                onClick={() => Navigate("/Register", { replace: true })}
              >
                حساب جديد
              </button>
            </>
          )}

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p
              className="header-nav"
              onClick={() => Navigate("/cart", { replace: true })}
            >
              سلة المشتريات{" "}
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/orders", { replace: true })}
            >
              طلباتك
            </p>
            <p className="header-nav text-[#d44211]">القائمة الرئيسية</p>
          </nav>
        </>
      )}

      {location.pathname.startsWith("/food/") && (
        <>
          {loggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="header-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
                <span className="text-gray-800 font-semibold">
                  أهلا {userName}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button"
                onClick={() => Navigate("/Login", { replace: true })}
              >
                سجل الدخول
              </button>
              <button
                className="header-button"
                onClick={() => Navigate("/Register", { replace: true })}
              >
                حساب جديد
              </button>
            </>
          )}

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav">التقيمات</p>
            <p
              className="header-nav"
              onClick={() => Navigate("/cart", { replace: true })}
            >
              سلة المشتريات{" "}
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/orders", { replace: true })}
            >
              طلباتك
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

      {location.pathname === "/cart" && (
        <>
          {loggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="header-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
                <span className="text-gray-800 font-semibold">
                  أهلا {userName}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button"
                onClick={() => Navigate("/Login", { replace: true })}
              >
                سجل الدخول
              </button>
              <button
                className="header-button"
                onClick={() => Navigate("/Register", { replace: true })}
              >
                حساب جديد
              </button>
            </>
          )}

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav  text-[#d44211]">سلة المشتريات </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/orders", { replace: true })}
            >
              طلباتك
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

      {location.pathname === "/order/set" && (
        <>
          {loggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="header-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
                <span className="text-gray-800 font-semibold">
                  أهلا {userName}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button"
                onClick={() => Navigate("/Login", { replace: true })}
              >
                سجل الدخول
              </button>
              <button
                className="header-button"
                onClick={() => Navigate("/Register", { replace: true })}
              >
                حساب جديد
              </button>
            </>
          )}

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav cursor-pointer "
             onClick={() => Navigate("/cart", { replace: true })}>سلة المشتريات </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/orders", { replace: true })}
            >
              طلباتك
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

       {location.pathname === "/orders" && (
        <>
          {loggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="header-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  تسجيل الخروج
                </button>
                <span className="text-gray-800 font-semibold">
                  أهلا {userName}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="header-button"
                onClick={() => Navigate("/Login", { replace: true })}
              >
                سجل الدخول
              </button>
              <button
                className="header-button"
                onClick={() => Navigate("/Register", { replace: true })}
              >
                حساب جديد
              </button>
            </>
          )}

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p className="header-nav cursor-pointer  " 
            onClick={() => Navigate("/cart", { replace: true })}>سلة المشتريات </p>
            <p
              className="header-nav  text-[#d44211]"
             
            >
              طلباتك
            </p>
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

      {location.pathname === "/Register" && (
        <>
          <div className="flex items-center space-x-6 flex-1">
            <button
              className="header-button"
              onClick={() => Navigate("/Login", { replace: true })}
            >
              سجل الدخول
            </button>
          </div>

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

      {location.pathname === "/Login" && (
        <>
          <div className="flex items-center space-x-6 flex-1">
            <button
              className="header-button"
              onClick={() => Navigate("/Register", { replace: true })}
            >
              حساب جديد
            </button>
          </div>

          <nav className="flex-2 flex items-center justify-center space-x-10">
            <p
              className="header-nav cursor-pointer"
              onClick={() => Navigate("/", { replace: true })}
            >
              القائمة الرئيسية
            </p>
          </nav>
        </>
      )}

      <div className="flex-1 flex items-center justify-end">
        <img src="/logo.png" alt="سيخ كفتة" className="w-20" />
      </div>
    </header>
  );
}

export default Header;
