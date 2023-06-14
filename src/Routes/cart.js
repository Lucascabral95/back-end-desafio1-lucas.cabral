import { Router } from "express"
import { promises as fs } from "fs"
import CartManager from "../CartManager.js"
import CartsManager2 from "../DAO/CartsDAO.js"
const cart = Router()

const cart2 = new CartsManager2()
const cart1 = new CartManager()


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PETICIONES GET, POST, PUT Y DELETE CONECTADA CON MONGODB

// RUTA PARA VER TODOS LOS CARTS. Conectado a MongoDB
cart.get("/api/cartsDB", async (req, res) => {
    try {
        const results = await cart2.getAllCarts()
        res.send({ status: "success", payload: results })
    } catch (error) {
        res.status(400).send({ status: "error", error })
    }
})

// RUTA PARA VER TODOS LOS CARTS SEGUN SU ID. Conectado a MongoDB
cart.get("/api/cartsDB/:cid", async (req, res) => {
    try {
        let cid = req.params.cid;
        let carts = await cart2.getAllCarts();
        let carritoBuscado = carts.find(c => c._id.toString() === cid.toString());

        if (carritoBuscado) {
            res.send({ status: "success", payload: carritoBuscado });
        } else {
            res.send({ payload: carts });
        }

    } catch (error) {
        res.status(400).send({ status: "Error", message: "No se ha podido encontrar el carrito." });
    }
});

// PETICION PARA ELIMINAR UN CARRITO SEGUN SU ID. Conectado a MongoDB
cart.delete("/api/cartsDB/:cid", async (req, res) => {
    let { cid } = req.params
    try {
        let cart = await cart2.deleteCartById(cid)
        if (cart) {
            res.send({ status: "Error" })
        } else {
            res.send({ status: "success", payload: cart })
        }
    } catch (error) {
        res.status(400).send({ status: "error", message: "No se encontro el cart a eliminar." })
    }
})

//PETICION PARA AGREGAR UN CARRITO. Conectado a MongoDB
cart.post("/api/cartsDB", async (req, res) => {
    try {
        const results = await cart2.addCarts(req.body)
        res.send({ status: "success", payload: results })
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al crear carrito." })
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PETICIONES GET, POST, PUT Y DELETE CON FILESYSTEM 

// RUTA QUE MUESTRA TODOS LOS CARRITOS CON SU ID CORRESPONDIENTE Y ARRAY DE PRODUCTOS 
cart.get("/api/carts", async (req, res) => {
    let carritos = await cart1.getCarts()
    res.send(carritos)
})

// RUTA QUE MUESTRA UN CARRITO SEGUN SU ID
cart.get("/api/carts/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid)
    try {
        const carrito = await cart1.getCarts()

        const carritoId = carrito.find(cart => cart.id === cid)

        if (carritoId) {
            res.send(carritoId)
        } else {
            console.log(`Error al encontrar carrito con id ${cid}`)
            res.send(carrito)
        }

    } catch (error) {
        console.log("Error cargar producto seleccionado por ID.")
        res.status(400).send({ status: "error", message: "Error al buscar carrito" })
    }
})

// METODO QUE AGREGA CARRITOS CON UN ID INCREMENTABLE Y UN ARRAY VACIO DE PRODUCTOS
cart.post("/api/carts", async (req, res) => {
    try {
        const carritos = await cart1.addCarts()
        res.send(carritos)

    } catch (error) {
        console.log("Error al agregar carrito")
        res.status(400).send({ status: "error", message: "Error al agregar carrito" })
    }
})

// RUTA POST QUE AGREGA PRODUCTOS EN EL ARREGLO VACIO (PRODUCTS). SE LE AGREGA EL PRODUCTO DEL :PID INDICADO + 1 DE QUANTITY
// SI SE REPITE EL ID DEL PRODUCTO, SE SUMA + 1 DE QUANTITY. 
cart.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        const carritos = await cart1.getCarts();
        const carrito = carritos.find((c) => c.id === cid);

        if (carrito) {
            const productoExistente = carrito.products.find((p) => p.product === pid)
            if (productoExistente) {
                productoExistente.quantity++
            } else {
                const product = {
                    product: pid,
                    quantity: 1
                };
                carrito.products.push(product);
            }
            await fs.writeFile(cart1.path, JSON.stringify(carritos));

            res.status(200).send({ status: 'success', message: 'Producto agregado al carrito seleccionado correctamente.' });
        } else {
            res.status(404).send({ status: 'error', message: 'No se encontró el carrito especificado.' });
        }

    } catch (error) {
        console.log('Error al agregar producto al carrito seleccionado.', error);
        res.status(400).send({ status: 'error', message: 'Error al agregar producto al carrito seleccionado.' });
    }
});


export default cart