import { Router } from "express";
import { promises as fs, readFile } from "fs";
import ProductManager from "../ProductManager.js";
import Swal from 'sweetalert2';
import MessagesManager from "../DAO/MessagesDAO.js";
const message2 = new MessagesManager()
import ProductsManager2 from "../DAO/productsDAO.js"


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


//------------------------------------------------------------------------------------------------------------------------------------------------
viewsRouter.get("/chat", async (req, res) => {
    let mensajes = await message2.getMessages()

    let messageMongo = mensajes.map(mensaje => mensaje.message)
    let horaMongo = mensajes.map(men => men.hour)
    let userMongo = mensajes.map(men => men.user)

    const combineData = [horaMongo, messageMongo, userMongo]


    res.render("chat.handlebars", { combineData })
})

viewsRouter.get("/home-mongoDB", async (req, res) => {
    try {
        let productoss = await productDao.getAllProducts()

        const buscadorId = productoss.map(i => i._id)
        const buscadorTitle = productoss.map(title => title.title)
        const buscadorDescription = productoss.map(d => d.description)
        const buscadorCode = productoss.map(c => c.code)
        const buscadorPrice = productoss.map(p => p.price)
        const buscadorStock = productoss.map(s => s.stock)
        const buscadorCategory = productoss.map(ca => ca.category)


        const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice, buscadorStock, buscadorCategory]

        res.render("productsInDB", { productossFull })
    } catch (error) {
        res.status(400).send({ status: "Error", message: "Error al obtener productos de MongoDB." })
    }
})

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



// viewsRouter.delete("/home-mongodb/:pid", async (req, res) => {
//     try {
//         let pid = parseInt(req.params.pid);
//         let product = await productDao.deleteProductById(pid);

//         if (product) {
            
//             res.send({ status: "Success", message: "Producto eliminado correctamente" });
//         } else {
//             res.send({ status: "Error", message: "Error al eliminar el producto" });
//         }
//     } catch (error) {
//         res.send({ status: "Error", message: "No se encontró el ID del producto." });
//     }
// });


export default viewsRouter;