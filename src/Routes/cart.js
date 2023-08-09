import { Router } from "express"
const cart = Router()
import { promises as fs } from "fs"
//------------------------------------ IMPORTACIONES DE VIEWSLAYER ---------------------------------------
import {
    controllersApiCartsDB,
    controllersApiCartsDBDinamico,
    controllersApiCartDBPost,
    controllersApiCartDBDinamicoProductsDinamico,
    controllersApiCartDBPutProductsPut,
    controllerApiCartDBDinamicoPut,
    controllerApiCartDBDinamicoProductsDinamicoDelete,
    controllerApiCartDBDinamicoDelete
} from "../controllers/cart.controllers.js"
//------------------------------------ IMPORTACIONES DE VIEWSLAYER ---------------------------------------

// RUTA "GET" PARA OBTENER TODOS LOS CARRITOS CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS HAY). CON "POPULATE"
cart.get("/api/cartsdb", controllersApiCartsDB)

// RUTA "GET" PARA OBTENER TODOS LOS CARRITOS SEGUN SU ID CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS TIENE). CON "POPULATE"
cart.get("/api/cartsdb/:cid", controllersApiCartsDBDinamico)

// LOGICA DE METODO "POST" PARA CREAR UN NUEVO "CARRITO" QUE SE AGREGARA EN LA COLECCION DE "CARTS" DE mongoDB ATLAS. 
cart.post("/api/cartsDB", controllersApiCartDBPost)

// LOGICA DE METODO "POST" PARA AGREGAR UN "PRODUCTO" SEGUN SU ID EN UN "CARRITO" ESPECIFICO SEGUN SU ID.
cart.post("/api/cartsDB/:cid/products/:pid", controllersApiCartDBDinamicoProductsDinamico)

// LOGICA DE METODO "PUT" PARA MODIFICAR SOLO LA "QUANTITY" DEL PRODUCTO SELECCIONADO EN EL CARRITO SELECCIONADO.
cart.put("/api/cartsDB/:cid/products/:pid", controllersApiCartDBPutProductsPut)

// LOGICA DE METODO "PUT" QUE PERMITE ACTUALIZAR EL CARRITO SELECCIONADO POR "/:CID" CON UN ARREGLO DE PRODUCTOS QUE LE PASO POR EL BODY, escribir { "product": "(+ el _id del producto a agregar)"}
cart.put("/api/cartsDb/:cid", controllerApiCartDBDinamicoPut)

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS UN PRODUCTO SELECCINADO DE UN CARRITO SEGUN SU ID.
cart.delete("/api/cartsDB/:cid/products/:pid", controllerApiCartDBDinamicoProductsDinamicoDelete)

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS TODOS LOS PRODUCTOS DE UN CARRITO SEGUN SU ID. 
cart.delete("/api/cartsDB/:cid", controllerApiCartDBDinamicoDelete)

export default cart






//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
// import { Router } from "express"
// import { promises as fs } from "fs"
// import CartManager from "../CartManager.js"
// import CartsManager2 from "../DAO/CartsDAO.js"
// import products from "./products.js"

// import CartModel from "../DAO/models/carts.model.js"
// import cartsModel from "../DAO/models/carts.model.js"
// import productsModel from "../DAO/models/products.model.js"

// const cart = Router()

// const cart2 = new CartsManager2()
// const cart1 = new CartManager()

// // ESTE ES TODO EL CODIGO DE "CARTS" QUE SE PIDE PARA LA "SEGUNDA PRE-ENTREGA DEL PROYECTO FINAL" //  
// // CODIGO CON PETICIONES "GET", "POST", "PUT" Y "DELETE" DE "MONGO ATLAS" Y "POPULATE".

// // RUTA "GET" PARA OBTENER TODOS LOS CARRITOS CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS HAY). CON "POPULATE"
// cart.get("/api/cartsdb", async (req, res) => {
//     try {
//         const carts = await cartsModel.find().populate("products.product");

//         res.json(carts)
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // RUTA "GET" PARA OBTENER TODOS LOS CARRITOS SEGUN SU ID CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS TIENE). CON "POPULATE"
// cart.get("/api/cartsdb/:cid", async (req, res) => {
//     try {
//         const { cid } = req.params;
//         const cart = await cartsModel.findById(cid).populate("products.product");

//         if (!cart) {
//             return res.status(404).json({ error: "Carrito no encontrado" });
//         }

//         res.send({ status: "Success", cart: cart })
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

// // LOGICA DE METODO "POST" PARA CREAR UN NUEVO "CARRITO" QUE SE AGREGARA EN LA COLECCION DE "CARTS" DE mongoDB ATLAS. 
// cart.post("/api/cartsDB", async (req, res) => {
//     try {
//         const body = req.body
//         const newCart = await cartsModel.create(body)

//         res.send({ status: "success", message: "Exito al crear un nuevo carrito" })
//     } catch (error) {
//         res.status(400).send({ status: "error", message: "Error al crear un nuevo carrito" })
//     }
// })

// // LOGICA DE METODO "POST" PARA AGREGAR UN "PRODUCTO" SEGUN SU ID EN UN "CARRITO" ESPECIFICO SEGUN SU ID.
// cart.post("/api/cartsDB/:cid/products/:pid", async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const pid = req.params.pid;

//         let cart = await cartsModel.findById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: "Carrito no encontrado" });
//         }

//         const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

//         if (existingProduct) {
//             existingProduct.quantity++;
//         } else {
//             cart.products.push({ product: pid, quantity: 1 });
//         }

//         let result = await cart.save();

//         res.status(201).json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// // LOGICA DE METODO "PUT" PARA MODIFICAR SOLO LA "QUANTITY" DEL PRODUCTO SELECCIONADO EN EL CARRITO SELECCIONADO.
// cart.put("/api/cartsDB/:cid/products/:pid", async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const pid = req.params.pid;
//         const modificadorQuantity = req.body.quantity;

//         const cart = await cartsModel.findById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: "Carrito no encontrado" });
//         }

//         const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

//         if (!existingProduct) {
//             return res.status(404).json({ error: "Producto no encontrado en el carrito" });
//         }

//         if (existingProduct.quantity === null || existingProduct.quantity === undefined) {
//             existingProduct.quantity = 1;
//         } else {
//             existingProduct.quantity = modificadorQuantity;
//         }

//         let result = await cart.save();

//         res.status(200).json({ status: "Success", message: "Éxito al modificar la cantidad del producto seleccionado.", result: result, });
//     } catch (error) {
//         res.status(500).json({ status: "Error", message: "Error al modificar la cantidad del producto seleccionado.", error: error.message, });
//     }
// });

// // LOGICA DE METODO "PUT" QUE PERMITE ACTUALIZAR EL CARRITO SELECCIONADO POR "/:CID" CON UN ARREGLO DE PRODUCTOS QUE LE PASO POR EL BODY, escribir { "product": "(+ el _id del producto a agregar)"}
// cart.put("/api/cartsDb/:cid", async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const product = req.body;
//         await cartsModel.findByIdAndUpdate(cid, { $push: { products: product } });

//         res.send({ status: "Success", message: "Exito al actualizar el carrito." })
//     } catch (error) {
//         res.send({ status: "Error", message: "Error al actualizar el carrito." })
//     }
// })

// // LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS UN PRODUCTO SELECCINADO DE UN CARRITO SEGUN SU ID.
// cart.delete("/api/cartsDB/:cid/products/:pid", async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const pid = req.params.pid;

//         const cart = await cartsModel.findById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: "Carrito no encontrado" });
//         }

//         const productIndex = cart.products.find((p) => p._id.toString() === pid.toString());

//         if (productIndex === -1) {
//             return res.status(404).json({ error: "Producto no encontrado en el carrito" });
//         }

//         cart.products.splice(productIndex, 1);
//         await cart.save();

//         res.json({ status: "Success", message: "Éxito al eliminar el producto del carrito.", cart: cart });
//     } catch (error) {
//         res.send({ status: "Error", message: "Error al eliminar el producto del carrito." });
//     }
// });

// // LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS TODOS LOS PRODUCTOS DE UN CARRITO SEGUN SU ID. 
// cart.delete("/api/cartsDB/:cid", async (req, res) => {
//     try {
//         const cid = req.params.cid;

//         const cart = await cartsModel.findById(cid);

//         cart.products = [];

//         const result = await cart.save();

//         res.status(200).json({ status: "Success", message: "Éxito al eliminar el carrito.", result: result, });
//     } catch (error) {
//         res.status(500).json({ status: "Error", message: "Error al eliminar el carrito.", result: result });
//     }
// });

// export default cart

