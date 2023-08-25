export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades estaban incompletas o no eran válidas.
    Lista de propiedades requeridas: 
    * first_name: necesita ser un String, recibió: ${user.first_name}
    * last_name: necesita ser un String, recibió: ${user.last_name}
    * email: necesita ser un String, recibió: ${user.email}`
}

export const generateProductErrorInfo = (newProduct) => {
    return `Una o mas propiedades estaban incompletas o no eran validas.
    Lista de propiedades requeridas: 
    * title: necesita ser un String, recibió: ${newProduct.title}  
    * description: necesita ser un String, recibió: ${newProduct.description}  
    * code: necesita ser un String, recibió: ${newProduct.code}  
    * price: necesita ser un Number, recibió: ${newProduct.price}  
    * stock: necesita ser un Number, recibió: ${newProduct.stock}  
    * category: necesita ser un String, recibió: ${newProduct.category}`
} 

export const generateTicketErrorInfo = (amount, purchaser) => {
    return`Una o mas propiedades estaban incompletas o no son validas.
    Lista de propiedades requeridas:
    * amount: necesita ser un Number, recibió: ${amount}
    * purchaser: necesita ser un String, recibió: ${purchaser}`
}

export const generateAddToCartErrorInfo = (cid, pid) => {
    return `Una o mas propiedades estaban incompletas o no son validas.
    Lista de propiedades requeridas:
    * Id de carrito: necesita ser un String: recibió: ${cid}
    * Id de producto: necesita ser un String: recibió: ${pid}`
}
