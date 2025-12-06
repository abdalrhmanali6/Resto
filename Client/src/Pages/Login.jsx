import React, { useState } from "react";
import Input from "../Components/Input";
import Api from "../Components/Api";
import Header from "../Components/Headernav";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPass, setShowpass] = useState(false);
    const [UserData, SetUserData] = useState({});
    const [Token, SetToken] = useState("");
    const [error, setError] = useState("");
    const Navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = e.target.elements.email?.value;
        const password = e.target.elements.pass?.value;

        Api.post("/users/login", {
            email: email,
            password: password,
        })
            .then((res) => {
                console.log(res);
                const { token, user } = res.data.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setTimeout(() => Navigate("/", { replace: true }), 500);
            })
            .catch((e) => {
                console.log(e);
                console.log(e.response.data?.message);
                e.response.data?.message == "no user with this email"
                    ? setError("لا يوجد حساب بهذا البريد الالكتروني")
                    : e.response.data?.message == "Wrong Password"
                    ? setError("كلمة المرور غير صحيحة")
                    : setError("حدث خطأ حاول مرة اخرى لاحقا");
            });
    };

    return (
        <>
            <Header />

            <main className=" h-full  w-full p-10 bg-[url(/background.jpg)] bg-no-repeat  flex  justify-center bg-cover">
                <div className="  flex flex-col  mr-6 items-center p-17  bg-[#f8f7f5] shadow-2xl rounded-3xl">
                    <h1>مرحبآ بعودتك </h1>
                    <h4 className="mb-7">سجل الدخول لحسابك الان</h4>
                    <form
                        className="flex flex-col space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            name="email"
                            label="البريد الإلكتروني "
                            type="email"
                            placeholder="ادخل  بريدك الإلكتروني "
                            required
                        />
                        <Input
                            name="pass"
                            label="كلمة المرور "
                            type={!showPass ? "password" : "text"}
                            placeholder="ادخل كلمة المرور "
                            required
                            prop={"relative"}
                            onChange={() => setError("")}
                            element={
                                <button
                                    type="button"
                                    onClick={() => setShowpass(!showPass)}
                                >
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
                        {error ? <p className="error">{error}</p> : null}
                        <button
                            type="submit"
                            className="nav-btn bg-(--primary-color) text-white py-4 px-5 rounded-3xl hover:bg-amber-600"
                        >
                            تسجيل الدخول
                        </button>
                        <p
                            className="text-center text-gray-500 cursor-pointer active:opacity-50"
                            onClick={() => {
                                Navigate("/Register", { replace: true });
                            }}
                        >
                            ليس لديك حساب؟ انشئ حسابك الان
                        </p>
                    </form>
                </div>
            </main>
        </>
    );
}

export default Login;
