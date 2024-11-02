
export const getFacturas = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/facturas/`,{
        method:'GET'
    })
    const data = await response.json()
    if ('error' in data) {
        return {"facturas": [] }
    }else{
        return {"facturas": data}
    }
}