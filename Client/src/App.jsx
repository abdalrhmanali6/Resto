import "./App.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import FoodDetails from "./Pages/FoodDetails";
import Cart from "./Pages/Cart";
import Order from "./Pages/Order";
import SetOrder from "./Pages/SetOrder";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  const route = createBrowserRouter([
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
    }
    
  ]);

  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;
