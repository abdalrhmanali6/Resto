import './App.css'
import Register from './Pages/Register'
import Login from './Pages/Login';
import Home from './Pages/Home';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
function App() {
  

const route=createBrowserRouter([
  {path:"/",
    element:<Home/>
  },
    {
      path:"/Register",
      element:<Register/>
    },
    {
      path:"/Login",
      element:<Login/>
    }
  ])

  return (
    <>
     <RouterProvider router={route}/>
     
     
    </>
  )
}

export default App
