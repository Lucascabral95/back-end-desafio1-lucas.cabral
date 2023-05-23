import { Router } from "express";
import { promises as fs, readFile } from "fs";
import ProductManager from "../ProductManager.js";
import Swal from 'sweetalert2';


const viewsRouter = Router();
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
            return res
                .status(400)
                .send({ status: "error", message: "Todos los campos son obligatorios" });
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

export default viewsRouter;