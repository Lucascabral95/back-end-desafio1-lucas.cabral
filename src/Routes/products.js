import { Router } from "express"
const products = Router();
import { addLogger } from "../utils/logger.js";
import { auth } from "../middlewares/auth.js";
import {
    apiProductsDB,
    apiProductsDBDinamico,
    apiProductsDBPost,
    apiProductsDBDinamicoDelete,
    apiProductsDBDinamicoPut,
    apiProducts,
    apiProductosDinamico,
    apiProductosPost,
    apiProductosPut,
    apiProductosDinamicoDelete,
    homeProducts,
    realTimeProducts,
    deleteProductsSocket,
    addProductsSocket,
    homeMongoDB,
    homeMongodbPost,
    homeMongodbDinamica,
    deleteUserAndSendEmail,
} from "../controllers/products.controllers.js"

// RUTA "GET" CONECTADA "mongoDB  ATLAS" PARA VER TODOS LOS PRODUCTOS, CON QUERY "?LIMIT=" PARA BUSCAR LA CANTIDAD DE PRODUCTOS DESEADA, 
// CON "?SORT=" PARA ORDENAR DEL PRODUCTO DE MANERA ASCENDENTE O DESCENDENTE SEGUN SU PRECIO,
// CON "?PAGE=" PARA BUSCAR LA PAGINA DESEADA,
// CON "?CATEGORY=" PARA FILTRAR LA CATEGORIA DE PRODUCTOS DESEADA (¡¡¡ BUSCAR LAS CATEGORIAS SEGUN FIGURAN, SON CASE SENSITIVE !!!) 

// products.get("/api/productsDB", apiProductsDB)
products.get("/api/productsDB", addLogger, apiProductsDB)

// RUTA PARA VER LOS PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.get("/api/productsDB/:pid", addLogger, apiProductsDBDinamico)

// RUTA "POST" PARA AGREGAR PRODUCTOS CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS. Conectado a MongoDB
products.post("/api/productsDB", addLogger, apiProductsDBPost)

// RUTA DELETE PARA ELIMINAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.delete("/api/productsDB/:pid", addLogger, apiProductsDBDinamicoDelete)

// RUTA PARA MODIFICAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.put("/api/productsDB/:pid", addLogger, apiProductsDBDinamicoPut)

// PETICIONES GET, POST, PUT Y DELETE CON ---FILESYSTEM---
// RUTA PARA VER TODOS LOS PRODUCTOS. INCLUSO CON ?LIMIT=(+ NUMERO) PODES VER ELEGIR LA CANTIDAD DE PRODUCTOS QUE DESEAS VER.
products.get("/api/productos", addLogger, apiProducts)

// RUTA PARA VER PRODUCTOS SEGUN SU ID
products.get("/api/productos/:pid", addLogger, apiProductosDinamico)

// METODO POST DE API/PRODUCTOS. PARA AGREGAR MAS PRODUCTOS AL PRODUCTOS.JSON
products.post("/api/productos", addLogger, apiProductosPost)

// METODO PUT PARA MODIFICAR PRODUCTOS SEGUN SU ID. (EN EL CLIENTE DESEADO PONER METODO PUT CON LA RUTA DEL ID A CAMBIAR, Y CAMBIAR SUS PROPIEDADES CON TODOS LOS CAMPOS OBLIGATORIOS)
products.put("/api/productos/:pid", addLogger, apiProductosPut)

// METODO DELETE PARA ELIMINAR UN PRODUCTO SEGUN SU ID.
products.delete("/api/productos/:pid", addLogger, apiProductosDinamicoDelete)

// RUTA "GET" PARA OBTENER LOS PRODUCTOS DE FILE SYSTEM 
products.get("/products/fs", addLogger, homeProducts)

// RUTA "GET" PARA OBTENER LOS PRODUCTOS DE FILE SYSTEM EN TIEMPO REAL CON WEB SOCKET
products.get("/products/fs/socket", addLogger, realTimeProducts)

// RUTA "DELETE" PARA /PRODUCTS/FS/SOCKET
products.delete("/products/fs/socket", addLogger, deleteProductsSocket);

// RUTA "POST" PARA AGREGAR PRODUCTOS A //PRODUCTS/FS/SOCKET
products.post("/products/fs/socket", addLogger, addProductsSocket)

// RUTA "GET" QUE RENDERIZA CON PAGINATION Y AGGREGATION LA VISTA "PRODUCTS.HANDLEBARS". CONECTADO A MongoDB Atlas
products.get("/home-mongoDB", auth, addLogger, homeMongoDB)

// METODO "POST" PARA AGREGAR UN PRODUCTO NUEVO POR MEDIO DE UN FORMULARIO. 
products.post("/home-mongoDB", addLogger, homeMongodbPost)

// METODO "DELETE" PARA ELIMINAR POR _ID UN PRODUCTO DE mongoDB ATLAS. ADEMAS LE ENVIA UN EMAIL AL USUARIO AVISANDOLE 
// QUE UN PRODUCTO QUE EL AGREGO, FUE ELIMINADO
products.delete("/home-mongodb/:pid/:email", addLogger, deleteUserAndSendEmail)

export default products
