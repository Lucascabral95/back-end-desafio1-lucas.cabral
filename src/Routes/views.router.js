import { Router } from "express";
import { promises as fs, readFile } from "fs";
import ProductManager from "../ProductManager.js";
import Swal from 'sweetalert2';
import MessagesManager from "../DAO/MessagesDAO.js";
const message2 = new MessagesManager()
import ProductsManager2 from "../DAO/productsDAO.js"
import products from './products.js';

import ProductModel from "../DAO/models/products.model.js"
import { fileURLToPath } from "url";

import cartsModel from "../DAO/models/carts.model.js"

const viewsRouter = Router();
const productDao = new ProductsManager2
const product2 = new ProductManager()


viewsRouter.get("/", (req, res) => {
    res.render("index");
});

viewsRouter.get("/home", async (req, res) => {
    try {
        const productos = await product2.getProducts()
        res.render("home", { data: productos });
    } catch (error) {
        res.status(404).send({ status: "error", message: "No se ha podido encontrar la lista de productos." })
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
});


viewsRouter.post("/realtimeproducts", async (req, res) => {
    try {
        const nuevoProducto = req.body;

        if (
            !nuevoProducto.title ||
            !nuevoProducto.description ||
            !nuevoProducto.code ||
            !nuevoProducto.price ||
            !nuevoProducto.stock ||
            !nuevoProducto.category
        ) {
            return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        }
        const productos = await product2.addProducts(nuevoProducto);
        res.redirect("/realtimeproducts");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
        });
    }
});

viewsRouter.delete("/realtimeproducts", async (req, res) => {

});


viewsRouter.get("/chat", async (req, res) => {
    let mensajes = await message2.getMessages()

    let messageMongo = mensajes.map(mensaje => mensaje.message)
    let horaMongo = mensajes.map(men => men.hour)
    let userMongo = mensajes.map(men => men.user)

    const combineData = [horaMongo, messageMongo, userMongo]


    res.render("chat.handlebars", { combineData })
})
//------------------------------------------------------------------------------------------------------------------------------------------------


// RUTA "GET" QUE RENDERIZA CON PAGINATION Y AGGREGATION LA VISTA "PRODUCTS.HANDLEBARS"
viewsRouter.get("/home-mongoDB", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
    const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
    const sort = req.query.sort || "createdAt" // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
    const category = req.query.category // Sirve para filtrar los productos segun su categoria (éstas son case sensitive)

    const productoss = await ProductModel.paginate(category ? { category } : null, { limit, page, sort })

    const productos = productoss.docs

    const buscadorId = productos.map(i => i._id)
    const buscadorTitle = productos.map(title => title.title)
    const buscadorDescription = productos.map(d => d.description)
    const buscadorCode = productos.map(c => c.code)
    const buscadorPrice = productos.map(p => p.price)
    const buscadorStock = productos.map(s => s.stock)
    const buscadorCategory = productos.map(ca => ca.category)

    const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice, buscadorStock, buscadorCategory]

    const totalDocss = productoss.totalDocs
    const limitt = productoss.limit
    const totalPages = productoss.totalPages
    const pagee = productoss.page
    const pagingCounter = productoss.pagingCounter
    const hasPrevPage = productoss.hasPrevPage
    const hasNextPage = productoss.hasNextPage
    const prevPage = productoss.prevPage
    const nextPage = productoss.nextPage

    const datosDePaginate = [totalDocss, limitt, totalPages, pagee, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage]

    res.render("products", { productossFull: productossFull, datosExtras: datosDePaginate, sort })
})

// METODO "POST" PARA AGREGAR UN DOCUMENTO NUEVO POR MEDIO DE UN FORMULARIO. 
viewsRouter.post("/home-mongoDB", async (req, res) => {
    try {
        const newProduct = req.body
        if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.code ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.category
        ) {
            return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        }
        const product = await productDao.addProducts(newProduct)
        res.redirect("/home-mongoDB");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
        });
    }
})

// METODO "DELETE" PARA ELIMINAR POR _ID UN PRODUCTO DE mongoDB ATLAS.
viewsRouter.delete("/home-mongodb/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const prod = await productDao.deleteProductById(pid);

        if (prod) {
            res.send({ status: "Success", message: "Producto eliminado." });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Éxito al eliminar el producto deseado. REFRESQUE la pagina para ver los cambios.',
            });
            res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la pagina para ver los cambios" });
        }
    } catch (error) {
        res.status(400).send({ status: "Error" });
    }
});

// RENDERIZA LA VISTA "cardId"
viewsRouter.get("/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartsModel.findById(cid).populate("products.product")

const cartId = cart._id
        const productId = cart.products.map(prod => prod.product._id)
        const title = cart.products.map(prod => prod.product.title);
        const price = cart.products.map(prod => prod.product.price);
        const quantity = cart.products.map(prod => prod.quantity)
        const totalPrice = price.map((p, index) => parseFloat(p) * parseFloat(quantity[index]));
        const totalPriceFull = totalPrice.reduce((accumulator, current) => accumulator + current, 0);
        const totalPriceFullWithComa = totalPriceFull.toLocaleString()

        const datos = [cart, productId, title, quantity, price, totalPrice, totalPriceFullWithComa, cartId]

        res.render("cartId", { datos })
    } catch (error) {
        res.status(400).send({ status: "Error", message: "Error al obtener carts." })
    }
})



export default viewsRouter;