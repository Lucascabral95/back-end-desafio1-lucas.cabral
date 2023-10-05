import express, { json } from "express";
import { promises as fs } from "fs";
//--------------routers-----------------
import products from "./Routes/products.js";
import viewsRouter from "./Routes/views.router.js";
import users from "./Routes/users.router.js";
import cart from "./Routes/cart.js";
//--------------routers-----------------
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

//-----------passport-github2-----------
import passport from "passport"
import initializePassport from "./config/passport.config.js"
//-----------passport-github2-----------

//-----------dotenv-----------
import config from "./config/config.js"
//-----------dotenv-----------

//-----------compression GZIP-----------
import compression from "express-compression";
//-----------compression GZIP-----------

//-----------errorHandler-----------
import errorMiddleware from "./middlewares/errors/index.js"
//-----------errorHandler-----------

//----------- logger -----------
import { addLogger } from "./utils/logger.js";
//----------- logger -----------
//----------- swagger -----------
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import { swaggerOptions } from "./utils/swagger-options.js";
//----------- swagger -----------


import MessagesManager from "./DAO/MessagesDAO.js";
import { fileURLToPath } from "url";
const message2 = new MessagesManager()

const app = express();
const PORT = config.port
const httpServer = app.listen(PORT, () =>
  console.log(`Running on the ${PORT}`)
);
const io = new Server(httpServer);

app.set("views", __dirname + "/views"); // HANDLEBARS
app.set("view engine", "handlebars"); // HANDLEBARS
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine()); // HANDLEBARS
app.use(compression())// GZIP

// CONEXION MONGO ATLAS
const CONNECTION_MONGOATLAS = config.mongo_atlas
mongoose.connect(CONNECTION_MONGOATLAS)
.then(() => console.log("Base de datos conectada"))
.catch(err => console.log(err))
// CONEXION MONGO ATLAS
//-----------session-----------
app.use(cookieParser())
const MONGOSTORE = config.mongoStore
const KEY_SECRET_MONGOSTORE = config.key_mongoStore
app.use(
  session({
    secret: KEY_SECRET_MONGOSTORE,
    resave: false,
    saveUninitialized: false,
    // cookie: {
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // },
      store: MongoStore.create({
        mongoUrl:
        MONGOSTORE,
        mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100000000,
    }),
  })
  );
  //-----------session-----------
  
  //-----------passport-github2-----------
  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())
  //-----------passport-github2-----------
  app.use(cart);
  app.use(products);
  app.use(viewsRouter);
  app.use(users)
  app.use(errorMiddleware)// errorHandler
  const specs = swaggerJsdoc(swaggerOptions) // SWAGGER
  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)) // SWAGGER
  //----------- logger -----------
app.use(addLogger)
//----------- logger -----------

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
















































// import express, { json } from "express";
// import { promises as fs } from "fs";
// import products from "./Routes/products.js";
// import viewsRouter from "./Routes/views.router.js";
// import cart from "./Routes/cart.js";
// import handlebars from "express-handlebars";
// import __dirname from "./utils.js";
// import { Server } from "socket.io";
// import ProductManager from "./ProductManager.js";
// const product3 = new ProductManager()
// import mongoose from "mongoose"
// import MongoStore from "connect-mongo"

// //-----------cookies parser-----------
// import cookieParser from "cookie-parser";
// //-----------cookies parser-----------

// //-----------express-session-----------
// import session from "express-session";
// //-----------express-session-----------

// //-----------passport-github2-----------
// import passport from "passport"
// import initializePassport from "./config/passport.config.js"
// //-----------passport-github2-----------

// //-----------dotenv-----------
// import config from "./config/config.js"
// //-----------dotenv-----------

// //-----------compression GZIP-----------
// import compression from "express-compression";
// //-----------compression GZIP-----------

// //-----------errorHandler-----------
// import errorMiddleware from "./middlewares/errors/index.js"
// //-----------errorHandler-----------

// //----------- logger -----------
// import { addLogger } from "./utils/logger.js";
// //----------- logger -----------
// import MessagesManager from "./DAO/MessagesDAO.js";
// import { fileURLToPath } from "url";
// const message2 = new MessagesManager()


// import cluster from "cluster"
// import os from "os"
// const numCPUs = os.cpus().length
// if (cluster.isPrimary) {

//   console.log("Soy el proceso principal: " + process.pid);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork(); // Crea un proceso secundario por cada CPU
//   }

//   cluster.on("message", worker => {
//     console.log("Mensaje recibido desde el worker: " + worker.process.pid);
//   })

//   cluster.on("exit", worker => {
//     console.log("Mensaje recibido desde el worker: " + worker.process.pid);
//     cluster.fork(); // Crea un proceso secundario por cada CPU
//   })
// } else {
//   // console.log("Al ser un proceso forkeado, no cuento como primario, por lo tanto isPrimary=false. ¡Entonces soy un worker");
//   console.log(`Me presento, soy un proceso worker con el id: ${process.pid}`);   
//   // https://www.aws.training/LearningLibrary?query=&filters=Language%3A7&from=0&size=15&sort=_score
//   // https://www.aws.training/

//   const app = express();

//   app.get("/saludo", (req, res) => {
//     res.send("¡¡¡Hola, Docker!!!")
//   })
  
//   // app.get("/operacionsencilla", (req, res) => {
//   //   let sum = 0
//   //   for (let i = 0; i < 1000; i++) {
//   //     sum += i
//   //   }
//   //   res.send({ status: "success", msg: `El worker ${process.pid} ha atendido esta peticion, el resultado es  ${sum}` })
//   // })
  
//   // app.get("/operacioncompleja", (req, res) => {
//   //   let sum = 0
//   //   for (let i = 0; i < 5e8; i++) {
//   //     sum += i
//   //   }
//   //   res.send({ status: "success", msg: `El worker ${process.pid} ha atendido esta peticion, el resultado es  ${sum}` })
//   // })

//   const PORT = config.port
//   // const httpServer = app.listen(PORT, () =>
//   //   console.log(`Running on the ${PORT}`)
//   // );
//   // const io = new Server(httpServer);
//   const httpServer = app.listen(PORT);
//   const io = new Server(httpServer);

//   app.set("views", __dirname + "/views"); // HANDLEBARS
//   app.set("view engine", "handlebars"); // HANDLEBARS
//   app.use(express.static(__dirname + "/public"));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.engine("handlebars", handlebars.engine()); // HANDLEBARS
//   app.use(compression())// GZIP


//   // CONEXION MONGO ATLAS
//   const CONNECTION_MONGOATLAS = config.mongo_atlas
//   mongoose.connect(CONNECTION_MONGOATLAS)
//     // .then(() => console.log("Base de datos conectada"))
//     .catch(err => console.log(err))
//   // CONEXION MONGO ATLAS
//   //-----------session-----------
//   app.use(cookieParser())
//   const MONGOSTORE = config.mongoStore
//   const KEY_SECRET_MONGOSTORE = config.key_mongoStore
//   app.use(
//     session({
//       secret: KEY_SECRET_MONGOSTORE,
//       resave: false,
//       saveUninitialized: false,
//       // cookie: {
//       //   maxAge: 7 * 24 * 60 * 60 * 1000,
//       // },
//       store: MongoStore.create({
//         mongoUrl:
//           MONGOSTORE,
//         mongoOptions: {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         },
//         ttl: 100000000,
//       }),
//     })
//   );
//   //-----------session-----------

//   //-----------passport-github2-----------
//   initializePassport()
//   app.use(passport.initialize())
//   app.use(passport.session())
//   //-----------passport-github2-----------

//   app.use(cart);
//   app.use(products);
//   app.use(viewsRouter);
//   app.use(errorMiddleware)// errorHandler
//   //----------- logger -----------
//   app.use(addLogger)
//   //----------- logger -----------

//   io.on("connection", async (socket) => {
//     console.log("Nuevo cliente conectado.")

//     const data = await product3.getProducts()
//     io.emit("productos-actualizados", data)

//     socket.on("delete-product", async (id) => {
//       await product3.deleteProduct(parseInt(id));
//     });

//     socket.on("message", (data) => {
//       console.log("cliente dice: " + data);
//     })

//     const horaFull = new Date
//     const hora = horaFull.getHours().toString().padStart(2, "0")
//     const minutos = horaFull.getMinutes().toString().padStart(2, "0")
//     const segundos = horaFull.getSeconds().toString().padStart(2, "0")

//     socket.on("prueba", async data => {
//       console.log(data);
//       await message2.addMessages({ user: data[1] === "" ? "Client" : data[1], message: data[0], hour: `${hora}:${minutos}:${segundos}` })
//     })

//     const contenidoDelChat = await message2.getMessages()
//     socket.emit("contenidoChat", `${contenidoDelChat}`)
//   });

// }




