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
import MongoStore from "connect-mongo"

//-----------cookies parser-----------
import cookieParser from "cookie-parser";
//-----------cookies parser-----------

//-----------express-session-----------
import session from "express-session";
//-----------express-session-----------

//-----------prueba-----------
import { createUser, getAll, getByEmail } from "./DAO/sessions.js"
//-----------prueba-----------

//-----------passport-github2-----------
import passport from "passport"
import initializePassport from "./config/passport.config.js"
//-----------passport-github2-----------

import MessagesManager from "./DAO/MessagesDAO.js";
import { fileURLToPath } from "url";
const message2 = new MessagesManager()

const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Running on the port 8080")
);
const io = new Server(httpServer);

app.set("views", __dirname + "/views"); // HANDLEBARS
app.set("view engine", "handlebars"); // HANDLEBARS
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine()); // HANDLEBARS


// CONEXION MONGO ATLAS
mongoose.connect("mongodb+srv://LucasDeveloper:Developer.20@cluster0.xuswj7g.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then(() => console.log("Base de datos conectada"))
.catch(err => console.log(err))
// CONEXION MONGO ATLAS
//-----------session-----------
app.use(cookieParser())

app.use(
  session({
    secret: 'frasesecret',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // },
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://LucasDeveloper:Developer.20@cluster0.xuswj7g.mongodb.net/session?retryWrites=true&w=majority',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 1000000,
    }),
  })
);
//-----------session-----------

// //-----------passport-github2-----------
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
// //-----------passport-github2-----------

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

  socket.on("message", (data) => {
    console.log("cliente dice: " + data);
  })

  const horaFull = new Date
  const hora = horaFull.getHours().toString().padStart(2, "0")
  const minutos = horaFull.getMinutes().toString().padStart(2, "0")
  const segundos = horaFull.getSeconds().toString().padStart(2, "0")

  socket.on("prueba", async data => {
    console.log(data);
    await message2.addMessages({ user: data[1] === "" ? "Client" : data[1], message: data[0], hour: `${hora}:${minutos}:${segundos}` })
  })

  const contenidoDelChat = await message2.getMessages()
  socket.emit("contenidoChat", `${contenidoDelChat}`)

});
