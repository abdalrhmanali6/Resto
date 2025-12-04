import React, { useState } from "react";
import Input from "../Components/Input";
import Api from "../Components/Api";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Headernav";
function Register() {
  const [showPass, setShowpass] = useState(false);
  const [UserData, SetUserData] = useState({});
  const [notSamePassword, setNotSamePassword] = useState("");
  const [error, setError] = useState("");
  const [signedUp, setSignedUp] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    SetUserData({
      email: e.target.elements.email?.value,
      password: e.target.elements.pass?.value,
      phone: e.target.elements.tel?.value,
      first_name: e.target.elements.firstName?.value,
      last_name: e.target.elements.lastName?.value,
      gender: e.target.elements.gender?.value,
      birth_date: e.target.elements.brithDate?.value,
    });

    if (UserData.password !== e.target.elements.re_password?.value) {
      return setNotSamePassword("كلمتا المرور غير متطابقتين");
    }

    Api.post("/users/register", UserData)
      .then((data) => {
        console.log(data);
        
        setSignedUp("تم انشاء الحساب بنجاح سيتم نقلك لصفحة التسجيل");
        setTimeout(() => Navigate("/Login"), 500);
      })
      .catch((e) => {
        console.log(e)
        e.status == 400
          ? setError("هذا الحساب موجود بالفعل")
          : setError("حدث خطأ حاول مرة اخرى لاحقا");
      });
  };

  console.log(UserData)

  return (
    <>
      <Header/>
      <main className=" p-9 bg-[url(/background.jpg)] bg-no-repeat bg-top-right ">
        <div className="flex-1 flex flex-col  mr-6 items-center ">
          <h1>انشئ حسابك</h1>
          <h4 className="mb-4">
            سجل لأكتشاف العروض الحصرية والبدء في طلب وجباتك
          </h4>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div className="flex space-x-7">
              <Input
                name="lastName"
                label="الاسم الاخير"
                type="text"
                placeholder="ادخل اسمك الاخير"
                required
              />
              <Input
                name="firstName"
                label="الاسم الاول"
                type="text"
                placeholder="ادخل اسمك الاول"
                required
              />
            </div>
            <Input
              name="email"
              label="البريد الإلكتروني "
              type="email"
              placeholder="ادخل عنوان بريدك الإلكتروني "
              required
            />
            <Input
              name="pass"
              label="كلمة المرور "
              type={!showPass?"password":"text"}
              placeholder="ادخل كلمة المرور "
              required
              prop={"relative"}
              onChange={() => setError("")}
              element={
                <button type="button" onClick={() => setShowpass(!showPass)}>
                  {showPass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5  absolute top-1/2 left-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5  absolute top-1/2 left-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              }
            />
            <Input
              name="re_password"
              label=" اعادة-كلمة المرور"
              type="password"
              placeholder="  اعد ادخال كلمة المرور "
              required
              element={
                notSamePassword ? (
                  <p className="error">{notSamePassword}</p>
                ) : null
              }
              onChange={() => setNotSamePassword("")}
            />
            <div className="flex space-x-7">
              <Input
                name="brithDate"
                label="تاريخ الميلاد "
                type="date"
                required
              />
              <Input
                name="tel"
                label=" رقم الهاتف"
                type="tel"
                placeholder=" +20 10 1234 5678 "
                required
              />
            </div>
            <div className="flex flex-col items-end space-y-2">
              <label htmlFor="gender">الجنس</label>
              <select
                name="gender"
                className="border border-gray-300 rounded-3xl pl-20  pr-4 py-4 w-full placeholder:text-end outline-0 text-right"
              >
                <option value="male">ذكر</option>
                <option value="female">انثى</option>
              </select>
            </div>          
            {signedUp && (
              <p className="green flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5  animate-spin "
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>

                {signedUp}
              </p>
            )}
            {error ? <p className="error">{error}</p> : null}
            <button
              type="submit"
              className="nav-btn bg-(--primary-color) text-white py-4 px-5 rounded-3xl hover:bg-amber-600"
            >
              انشاء الحساب
            </button>
            <p
              className="text-center text-gray-500 cursor-pointer active:opacity-50"
              onClick={() => {
                Navigate("/Login");
              }}
            >
              لديك حساب بالفعل ؟ سجل الأن
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

export default Register;
