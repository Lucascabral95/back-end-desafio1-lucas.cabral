import { Router } from "express"
const cart = Router()
import { accessDeniedAdmin } from "../middlewares/auth.js"
import { addLogger } from "../utils/logger.js"
import {
    controllersApiCartsDB,
    controllersApiCartsDBDinamico,
    controllersApiCartDBPost,
    controllersApiCartDBDinamicoProductsDinamico,
    controllersApiCartDBPutProductsPut,
    controllerApiCartDBDinamicoPut,
    controllerApiCartDBDinamicoProductsDinamicoDelete,
    controllerApiCartDBDinamicoDelete,
    cartsParams,
    productsDiscointInCart,
    controllerStock,
    controllerTicket,
} from "../controllers/cart.controllers.js"

// RUTA "GET" PARA OBTENER TODOS LOS CARRITOS CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS HAY). CON "POPULATE"
cart.get("/api/cartsDB", addLogger, controllersApiCartsDB)

// RUTA "GET" PARA OBTENER UN CARRITO SEGUN SU ID CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS TIENE). CON "POPULATE"
cart.get("/api/cartsDB/:cid", addLogger, controllersApiCartsDBDinamico)

// LOGICA DE METODO "POST" PARA CREAR UN NUEVO "CARRITO" QUE SE AGREGARA EN LA COLECCION DE "CARTS" DE mongoDB ATLAS. 
cart.post("/api/cartsDB", addLogger, controllersApiCartDBPost)

// LOGICA DE METODO "POST" PARA AGREGAR UN "PRODUCTO" SEGUN SU ID EN UN "CARRITO" ESPECIFICO SEGUN SU ID.
cart.post("/api/cartsDB/:cid/products/:pid", addLogger, controllersApiCartDBDinamicoProductsDinamico)

// LOGICA DE METODO "POST" PARA DISMINUIR CANTIDAD DE UN "PRODUCTO" SEGUN SU ID EN UN "CARRITO" ESPECIFICO SEGUN SU ID.
cart.post("/api/cartsDB/:cid/products/:pid/discont", productsDiscointInCart)

// LOGICA DE METODO "PUT" PARA MODIFICAR SOLO LA "QUANTITY" DEL PRODUCTO SELECCIONADO EN EL CARRITO SELECCIONADO.
cart.put("/api/cartsDB/:cid/products/:pid", addLogger, controllersApiCartDBPutProductsPut)

// LOGICA DE METODO "PUT" QUE PERMITE ACTUALIZAR EL CARRITO SELECCIONADO POR "/:CID" CON UN ARREGLO DE PRODUCTOS QUE LE PASO POR EL BODY, escribir { "product": "(+ el _id del producto a agregar)"}
cart.put("/api/cartsDB/:cid", addLogger, controllerApiCartDBDinamicoPut)

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS UN PRODUCTO SELECCIONADO DE UN CARRITO SEGUN SU ID.
cart.delete("/api/cartsDB/:cid/products/:pid", addLogger, controllerApiCartDBDinamicoProductsDinamicoDelete)

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS TODOS LOS PRODUCTOS DE UN CARRITO SEGUN SU ID. 
cart.delete("/api/cartsDB/:cid", addLogger, controllerApiCartDBDinamicoDelete)

// RENDERIZA LA VISTA "cardId" QUE TIENE LA LISTA DE TODAS LAS COMPRAS DEL USUARIO, CON SUS RESPECTIVOS DETALLES Y TICKETS GENERADOS 
cart.get("/carts/:cid/purchase", addLogger, accessDeniedAdmin, cartsParams)

// METODO "POST" PARA RESTAR LA CANTIDAD DE STOCK DE UNA COMPRA /CARTS/:PID/:STOCK
cart.post("/cart/:cid/buy", addLogger, controllerStock)

// METODO "POST" PARA CREAR UN TICKET CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS
cart.post("/cart/:cid/purchase", addLogger, controllerTicket)

export default cart
