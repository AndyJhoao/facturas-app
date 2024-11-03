import Swal from "sweetalert2";
import { Form, redirect } from "react-router-dom"

export async function registroUsuario({request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const response = await fetch(`http://127.0.0.1:8000/api/register`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        const responseData = await response.json();
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "success",
            title: "Registro exitoso",
            text: `Favor de iniciar sesion ${responseData.user}` ,
            showConfirmButton: false,
            timer: 1500
        });
        return redirect(`/login`)
    }else {
        const responseData = await response.json();
        if("username" in responseData){
            Swal.fire({
                customClass: "alert",
                // position: "top-end",
                icon: "error",
                title: "Registro no exitoso",
                text: "Ya existe una cuenta con ese nombre de usuario",
                showConfirmButton: false,
                timer: 1500
            });
        }
        return redirect(`/`);
    }

}

export default function Registro(){
    return (
        <>
            <div className="container-form meta">
                <h3 className="titles">Registro de nuevos usuarios</h3>
                <Form method="post" className="form">
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="email">Correo:</label>
                        <input className="inputFact" type="email" name="email" id="email" />
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="username">Usuario:</label>
                        <input className="inputFact" type="text" name="username" id="username" />
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="password">Contraseña:</label>
                        <input className="inputFact" type="password" name="password" id="password" />
                    </div>
                    <div>
                        <input type="submit" style={{margin: "20px 0px", fontSize: "0.8rem"}} className="linkButton" value="Registrarse" />
                    </div>
                    
                    
                </Form>
            </div>
        </>
    )
}