import { Router } from "express"
const products = Router();
import { promises as fs } from "fs"
import { fileURLToPath } from "url";
//--------------------------------------- IMPORTACIONES DE CONTROLLERS ---------------------------------------------
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
    apiProductosDinamicoDelete
} from "../controllers/products.controllers.js"
//--------------------------------------- IMPORTACIONES DE CONTROLLERS ---------------------------------------------
import { addLogger } from "../utils/logger.js";

// PETICIONES GET, POST, PUT, DELETE CONECTADA CON ---MongoDB--- 

// RUTA "GET" CONECTADA "mongoDB  ATLAS" PARA VER TODOS LOS PRODUCTOS, CON QUERY "?LIMIT=" PARA BUSCAR LA CANTIDAD DE PRODUCTOS DESEADA, 
// CON "?SORT=" PARA ORDENAR DEL PRODUCTO DE MANERA ASCENDENTE O DESCENDENTE SEGUN SU PRECIO,
// CON "?PAGE=" PARA BUSCAR LA PAGINA DESEADA,
// CON "?CATEGORY=" PARA FILTRAR LA CATEGORIA DE PRODUCTOS DESEADA (¡¡¡ BUSCAR LAS CATEGORIAS SEGUN FIGURAN, SON CASE SENSITIVE !!!) 

// products.get("/api/productsDB", apiProductsDB)
products.get("/api/productsDB", apiProductsDB)

// RUTA PARA VER LOS PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.get("/api/productsDB/:pid", addLogger, apiProductsDBDinamico)

// RUTA "POST" PARA AGREGAR PRODUCTOS CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS. Conectado a MongoDB
products.post("/api/productsDB", addLogger, apiProductsDBPost)

// RUTA DELETE PARA ELIMINAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.delete("/api/productsDB/:pid", addLogger, apiProductsDBDinamicoDelete)

// RUTA PARA MODIFICAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
products.put("/api/productsDB/:pid", addLogger, apiProductsDBDinamicoPut)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

export default products




















//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
// import { promises as fs } from "fs"
// import { Router } from "express"
// import ProductManager from "../ProductManager.js";
// const products = Router();
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import ProductsManager2 from "../DAO/productsDAO.js";
// import { fileURLToPath } from "url";
// const product2 = new ProductsManager2()
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import ProductsModel from "../DAO/models/products.model.js";
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const product1 = new ProductManager()

// // PETICIONES GET, POST, PUT, DELETE CONECTADA CON ---MongoDB--- 

// // RUTA "GET" CONECTADA "mongoDB  ATLAS" PARA VER TODOS LOS PRODUCTOS, CON QUERY "?LIMIT=" PARA BUSCAR LA CANTIDAD DE PRODUCTOS DESEADA, 
// // CON "?SORT=" PARA ORDENAR DEL PRODUCTO DE MANERA ASCENDENTE O DESCENDENTE SEGUN SU PRECIO,
// // CON "?PAGE=" PARA BUSCAR LA PAGINA DESEADA,
// // CON "?CATEGORY=" PARA FILTRAR LA CATEGORIA DE PRODUCTOS DESEADA (¡¡¡ BUSCAR LAS CATEGORIAS SEGUN FIGURAN, SON CASE SENSITIVE !!!) 

// products.get("/api/productsDB", async (req, res) => {
//     const limit = parseInt(req.query.limit) || 7 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
//     const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
//     const sort = req.query.sort // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
//     const category = req.query.category // Sirve para filtrar los productos segun su categoria (estas son case sensitive)
//     const title = req.query.title // Sirve para filtrar los productos segun su titulo (estas son case sensitive)

//     const existeCategory = category ? {category} : null
//     const existeTitle = title ? {title} : null
    
//     const productos = await ProductsModel.paginate( { ...existeCategory, ...existeTitle }, { limit, page, sort } );    
//     res.send(productos)
//     console.log(productos);
// })


// // RUTA PARA VER LOS PRODUCTOS SEGUN SU ID. Conectado a MongoDB
// products.get("/api/productsDB/:pid", async (req, res) => {
//     try {
//         let pid = req.params.pid;
//         let producto = await product2.getAllProducts();
//         let productoBuscado = producto.find((prod) => prod._id.toString() === pid);

//         if (productoBuscado) {
//             res.send({ status: "success", payload: productoBuscado });
//         } else {
//             res.send({ message: "Producto no encontrado" })
//         }

//     } catch (error) {
//         res.status(400).send({ status: "Error", message: "Error al obtener el producto seleccionado." });
//     }
// });

// // RUTA POST PARA AGREGAR PRODUCTOS CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS. Conectado a MongoDB
// products.post("/api/productsDB", async (req, res) => {
//     try {
//         const results = await product2.addProducts(req.body)
//         res.send({ status: "success", payload: results })
//     } catch (error) {
//         res.status(400).send({ status: "error", error })
//     }
// })

// // RUTA DELETE PARA ELIMINAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
// products.delete("/api/productsDB/:pid", async (req, res) => {
//     let { pid } = req.params
//     try {
//         let result = await product2.deleteProductById(pid)
//         if (result) {
//             res.send({ status: "success", payload: result })
//         } else {
//             res.send({ status: "success", message: "Se elimino el producto." })
//         }
//     } catch (error) {
//         res.status(400).send({ status: "error", message: "Error al intentar eliminar el producto." })
//     }
// })

// // RUTA PARA MODIFICAR PRODUCTOS SEGUN SU ID. Conectado a MongoDB
// products.put("/api/productsDB/:pid", async (req, res) => {
//     try {
//         const { pid } = req.params
//         const productoAModificar = req.body
//         const result = product2.updateProduct(pid, productoAModificar)

//         res.send({ status: "success", payload: result })
//     } catch (error) {
//         res.status(400).send({ status: "error", message: "Producto no encontrado." })
//     }
// })

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // PETICIONES GET, POST, PUT Y DELETE CON ---FILESYSTEM---
// // RUTA PARA VER TODOS LOS PRODUCTOS. INCLUSO CON ?LIMIT=(+ NUMERO) PODES VER ELEGIR LA CANTIDAD DE PRODUCTOS QUE DESEAS VER.
// products.get("/api/productos", async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit)
//         const productos = await product1.getProducts()

//         if (!isNaN(limit)) {
//             const limiteDeProductos = productos.slice(0, limit)
//             res.send(limiteDeProductos)
//         } else {
//             res.send(productos)
//         }
//     } catch (error) {
//         console.log("Error al leer productos.json", error)
//         res.status(500).send({ status: "error", message: "Error al leer productos.json" })
//     }
// })

// // RUTA PARA VER PRODUCTOS SEGUN SU ID
// products.get("/api/productos/:pid", async (req, res) => {
//     try {
//         const pid = parseInt(req.params.pid)
//         const productos = await product1.getProducts()
//         const productorPorId = productos.find(prod => prod.id === pid)

//         if (!productorPorId) {
//             console.log(`Producto con ${pid} no encontrado.`)
//             res.send(productos)
//         } else {
//             res.send(productorPorId)
//         }

//     } catch (error) {
//         console.log("Error al encontrar encontrar producto buscado por Id.")
//         res.status(500).send({ status: "error", message: "No se encontro el producto del Id indicado." })
//     }
// })

// // METODO POST DE API/PRODUCTOS. PARA AGREGAR MAS PRODUCTOS AL PRODUCTOS.JSON
// products.post("/api/productos", async (req, res) => {
//     try {
//         const nuevoProducto = req.body

//         if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.code || !nuevoProducto.price || !nuevoProducto.stock || !nuevoProducto.category) {
//             return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
//         }

//         const productos = await product1.addProducts(nuevoProducto)
//         res.status(201).send({ status: "success", message: "Exito al agregar nuevo producto." })
//     } catch (error) {
//         console.log("Error al leer o escribir en productos.json");
//         res.status(400).send({ status: "error", message: "Error al leer o escribir en productos.json" });
//     }
// })

// // METODO PUT PARA MODIFICAR PRODUCTOS SEGUN SU ID. (EN EL CLIENTE DESEADO PONER METODO PUT CON LA RUTA DEL ID A CAMBIAR, Y CAMBIAR SUS PROPIEDADES CON TODOS LOS CAMPOS OBLIGATORIOS)
// products.put("/api/productos/:pid", async (req, res) => {
//     try {
//         const pid = parseInt(req.params.pid)
//         const productoActualizado = req.body
//         await product1.updateProduct(pid, productoActualizado)
//         const productoExistente = await product1.getProductById(pid)

//         if (!productoExistente) {
//             res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
//         } else {
//             res.status(201).send({ status: "success", message: `Exito al modificar el producto con id ${pid}` })
//         }

//     } catch (error) {
//         console.log("Error al modificar el producto elegido productos.json", error);
//         res.status(404).send({ status: "error", message: "Error al intentar modificar producto en productos.json" });
//     }
// })

// // METODO DELETE PARA ELIMINAR UN PRODUCTO SEGUN SU ID.
// products.delete("/api/productos/:pid", async (req, res) => {
//     try {
//         const pid = parseInt(req.params.pid)
//         const productoExistente = await product1.getProductById(pid)

//         if (!productoExistente) {
//             res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
//         } else {
//             await product1.deleteProduct(pid)
//             res.status(201).send({ status: "success", message: `Exito al eliminar producto con id ${pid}` })
//         }

//     } catch (error) {
//         console.log("Error al eliminar producto en productos.json", error)
//         res.status(404).send({ status: "error", message: "Error al eliminar producto en productos.json." })
//     }
// })

// export default products