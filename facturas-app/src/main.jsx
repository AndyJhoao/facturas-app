import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'

import Root from './routes/Root'
import Error from './routes/Error'
import Login, { loginAPI } from './routes/Login'
import Home from './routes/Home'
import { getFacturas as rootLoader } from './services/Facturas'
import RegistroFactura, { registroAPI } from './routes/RegistroFactura'

const router = createBrowserRouter([
  {
    path:"/",
    element: <Root></Root>,
    errorElement: <Error></Error>,
    children: [
      {
        path:"login",
        element: <Login></Login>,
        action: loginAPI
      },
      {
        path:"home",
        element: <Home></Home>,
        loader: rootLoader
      },
      {
        path:"home/facturas/new",
        element: <RegistroFactura></RegistroFactura>,
        action: registroAPI
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
