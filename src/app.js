import ProductManager from "./ProductManager.js"
import express, { json } from "express"
const app = express()
import { promises as fs } from "fs"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = app.listen(1010, () => console.log("Corriendo en puerto 1010"))

app.get("/", (req, res) => {
    res.send("¡Hola, visitante! 😊. Te encontras en la pagina de inicio.")
})

app.get("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const data = await fs.readFile("./productos.json", "utf-8")
        const jsonData = JSON.parse(data)
        const productoFiltrado = jsonData.filter(prod => prod.id === id)
        res.send(productoFiltrado)
    } catch(error) {
        console.log("Error al cargar productos.json", error)
        res.status(500).send({ status: "error", message:"Error al leer productos.json" })
    }
});

app.get("/productos", async (req, res) => {
    const limit = parseInt(req.query.limit)
    try {
        const data = await fs.readFile("./productos.json", "utf-8")
        const jsonData = JSON.parse(data)
        let productos = jsonData

        if (!isNaN(limit)) {
            productos = productos.slice(0, limit);
        }
        res.send(productos);

    } catch (error) {
        console.log("Error al leer productos.json", error)
        res.status(500).send({ status: "error", message: "Error al leer productos.json" })
    }
})
