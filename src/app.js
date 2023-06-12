
import express, { json } from "express";
import { promises as fs } from "fs";
import products from "./Routes/products.js";
import viewsRouter from "./Routes/views.router.js";
import cart from "./Routes/cart.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
const product3 = new ProductManager()
import mongoose from "mongoose"

import MessagesManager from "./DAO/MessagesDAO.js";
const message2 = new MessagesManager()

const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Running on the port 8080")
);
const io = new Server(httpServer);

// CONEXION MONGO ATLAS
mongoose.connect("mongodb+srv://LucasDeveloper:Developer.20@cluster0.xuswj7g.mongodb.net/ecommerce?retryWrites=true&w=majority")
  .then(() => console.log("Base de datos conectada"))
  .catch(err => console.log(err))
// CONEXION MONGO ATLAS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine()); // HANDLEBARS
app.set("views", __dirname + "/views"); // HANDLEBARS
app.set("view engine", "handlebars"); // HANDLEBARS
app.use(express.static(__dirname + "/public"));

app.use(cart);
app.use(products);
app.use(viewsRouter);


// const horaFull = new Date
// const hora = horaFull.getHours().toString().padStart(2, "0")
// const minutos = horaFull.getMinutes().toString().padStart(2, "0")
// const segundos = horaFull.getSeconds().toString().padStart(2, "0") 

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado.")

  const data = await product3.getProducts()
  io.emit("productos-actualizados", data)

  socket.on("delete-product", async (id) => {
    await product3.deleteProduct(parseInt(id));
  });

  socket.on("message", (data) => {
    console.log("cliente dice: " + data);
  })


  const horaFull = new Date
  const hora = horaFull.getHours().toString().padStart(2, "0")
  const minutos = horaFull.getMinutes().toString().padStart(2, "0")
  const segundos = horaFull.getSeconds().toString().padStart(2, "0") 
  
  socket.on("prueba", async data => {
    console.log(data);
    await message2.addMessages({ user: "Client", message: data, hour: `${hora}:${minutos}:${segundos}` })
  })


    const contenidoDelChat = await message2.getMessages()
    socket.emit("contenidoChat", `${contenidoDelChat}`)
 
});

// const muestra = await message2.getMessages()
// console.log(muestra);