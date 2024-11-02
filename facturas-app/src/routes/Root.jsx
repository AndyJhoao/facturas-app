import { Outlet,Link } from "react-router-dom";

export default function Root(){
    return (
        <>
            <div className="header">
                <h1>
                    Facturas App
                </h1>
                <nav>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                </nav>
            </div>
            <div className="container">
                <Outlet></Outlet>
            </div>
        </>
    )
}