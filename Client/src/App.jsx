import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MdDeliveryDining } from "react-icons/md";
import "./Styles/App.css";
import "./Styles/AdminProfile.css";
import "./Styles/App.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import FoodDetails from "./Pages/FoodDetails";
import Cart from "./Pages/Cart";
import AdminLayout from "./Layout/AdminLayout";
import AdminHomeProfile from "./Pages/AdminProfile/AdminHomeProfile";
import AdminFood from "./Pages/AdminProfile/AdminFood";
import AdminUsers from "./Pages/AdminProfile/AdminUsers";

import Order from "./Pages/Order";
import SetOrder from "./Pages/SetOrder";
import AdminOrders from "./Pages/AdminProfile/AdminOrders";

function App() {
    const router = createBrowserRouter([
        { path: "/", element: <Home /> },
        {
            path: "/Register",
            element: <Register />,
        },
        {
            path: "/Login",
            element: <Login />,
        },
        {
            path: "/food/:id",
            element: <FoodDetails />,
        },
        {
            path: "/cart",
            element: <Cart />,
        },
        {
            path: "/orders",
            element: <Order />,
        },
        {
            path: "/order/set",
            element: <SetOrder />,
        },
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                {
                    path: "profile",
                    element: <AdminHomeProfile />,
                },
                {
                    path: "foods",
                    element: <AdminFood />,
                },
                {
                    path: "orders",
                    element: <AdminOrders />,
                },
                {
                    path: "users",
                    element: <AdminUsers />,
                },
                {
                    index: true,
                    element: <AdminHomeProfile />,
                },
            ],
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
