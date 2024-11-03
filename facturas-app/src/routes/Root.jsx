import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import { Outlet,Link } from "react-router-dom"
import Swal from "sweetalert2"

export default function Root(){
    const navigate = useNavigate()
    const { auth } = useLoaderData()
    const [isAuthenticated, setIsAuthenticated] = useState(auth)

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "info",
            title: "Sesion cerrada con exito",
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleHomeClick = (e) =>{
        e.preventDefault()

        const token = localStorage.getItem('token')

        if(token){
            navigate('/home')
        }else{
            Swal.fire({
                customClass: "alert",
                // position: "top-end",
                icon: "warning",
                title: "Favor de iniciar sesion",
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/login')
        }
    }

    return (
        <>
            <div className="header">
                <h1>
                    Facturas App
                </h1>
                <nav className="navbar">
                    <div className="nav-link">
                        {isAuthenticated ? (
                            <Link to="/" onClick={handleLogout}>Logout</Link>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </div>
                        {
                            !isAuthenticated && <div className="nav-link"><Link to="/registro" >Registro</Link></div> 
                        }
                    <div className="nav-link">
                        <Link to="/home" onClick={handleHomeClick}>Facturas</Link>
                    </div>
                </nav>
            </div>
            <div>
                <Outlet context={{ setIsAuthenticated }}></Outlet>
            </div>
        </>
    )
}