import "./Styles/App.css";
import "./Styles/AdminProfile.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import FoodDetails from "./Pages/FoodDetails";
import Cart from "./Pages/Cart";

import AdminLayout from "./Layout/AdminLayout"
import AdminHomeProfile from "./Pages/AdminProfile/AdminHomeProfile";
import AdminFood from "./Pages/AdminProfile/AdminFood";
import AdminUsers from "./Pages/AdminProfile/AdminUsers";
import AdminSettings from "./Pages/AdminProfile/AdminSettings";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MdDeliveryDining } from "react-icons/md";

function App() {
    const router = createBrowserRouter([
        { path: "/", element: <Home /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/food/:id", element: <FoodDetails /> },
        { path: "/cart", element: <Cart /> },
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
                    element: <MdDeliveryDining />,
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

    return <RouterProvider router={router} />;
}

export default App;
