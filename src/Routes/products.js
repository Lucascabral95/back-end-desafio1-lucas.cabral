import { Router } from "express"
import { promises as fs } from "fs"
import ProductManager from "../ProductManager.js";
const products = Router()

const product1 = new ProductManager()

// RUTA PARA VER TODOS LOS PRODUCTOS. INCLUSO CON ?LIMIT=(+ NUMERO) PODES VER ELEGIR LA CANTIDAD DE PRODUCTOS QUE DESEAS VER.
products.get("/api/productos", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const productos = await product1.getProducts()

        if (!isNaN(limit)) {
            const limiteDeProductos = productos.slice(0, limit)
            res.send(limiteDeProductos)
        } else {
            res.send(productos)
        }
    } catch (error) {
        console.log("Error al leer productos.json", error)
        res.status(500).send({ status: "error", message: "Error al leer productos.json" })
    }
})

// RUTA PARA VER PRODUCTOS SEGUN SU ID
products.get("/api/productos/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productos = await product1.getProducts()
        const productorPorId = productos.find(prod => prod.id === pid)

        if (!productorPorId) {
            console.log(`Producto con ${pid} no encontrado.`)
            res.send(productos)
        } else {
            res.send(productorPorId)
        }

    } catch (error) {
        console.log("Error al encontrar encontrar producto buscado por Id.")
        res.status(500).send({ status: "error", message: "No se encontro el producto del Id indicado." })
    }
})

// METODO POST DE API/PRODUCTOS. PARA AGREGAR MAS PRODUCTOS AL PRODUCTOS.JSON
products.post("/api/productos", async (req, res) => {
    try {
        const nuevoProducto = req.body

        if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.code || !nuevoProducto.price || !nuevoProducto.stock || !nuevoProducto.category) {
            return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        }

        const productos = await product1.addProducts(nuevoProducto)
        res.status(201).send({ status: "success", message: "Exito al agregar nuevo producto." })
    } catch (error) {
        console.log("Error al leer o escribir en productos.json");
        res.status(400).send({ status: "error", message: "Error al leer o escribir en productos.json" });
    }
})

// METODO PUT PARA MODIFICAR PRODUCTOS SEGUN SU ID. (EN EL CLIENTE DESEADO PONER METODO PUT CON LA RUTA DEL ID A CAMBIAR, Y CAMBIAR SUS PROPIEDADES CON TODOS LOS CAMPOS OBLIGATORIOS)
products.put("/api/productos/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoActualizado = req.body
        await product1.updateProduct(pid, productoActualizado)
        const productoExistente = await product1.getProductById(pid)

        if (!productoExistente) {
            res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
        } else {
            res.status(201).send({ status: "success", message: `Exito al modificar el producto con id ${pid}` })
        }

    } catch (error) {
        console.log("Error al modificar el producto elegido productos.json", error);
        res.status(404).send({ status: "error", message: "Error al intentar modificar producto en productos.json" });
    }
})

// METODO DELETE PARA ELIMINAR UN PRODUCTO SEGUN SU ID.
products.delete("/api/productos/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoExistente = await product1.getProductById(pid)

        if (!productoExistente) {
            res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
        } else {
            await product1.deleteProduct(pid)
            res.status(201).send({ status: "success", message: `Exito al eliminar producto con id ${pid}` })
        }

    } catch (error) {
        console.log("Error al eliminar producto en productos.json", error)
        res.status(404).send({ status: "error", message: "Error al eliminar producto en productos.json." })
    }
})

export default products