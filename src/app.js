import express, { json } from "express";
import { promises as fs } from "fs";
import products from "./Routes/products.js";
import cart from "./Routes/cart.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./Routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./ProductManager.js";
const product3 = new ProductManager()

const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Running on the port 8080")
);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine()); // HANDLEBARS
app.set("views", __dirname + "/views"); // HANDLEBARS
app.set("view engine", "handlebars"); // HANDLEBARS
app.use(express.static(__dirname + "/public"));

app.use(cart);
app.use(products);
app.use(viewsRouter);


io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado.")

  const data = await product3.getProducts()
  io.emit("productos-actualizados", data)

  socket.on("delete-product", async (id) => {
      await product3.deleteProduct(parseInt(id));
  });
  
});