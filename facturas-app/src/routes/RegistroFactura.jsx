import { useState, useEffect } from "react";
import { Form, redirect, useLocation, useNavigate  } from "react-router-dom"
import Swal from 'sweetalert2'

export async function registroAPI({ request }) {
    const formData = await request.formData();
    try {
        const response = await fetch('http://127.0.0.1:8000/api/validarXML', {
            method: 'POST',
            headers: {
                'Authorization':'Token ' + localStorage.getItem('token')
            },
            body: formData, // Envía el FormData con el archivo
        });

        if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
                customClass: "alert",
                // position: "top-end",
                icon: "success",
                title: `Se ha registrado con exito`,
                text: `la factura con UUID: ${responseData.id_factura}`,
                showConfirmButton: false,
                timer: 2500
            })
            return redirect(`/home`);
        }else {
            const responseData = await response.json();
            Swal.fire({
                customClass: "alert",
                // position: "top-end",
                icon: "error",
                title: responseData.error || "Error desconocido",
                showConfirmButton: false,
                timer: 2500
            });
            return redirect(`/home`);
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "error",
            title: "Hubo un problema de conexión",
            text: "Por favor, inténtelo de nuevo",
            showConfirmButton: false,
            timer: 2500
        });
        return redirect(`/home`);
    }
}

export async function actualizarFactura(form) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
    }
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/facturas/update/${form.id}`, {
            method: 'PUT',
            headers: {
                'Authorization':'Token ' + localStorage.getItem('token')
            },
            body: formData,
        });
        return response.json();
        
    } catch (error) {
        console.log(error)
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "error",
            title: "Hubo un problema de conexión",
            text: "Por favor, inténtelo de nuevo",
            showConfirmButton: false,
            timer: 2500
        });
    }
}

export async function obtenerFactura(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/facturas/${id}`, {
            method: 'GET',
            headers: {
                'Authorization':'Token ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData
        }else {
            const responseData = await response.json();
            Swal.fire({
                customClass: "alert",
                // position: "top-end",
                icon: "error",
                title: "Ocurrio un error",
                text: responseData.error,
                showConfirmButton: false,
                timer: 2500
            });
            return redirect(`/home`);
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            customClass: "alert",
            // position: "top-end",
            icon: "error",
            title: "Hubo un problema de conexión",
            text: "Por favor, inténtelo de nuevo",
            showConfirmButton: false,
            timer: 2500
        });
        return redirect(`/home`);
    }
}

export default function RegistroFactura(){
    const location = useLocation()
    const navigate = useNavigate()
    const { state } = location
    const [isReadOnly, setIsReadOnly] = useState(false)
    const [formData, setFormData] = useState({
        fecha: "",
        id: 0,
        id_factura: "",
        proveedor: "",
        tipo_comprobante: "",
        value: "0"
    })
    
    const handleSubmit = (e,data) => {
        if (e.target.name === "guardar") {
            if(data.tipo_comprobante.length > 1){
                Swal.fire({
                    customClass: "alert",
                    title:'Error en validaciones',
                    html: `<div><p>Favor de ingresar solo un carácter en </p><p>- Tipo de Comprobante</p></div>`
                });
            }
            else if(isNaN(parseFloat(data.value))){
                Swal.fire({
                    customClass: "alert",
                    title:'Error en validaciones',
                    html: `<div><p>Favor de ingresar solo dígitos en </p><p>- Valor</p></div>`
                });
            
            }else{
                Swal.fire({
                    customClass: "alert",
                    title: "¿Seguro que quieres actualizar esta Factura?",
                    showDenyButton: true,
                    confirmButtonText: "Actualizar",
                    denyButtonText: `Cancelar`
                    }).then((result) => {
                    if (result.isConfirmed) {
                        actualizarFactura(data).then((res)=>{
                            if (!('error' in res)) {
                                Swal.fire({
                                    customClass: "alert",
                                    // position: "top-end",
                                    icon: "success",
                                    title: `Se ha actualizó con éxito`,
                                    text: `La factura con UUID: ${res.id_factura}`,
                                    showConfirmButton: false,
                                    timer: 2500
                                })
                                navigate(`/home`);
                            }else {
                                Swal.fire({
                                    customClass: "alert",
                                    // position: "top-end",
                                    icon: "error",
                                    title: res.error || "Error desconocido",
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                            }
                        });
                    }
                });
            }
            
        } else if (e.target.name === "registrar") {
            registroAPI(formData);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };
   
    useEffect(() => {
        if(state){
            if(state.from == 'editAction'){
                setIsReadOnly(true)
                const { id } = state.data
                obtenerFactura(id).then(res=>{
                    setFormData(res)
                })
            }
        }
    }, [])
    
    return (
        <>
            <div className="container-form meta">
                {isReadOnly ? <h3 className="titles">Actualización de Facturas</h3> :<h3 className="titles">Registro de Facturas</h3>}
                <Form method="post" className="form" encType="multipart/form-data">
                    {!isReadOnly && <div className="fileUpload">
                        <label style={{marginBottom: "10px", fontSize: "1rem"}} htmlFor="xmlFile">Subir XML de la factura</label>
                        <input style={{fontSize: "0.8rem"}} type="file" name="xmlFact" accept=".xml" id="xmlFile"/>
                    </div>}
                    {!isReadOnly && <p style={{margin: "20px 0px",fontSize: "1rem"}}>Registrar manualmente</p>}
                    
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="idfact">UUID :</label>
                        <input className="inputFact" type="text" name="idfact" id="id_factura" value={formData.id_factura} readOnly={isReadOnly} onChange={handleChange}/>
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="proveedorfact">Proveedor :</label>
                        <input className="inputFact" type="text" name="proveedorfact" id="proveedor" value={formData.proveedor} onChange={handleChange}/>
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="tipoComprobante">Tipo de Comprobante :</label>
                        <input className="inputFact" type="text" name="tipoComprobante" id="tipo_comprobante" value={formData.tipo_comprobante} onChange={handleChange}/>
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="valorfact">Valor :</label>
                        <input className="inputFact" type="number" placeholder="$0.00" name="valorfact" id="value" value={formData.value} onChange={handleChange}/>
                    </div>
                    <div className="form-container_inputs">
                        <label className="labelFact" htmlFor="fechafact">Fecha :</label>
                        <input className="inputFact" type="date" name="fechafact" id="fecha" value={formData.fecha} onChange={handleChange}/>
                    </div>
                    <div>
                        {
                            isReadOnly ? ( <input style={{margin: "20px 0px", fontSize: "0.8rem"}} type="button" className="linkButton" onClick={(e) => handleSubmit(e,formData)} value="Guardar factura" name="guardar" id="guardarFact"/> ) : <input style={{margin: "20px 0px", fontSize: "0.8rem"}} className="linkButton" type="submit" name="registrar" value="Registrar factura"/>
                        }
                    </div>
                    
                </Form>
            </div>
        </>
    )
}