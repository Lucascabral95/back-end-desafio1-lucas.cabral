import express, { json } from "express"
import { promises as fs } from "fs"
import products from "./Routes/products.js"
import cart from "./Routes/cart.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cart)
app.use(products)


app.get("/", (req, res) => {
    res.send("¡Hola, visitante! 😊. Aca iran todos los productos.")
})

const server = app.listen(8080, () => console.log("Running on the port 8080"))