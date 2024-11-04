import Swal from "sweetalert2";
import { Form, redirect } from "react-router-dom"

export async function loginAPI({request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const response = await fetch(`http://127.0.0.1:8000/api/login`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('token',responseData.token)
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "success",
            title: "Inicio de sesion correcto",
            showConfirmButton: false,
            timer: 1500
        });
        return redirect(`/home`)
    }else {
        const responseData = await response.json();
        if('detail' in responseData){
            Swal.fire({
                customClass: "alert",
                icon: "error",
                title: "No existe el Usuario",
                showConfirmButton: false,
                timer: 1500
            });
        }else if('error' in responseData){
            Swal.fire({
                customClass: "alert",
                icon: "error",
                title: "Contraseña incorrecta",
                showConfirmButton: false,
                timer: 1500
            });
        }
        return redirect(`/login`);
    }

}

export default function Login(){
    return (
        <>
            <div className="container-form meta">
                <h3 className="titles">Inicio de sesion</h3>
                <Form method="post" className="form">
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="username">Usuario:</label>
                        <input className="inputFact" type="text" name="username" id="username" />
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="password">Contraseña:</label>
                        <input className="inputFact" type="password" name="password" id="password" />
                    </div>
                    <div>
                        <input type="submit" style={{margin: "20px 0px", fontSize: "0.8rem"}} className="linkButton" value="Iniciar Sesion" />
                    </div>
                    
                    
                </Form>
            </div>
        </>
    )
}