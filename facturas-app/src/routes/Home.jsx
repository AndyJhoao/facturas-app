import { Link, useLoaderData, useNavigate } from "react-router-dom";
import del from "../assets/del.svg";
import edit from "../assets/edit.svg";
import create from "../assets/create.svg";
import Swal from 'sweetalert2'
import { useState } from "react";

export default function Home(){
    const { facturas } = useLoaderData()
    const [facturasList, setFacturasList] = useState(facturas)

    const handleClick = (e,factura) => {
        e.preventDefault()
        Swal.fire({
            title: "¿Seguro que quieres eliminar esta Factura?",
            text: `UUID: ${factura.id_factura}/n Valor: $${factura.value}`,
            showDenyButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`
            }).then((result) => {
            if (result.isConfirmed) {
                eliminarFactura(factura.id).then((res)=>{
                    if (!('error' in res)) {
                        setFacturasList(facturasList.filter(fact => fact.id !== factura.id))
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `Se ha eliminado con éxito`,
                            text: `La factura con UUID: ${factura.id_factura}`,
                            showConfirmButton: false,
                            timer: 2500
                        })
                    }else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: res.error || "Error desconocido",
                            showConfirmButton: false,
                            timer: 2500
                        });
                    }
                })
            }
        });
    }
    const eliminarFactura = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/facturas/delete/${id}/`, {
                method: 'DELETE',
            });
            return response.json();
            
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Hubo un problema de conexión",
                text: "Por favor, inténtelo de nuevo",
                showConfirmButton: false,
                timer: 2500
            });
            return response.json();
        }
    }

    return (
        <>
            <div>
                <div className="table">
                    <h3>
                        Bienvenido
                    </h3>
                </div>
                <div className="table" style={{alignItems:'end', marginRight:'20px'}}>
                    <Link to="facturas/new/" className="linkButton center" style={{fontSize:'1rem', color:'white', backgroundColor:'#16a00a'}}> <p className="center" style={{height:'20px', padding:'0px 0px 0px 5px', margin:'3px 0px 3px 10px', alignItems:'end'}}>Factura</p> <img style={{paddingRight:'5px'}} src={create} alt="create" width={22} height={22} /></Link>
                </div>
                <div className="table-header">
                    <div className="header-1">UUID</div>
                    <div className="header-2">Nombre Proveedor</div>
                    <div className="header-3">Tipo de Comprobante</div>
                    <div className="header-3">Valor</div>
                    <div className="header-3">Fecha</div>
                    <div className="header-3">Acciones</div>
                </div>
                <div>
                    
                    { facturasList.length > 0 ? (
                        
                        <div className="table">
                            { 
                                facturasList.map((factura) => (
                                    <div className="row" key={factura.id}>
                                        <p className="row-1">{factura.id_factura}
                                        </p>
                                        <p className="row-2">{factura.proveedor}</p>
                                        <p className="row-3">{factura.tipo_comprobante}</p>
                                        <div className="row-3 right">
                                            <p style={{width:'100%'}}>{formatCurrency(factura.value)}</p>
                                        </div>
                                        <p className="row-3">{factura.fecha}</p>
                                        <div className="row-3">
                                        <Link 
                                            to={"facturas/new/"}
                                            state={{from: 'editAction', data: factura }}
                                            className="linkButton center"
                                            style={{width:'40px',height:'35px'}} >   
                                                <img src={edit} alt="edit" width={20} height={20}/>
                                        </Link>
                                            <button style={{width:'40px',height:'35px'}}  onClick={e=>handleClick(e,factura)} className="center"><img src={del} alt="delete" width={20} height={20}/></button>
                                        </div>
                                        
                                    </div>
                                ))
                            }
                        </div>
                    ) : <div className="center"><p style={{fontStyle:'italic'}}> Sin facturas . . . </p></div>}
                </div>
            </div>
        </> 
    )
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Puedes cambiar 'USD' al código de la moneda que necesites
    }).format(value);
}