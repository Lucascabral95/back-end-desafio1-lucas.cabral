import { Router } from "express"
import { promises as fs } from "fs"
import CartManager from "../CartManager.js"
import CartsManager2 from "../DAO/CartsDAO.js"
import products from "./products.js"

import CartModel from "../DAO/models/carts.model.js"
import cartsModel from "../DAO/models/carts.model.js"
import productsModel from "../DAO/models/products.model.js"

const cart = Router()

const cart2 = new CartsManager2()
const cart1 = new CartManager()

// ESTE ES TODO EL CODIGO DE "CARTS" QUE SE PIDE PARA LA "SEGUNDA PRE-ENTREGA DEL PROYECTO FINAL" //  
// CODIGO CON PETICIONES "GET", "POST", "PUT" Y "DELETE" DE "MONGO ATLAS" Y "POPULATE".

// RUTA "GET" PARA OBTENER TODOS LOS CARRITOS CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS HAY). CON "POPULATE"
cart.get("/api/cartsdb", async (req, res) => {
    try {
        const carts = await cartsModel.find().populate("products.product");

        res.json(carts)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// RUTA "GET" PARA OBTENER TODOS LOS CARRITOS SEGUN SU ID CON SUS REPECTIVOS PRODUCTOS DENTRO (SI ES QUE LOS TIENE). CON "POPULATE"
cart.get("/api/cartsdb/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid).populate("products.product");

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.send({ status: "Success", cart: cart })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// LOGICA DE METODO "POST" PARA CREAR UN NUEVO "CARRITO" QUE SE AGREGARA EN LA COLECCION DE "CARTS" DE mongoDB ATLAS. 
cart.post("/api/cartsDB", async (req, res) => {
    try {
        const body = req.body
        const newCart = await cartsModel.create(body)

        res.send({ status: "success", message: "Exito al crear un nuevo carrito" })
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al crear un nuevo carrito" })
    }
})

// LOGICA DE METODO "POST" PARA AGREGAR UN "PRODUCTO" SEGUN SU ID EN UN "CARRITO" ESPECIFICO SEGUN SU ID.
cart.post("/api/cartsDB/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        let cart = await cartsModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        let result = await cart.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// LOGICA DE METODO "PUT" PARA MODIFICAR SOLO LA "QUANTITY" DEL PRODUCTO SELECCIONADO EN EL CARRITO SELECCIONADO.
cart.put("/api/cartsDB/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const modificadorQuantity = req.body.quantity;

        const cart = await cartsModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        if (existingProduct.quantity === null || existingProduct.quantity === undefined) {
            existingProduct.quantity = 1;
        } else {
            existingProduct.quantity = modificadorQuantity;
        }

        let result = await cart.save();

        res.status(200).json({ status: "Success", message: "Éxito al modificar la cantidad del producto seleccionado.", result: result, });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al modificar la cantidad del producto seleccionado.", error: error.message, });
    }
});

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS UN PRODUCTO SELECCINADO DE UN CARRITO SEGUN SU ID.
cart.delete("/api/cartsDB/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await cartsModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productIndex = cart.products.find((p) => p._id.toString() === pid.toString());

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.json({ status: "Success", message: "Éxito al eliminar el producto del carrito.", cart: cart });
    } catch (error) {
        res.send({ status: "Error", message: "Error al eliminar el producto del carrito." });
    }
});

// LOGICA "DELETE" PARA ELIMINAR DE mongoDB ATLAS TODOS LOS PRODUCTOS DE UN CARRITO SEGUN SU ID. 
cart.delete("/api/cartsDB/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await cartsModel.findById(cid);
        
        cart.products = [];
        
        const result = await cart.save();
        
        res.status(200).json({ status: "Success", message: "Éxito al eliminar el carrito.", result: result, });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al eliminar el carrito.", result: result });
    }
});

export default cart


//-------------------------------------------------------------------------------------------------------------------------------------------------



// ESTE CODIGO NO PERTENECE A LA "SEGUNDA PRE-ENTREGA DEL PROYECTO FINAL", CORRESPONDE A LAS ANTEIORES, NO LAS BORRO POR PEDIDO DEL PROFE. //
// ESTE CODIGO NO PERTENECE A LA "SEGUNDA PRE-ENTREGA DEL PROYECTO FINAL", CORRESPONDE A LAS ANTEIORES, NO LAS BORRO POR PEDIDO DEL PROFE. //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PETICIONES GET, POST, PUT Y DELETE CONECTADA CON MONGODB

// products.get("/api/cartsDB", async (req, res) => {
//     let carts = await cart2.getAllCarts()
//     try {
//         const limit = parseInt(req.query.limit)
//         if (limit) {
//             const cantidadCarritos = carts.slice(0, limit)
//             res.send({ status:"success", cantidadCarritos})
//         } else {
//             res.send({ status:"success", carts})
//         }
//     } catch (error) {
//         res.status(400).send({ status: "Error", message: "Error al mostrar los carritos." })
//     }
// })

// // RUTA PARA VER TODOS LOS CARTS SEGUN SU ID. Conectado a MongoDB
// cart.get("/api/cartsDB/:cid", async (req, res) => {
//     try {
//         let cid = req.params.cid;
//         let carts = await cart2.getAllCarts();
//         let carritoBuscado = carts.find(c => c._id.toString() === cid.toString());

//         if (carritoBuscado) {
//             res.send({ status: "success", payload: carritoBuscado });
//         } else {
//             res.send({ payload: carts });
//         }

//     } catch (error) {
//         res.status(400).send({ status: "Error", message: "No se ha podido encontrar el carrito." });
//     }
// });

// cart.get("/api/cartsDB", async (req, res) => {
//     const limit = req.query.limit || 5  // Con este query podes indicar la cantidad de elementos que queres que aparezcan, si no pones nada, aparecen 5 por defecto
//     const page = req.query.page || 1  // Con este query podes indicar la pagina en la que queres aparecer. Si no indicas ninguna, por defecto apareces en la pagina 1
//     const sort = req.query.sort || "createdAt" // Con este query ordenas un ordenamiento. Si indicas un valor (/?sort=price) éste viene ordenado de manera ascendente, de lo contrario viene de manera descendente

//     try {
//         const carts = await CartModel.paginate({}, { limit, page, sort })
//         res.send({ status: "success", payload: carts })
//     } catch (error) {
//         res.status(400).send({ status: "error", message: "Error al cargar los carritos." })
//     }
// })

// PETICION PARA ELIMINAR UN CARRITO SEGUN SU ID. Conectado a MongoDB
// cart.delete("/api/cartsDB/:cid", async (req, res) => {
//     let { cid } = req.params
//     try {
//         let cart = await cart2.deleteCartById(cid)
//         if (cart) {
//             res.send({ status: "Error" })
//         } else {
//             res.send({ status: "success", payload: cart })
//         }
//     } catch (error) {
//         res.status(400).send({ status: "error", message: "No se encontro el cart a eliminar." })
//     }
// })


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PETICIONES GET, POST, PUT Y DELETE CON FILESYSTEM 

// RUTA QUE MUESTRA TODOS LOS CARRITOS CON SU ID CORRESPONDIENTE Y ARRAY DE PRODUCTOS 
// cart.get("/api/carts", async (req, res) => {
//     let carritos = await cart1.getCarts()
//     res.send(carritos)
// })

// RUTA QUE MUESTRA UN CARRITO SEGUN SU ID
// cart.get("/api/carts/:cid", async (req, res) => {
//     const cid = parseInt(req.params.cid)
//     try {
//         const carrito = await cart1.getCarts()

//         const carritoId = carrito.find(cart => cart.id === cid)

//         if (carritoId) {
//             res.send(carritoId)
//         } else {
//             console.log(`Error al encontrar carrito con id ${cid}`)
//             res.send(carrito)
//         }

//     } catch (error) {
//         console.log("Error cargar producto seleccionado por ID.")
//         res.status(400).send({ status: "error", message: "Error al buscar carrito" })
//     }
// })

// METODO QUE AGREGA CARRITOS CON UN ID INCREMENTABLE Y UN ARRAY VACIO DE PRODUCTOS
// cart.post("/api/carts", async (req, res) => {
//     try {
//         const carritos = await cart1.addCarts()
//         res.send(carritos)

//     } catch (error) {
//         console.log("Error al agregar carrito")
//         res.status(400).send({ status: "error", message: "Error al agregar carrito" })
//     }
// })

// RUTA POST QUE AGREGA PRODUCTOS EN EL ARREGLO VACIO (PRODUCTS). SE LE AGREGA EL PRODUCTO DEL :PID INDICADO + 1 DE QUANTITY
// SI SE REPITE EL ID DEL PRODUCTO, SE SUMA + 1 DE QUANTITY. 
// cart.post('/api/carts/:cid/product/:pid', async (req, res) => {
//     try {
//         const cid = parseInt(req.params.cid);
//         const pid = parseInt(req.params.pid);

//         const carritos = await cart1.getCarts();
//         const carrito = carritos.find((c) => c.id === cid);

//         if (carrito) {
//             const productoExistente = carrito.products.find((p) => p.product === pid)
//             if (productoExistente) {
//                 productoExistente.quantity++
//             } else {
//                 const product = {
//                     product: pid,
//                     quantity: 1
//                 };
//                 carrito.products.push(product);
//             }
//             await fs.writeFile(cart1.path, JSON.stringify(carritos));

//             res.status(200).send({ status: 'success', message: 'Producto agregado al carrito seleccionado correctamente.' });
//         } else {
//             res.status(404).send({ status: 'error', message: 'No se encontró el carrito especificado.' });
//         }

//     } catch (error) {
//         console.log('Error al agregar producto al carrito seleccionado.', error);
//         res.status(400).send({ status: 'error', message: 'Error al agregar producto al carrito seleccionado.' });
//     }
// });


// export default cart