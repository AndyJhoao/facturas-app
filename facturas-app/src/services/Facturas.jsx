
export const obtenerFacturas = async () => {
    const token = localStorage.getItem('token')
    if(token){
        const response = await fetch(`http://127.0.0.1:8000/api/facturas`,{
            method:'GET',
            headers: {
                'Authorization':'Token ' + localStorage.getItem('token')
            }
        })
        const data = await response.json()

        if ('error' in data) {
            return {"facturas": [] }
        }else if ('detail' in data) {
            return {"unauthorized": true,"facturas": [] }
        }else {
            return {"facturas": data}
        }
    }else{
        return {"unauthorized": true,"facturas": [] }
    }
    
    
}

export const loginLoader = () => {
    const token = localStorage.getItem('token')
    return { auth: Boolean(token) }
}