// import { Link } from "react-router-dom";
import { Form, redirect } from "react-router-dom"

export async function loginAPI({request,params}) {
    //PETICION AL BACK PARA LOGEAR CON TOKEN
    return redirect(`/home`)
}

export default function Login(){
    return (
        <>
            <Form method="post">
                <label htmlFor="">Usuario:</label>
                <input type="text" name="" id="" />
                <label htmlFor="">Contraseña:</label>
                <input type="password" name="" id="" />
                <input type="submit" value="Iniciar Sesion" />
            </Form>
        </>
    )
}