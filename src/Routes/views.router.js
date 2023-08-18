import { Router } from "express";
const viewsRouter = Router();
import passport from "passport"
import { auth, authDenied, lockUser, accessDeniedAdmin } from "../middlewares/auth.js"
//--------------------------------------JWT-------------------------------------------------------------
import { authToken } from "../jwt.js"
//--------------------------------------JWT-------------------------------------------------------------
//--------------------------------------controllers de esta ruta-------------------------------------------------------------
import {
    apiSessionDentro,
    apiSessionRegister,
    apiSessionLogin,
    apiSessionCurrent,
    apiSessionLogout,
    rutaRaiz,
    realTimeProducts,
    homeProducts,
    getChat,
    apiSessionRegisterPost,
    apiSessionLoginPost,
    realTimeProductsPost,
    homeMongoDB,
    homeMongodbPost,
    homeMongodbDinamica,
    cartsParams
} from "../ViewsLayer/views.router.layer.js";

import {
    controllerStock,
    controllerTicket
} from "../controllers/views.router.controllers.js"

//--------------------------------------controllers de esta ruta-------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------
// PASSPORT-GITHUB2
// RUTA "GET" PARA LOGUEARTE CON TU CUENTA DE GITHUB.
viewsRouter.get("/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

viewsRouter.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }),
    (req, res) => {
        req.session.emailUser = req.user;
        req.session.rol = "Usuario";
        req.session.exitsRol = false
        res.redirect("/api/session/dentro");
    }
);
// PASSPORT-GITHUB2

// RUTA RAIZ DE "/API/SESSION" CON HANDLEBARS. ACA TE REDIRIGE EL SERVIDOR AL LOGUEARTE EN GITHUB Y EN EL LOGIN DE MONGO-DB ATLAS
viewsRouter.get("/api/session/dentro", auth, apiSessionDentro)

//----------------------------------------------------------------------------------------------------------------------------------------
// DESAFIO DE COOKIES, SESSIONS & STORAGE
// METODO "GET" PARA VER EL REGISTRO DE USUARIOS
viewsRouter.get("/api/session/register", authDenied, apiSessionRegister)

//------------------------------------------------------------------------------------------------------------------------------
// METODO "POST" PARA REGISTRARTE. AL HACERLO, LA CONTRASEÑA SE HASHEA CON BCRYP Y SE LEE EN EL LOGIN. TAMBIEN SE CREA UN CART CON SU ID 
// EN REFERENCIA A LA COLECCION CARTS.
viewsRouter.post("/api/session/register", apiSessionRegisterPost)

//------------------------------------------------------------------------------------------------------------------------------
// METODO "GET" PARA VER EL LOGIN DE USUARIOS
viewsRouter.get("/api/session/login", authDenied, apiSessionLogin)

// METODO "POST" PARA LOGUEARTE CON LA CONTRASEÑA YA HASHEADA DEL REGISTER. AL LOGUEARTE CORRECTAMENTE SE GENERA UN TOKEN "JWT" Y SE ALMACENA EN 
// COOKIE "authToken" DONDE EL SERVIDOR LA LEE Y VERIFICA EN "/API/SESSION/CURRENT", SI ES CORRECTO EL TOKEN, EL MIDDLEWARE "authToken" TE DEJA ENTRAR EN DICHA RUTA
viewsRouter.post("/api/session/login", apiSessionLoginPost)

// RUTA "GET" CON DOS MIDDLEWARES DONDE SOLO SE PUEDE ACCEDER LUEGO DE LOGUEARTE CORRECTAMENTE Y QUE EL SERVIDOR LEA CORRECTAMENTE TU TOKEN "JWT"
// ENVIADO DESDE LA COOKIE "authToken" Y SE ASEGURE QUE SEA EL TOKEN CORRECTO ASOCIADO AL USUARIO EN CUESTION.
// Esta ruta te muestra todos los datos con los que te registraste: nombre, apellido, edad, email, rol (user), e .ID del cart generado.
viewsRouter.get("/api/session/current", auth, authToken, apiSessionCurrent)
//---------------------------JWT------------------------------------------

// // LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
viewsRouter.get("/api/session/logout", auth, apiSessionLogout)
// DESAFIO DE COOKIES, SESSIONS & STORAGE
//--------------------------------------------------------------------------------------------------------------------------------------------

// RUTA RAIZ DEL PROYECTO
viewsRouter.get("/", rutaRaiz)

// RUTA "GET" PARA /HOME
viewsRouter.get("/home", homeProducts)

// RUTA "GET" PARA /REALTIMEPRODUCTS
viewsRouter.get("/realtimeproducts", realTimeProducts)

// RUTA "POSTA" PARA /REALTIMEPRODUCTS
viewsRouter.post("/realtimeproducts", realTimeProductsPost)

// RUTA "DELETE" PARA /REALTIMEPRODUCTS
viewsRouter.delete("/realtimeproducts", async (req, res) => {
});

// RUTA "GET" PARA IR AL CHAT /CHAT
// viewsRouter.get("/chat", auth, getChat)
viewsRouter.get("/chat", lockUser, getChat)
// ------------------------------------------------------------------------------------------------------------------------------------------------

// RUTA "GET" QUE RENDERIZA CON PAGINATION Y AGGREGATION LA VISTA "PRODUCTS.HANDLEBARS"
viewsRouter.get("/home-mongoDB", auth, homeMongoDB)

// METODO "POST" PARA AGREGAR UN DOCUMENTO NUEVO POR MEDIO DE UN FORMULARIO. 
viewsRouter.post("/home-mongoDB", homeMongodbPost)

// METODO "DELETE" PARA ELIMINAR POR _ID UN PRODUCTO DE mongoDB ATLAS.
viewsRouter.delete("/home-mongodb/:pid", homeMongodbDinamica)

// RENDERIZA LA VISTA "cardId"
// viewsRouter.get("/carts/:cid", cartsParams)
viewsRouter.get("/carts/:cid/purchase", accessDeniedAdmin, cartsParams)

// METODO "POST" PARA RESTAR LA CANTIDAD DE STOCK DE UNA COMPRA /CARTS/:PID/:STOCK
viewsRouter.post("/cart/:cid/buy", controllerStock)

// METODO "POST" PARA CREAR UN ID CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS
viewsRouter.post("/cart/:cid/purchase", controllerTicket)


import TicketDAO from "../DAO/TicketsDAO.js";
const ticketService = new TicketDAO
//RENDERIZA VISTA "GET" DE /COMPLETED/PURCHASE
viewsRouter.get("/completed/purchase", accessDeniedAdmin, async (req, res) => {
    try {
        const dataTicket = req.session.generatedTicket
        const tid = req.session.emailUser
        let tickets = await ticketService.getTicketByCart(tid)

        const ticketId = tickets.map(id => id._id.toString())
        const ticketDatatime = tickets.map(id => id.purchase_dateTime)
        const ticketPurchaser = tickets.map(id => id.purchaser)
        const ticketCode = tickets.map(id => id.code)
        const ticketAmount = tickets.map(id => id.amount)

        const total = ticketId.length
        const mockTicket = [ ticketId,ticketDatatime,ticketPurchaser,ticketCode,ticketAmount,total ]

        res.render("completedPurchase", { ticket: dataTicket, mock: mockTicket})
    } catch (error) {
        console.log("Error", error);
        res.status(500).send("An error occurred.");
    }
})

export default viewsRouter;










































// import { Router } from "express";
// import { promises as fs, readFile } from "fs";
// import ProductManager from "../ProductManager.js";
// import Swal from 'sweetalert2';
// import MessagesManager from "../DAO/MessagesDAO.js";
// const message2 = new MessagesManager()
// import ProductsManager2 from "../DAO/productsDAO.js"
// import products from './products.js';

// import ProductModel from "../DAO/models/products.model.js"
// import { fileURLToPath } from "url";

// import cartsModel from "../DAO/models/carts.model.js"

// import { createUser, getAll, getByEmail } from "../DAO/sessions.js"
// import { auth, authDenied } from "../middlewares/auth.js"
// //------------------------------------------------------------------------------------------------------
// import { createHash, isValidPassword } from "../utils.js";
// import passport from "passport"
// //--------------------------------------JWT-------------------------------------------------------------
// import { generateToken, authToken } from "../jwt.js"
// //--------------------------------------JWT-------------------------------------------------------------

// const viewsRouter = Router();
// const productDao = new ProductsManager2
// const product2 = new ProductManager()

// //---------------------------------------------------------------------------------------------------------------------------------------------------
// // PASSPORT-GITHUB2
// // RUTA "GET" PARA LOGUEARTE CON TU CUENTA DE GITHUB.
// viewsRouter.get("/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

// viewsRouter.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }),
//     (req, res) => {
//         req.session.emailUser = req.user;
//         req.session.rol = "Usuario";
//         req.session.exitsRol = false
//         res.redirect("/api/session/dentro");
//     }
// );

// // RUTA RAIZ DE "/API/SESSION" CON HANDLEBARS. ACA TE REDIRIGE EL SERVIDOR AL LOGUEARTE EN GITHUB Y EN EL LOGIN DE MONGO-DB ATLAS
// viewsRouter.get("/api/session/dentro", auth, async (req, res) => {
//     let user = req.session.emailUser
//     let rol = req.session.rol
//     let existeRol = req.session.existRol

//     let userNameGithub = req.session.emailUser.first_name
//     let userEmailGithub = req.session.emailUser.email
//     let userAgeGithub = req.session.emailUser.age
//     const userData = [user, rol, userNameGithub, userEmailGithub, userAgeGithub, existeRol]

//     res.render("pageGithub", { user: userData })
// })

// // PASSPORT-GITHUB2
// //---------------------------------------------------------------------------------------------------------------------------------------------------

// //----------------------------------------------------------------------------------------------------------------------------------------
// // DESAFIO DE COOKIES, SESSIONS & STORAGE
// // METODO "GET" PARA VER EL REGISTRO DE USUARIOS
// viewsRouter.get("/api/session/register", authDenied, async (req, res) => {
//     res.render("register", {})
// })

// //------------------------------------------------------------------------------------------------------------------------------
// // METODO "POST" PARA REGISTRARTE. AL HACERLO, LA CONTRASEÑA SE HASHEA CON BCRYP Y SE LEE EN EL LOGIN. TAMBIEN SE CREA UN CART CON SU ID
// // EN REFERENCIA A LA COLECCION CARTS.
// viewsRouter.post("/api/session/register", async (req, res) => {
//     let user = req.body;
//     try {
//         const cuentaUsuario = await getByEmail(user.email);
//         if (cuentaUsuario) {
//             res.render("register-error", {});
//             return;
//         }
//         const newCart = cartsModel({ products: [] });
//         const savedCart = await newCart.save();
//         const newUser = {
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             age: user.age,
//             password: createHash(user.password),
//             role: user.role,
//             cart: savedCart._id,
//         };
//         const savedUser = await createUser(newUser);
//         console.log(savedUser);
//         // res.render("login", {});
//         res.cookie("dataUser", savedUser).render("login", {})
//     } catch (error) {
//         console.error("Error al registrar el usuario y el carrito:", error);
//         res.render("register-error", {});
//     }
// });

// //------------------------------------------------------------------------------------------------------------------------------
// // METODO "GET" PARA VER EL LOGIN DE USUARIOS
// viewsRouter.get("/api/session/login", authDenied, (req, res) => {
//     res.render("login", {})
// })

// // METODO "POST" PARA LOGUEARTE CON LA CONTRASEÑA YA HASHEADA DEL REGISTER. AL LOGUEARTE CORRECTAMENTE SE GENERA UN TOKEN "JWT" Y SE ALMACENA EN
// // COOKIE "authToken" DONDE EL SERVIDOR LA LEE Y VERIFICA EN "/API/SESSION/CURRENT", SI ES CORRECTO EL TOKEN, EL MIDDLEWARE "authToken" TE DEJA ENTRAR EN DICHA RUTA
// viewsRouter.post("/api/session/login", async (req, res) => {
//     try {
//         const user = req.body;
//         const busquedaData = await getByEmail(user.email);

//         if (!busquedaData || !isValidPassword(busquedaData, user.password)) {
//             return res.render("login-error", {});
//         } else if (busquedaData.email === null || typeof busquedaData.email === "undefined") {
//             return res.render("login-error", {});
//         } else if (user.password === "adminCod3r123" && user.email === "adminCoder@coder.com") {
//             req.session.rol = "Admin";
//             req.session.existRol = true;
//             req.session.emailUser = user.email;
//             console.log(req.session.emailUser);
//             return res.redirect("/api/session/dentro");
//         } else {
//             req.session.rol = "Usuario";
//             req.session.existRol = true;
//             req.session.emailUser = user.email;
//             // propiedades de JWT
//             const token_access = generateToken(user.email);
//             console.log(user.email, token_access);
//             req.session.emailJwt = user.email;
//             return res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error Interno del Servidor");
//     }
// });

// // RUTA "GET" CON DOS MIDDLEWARES DONDE SOLO SE PUEDE ACCEDER LUEGO DE LOGUEARTE CORRECTAMENTE Y QUE EL SERVIDOR LEA CORRECTAMENTE TU TOKEN "JWT"
// // ENVIADO DESDE LA COOKIE "authToken" Y SE ASEGURE QUE SEA EL TOKEN CORRECTO ASOCIADO AL USUARIO EN CUESTION.
// // Esta ruta te muestra todos los datos con los que te registraste: nombre, apellido, edad, email, rol (user), e .ID del cart generado.
// viewsRouter.get("/api/session/current", auth, authToken, (req, res) => {
//     const emailJwt = req.session.emailJwt;

//     const dataUserCookie = req.cookies.dataUser || {};

//     const dataUserFirstName = dataUserCookie.first_name;
//     const dataUserLastName = dataUserCookie.last_name;
//     const dataUserAge = dataUserCookie.age;
//     const dataUserRole = dataUserCookie.role;
//     const dataUserCart = dataUserCookie.cart;

//     res.render("current", {
//         datos: {
//             email: emailJwt,
//             firstName: dataUserFirstName,
//             lastName: dataUserLastName,
//             age: dataUserAge,
//             role: dataUserRole,
//             cart: dataUserCart,
//         },
//     });
// });
// //---------------------------JWT------------------------------------------

// // // LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
// viewsRouter.get("/api/session/logout", auth, (req, res) => {
//     req.session.destroy(error => {
//         res.render("login")
//     })
// })
// // DESAFIO DE COOKIES, SESSIONS & STORAGE
// //--------------------------------------------------------------------------------------------------------------------------------------------


// viewsRouter.get("/", (req, res) => {
//     res.render("index");
// });

// viewsRouter.get("/home", async (req, res) => {
//     try {
//         const productos = await product2.getProducts()
//         res.render("home", { data: productos });
//     } catch (error) {
//         res.status(404).send({ status: "error", message: "No se ha podido encontrar la lista de productos." })
//     }
// });

// viewsRouter.get("/realtimeproducts", async (req, res) => {
//     res.render("realtimeproducts")
// });


// viewsRouter.post("/realtimeproducts", async (req, res) => {
//     try {
//         const nuevoProducto = req.body;

//         if (
//             !nuevoProducto.title ||
//             !nuevoProducto.description ||
//             !nuevoProducto.code ||
//             !nuevoProducto.price ||
//             !nuevoProducto.stock ||
//             !nuevoProducto.category
//         ) {
//             return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
//         }
//         const productos = await product2.addProducts(nuevoProducto);
//         res.redirect("/realtimeproducts");
//     } catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Todos los campos son obligatorios',
//         });
//     }
// });

// viewsRouter.delete("/realtimeproducts", async (req, res) => {

// });

// viewsRouter.get("/chat", auth, async (req, res) => {
//     let mensajes = await message2.getMessages()
//     let messageMongo = mensajes.map(mensaje => mensaje.message)
//     let horaMongo = mensajes.map(men => men.hour)
//     let userMongo = mensajes.map(men => men.user)
//     let user = req.session.emailUser

//     const combineData = [horaMongo, messageMongo, userMongo, user]

//     res.render("chat.handlebars", { combineData })
// })
// // ------------------------------------------------------------------------------------------------------------------------------------------------


// // RUTA "GET" QUE RENDERIZA CON PAGINATION Y AGGREGATION LA VISTA "PRODUCTS.HANDLEBARS"
// // viewsRouter.get("/home-mongoDB", async (req, res) => {
// viewsRouter.get("/home-mongoDB", auth, async (req, res) => {
//     const limit = parseInt(req.query.limit) || 10 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
//     const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
//     const sort = req.query.sort || "createdAt" // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente
//     const category = req.query.category // Sirve para filtrar los productos segun su categoria (éstas son case sensitive)

//     const productoss = await ProductModel.paginate(category ? { category } : null, { limit, page, sort })

//     const productos = productoss.docs

//     const buscadorId = productos.map(i => i._id)
//     const buscadorTitle = productos.map(title => title.title)
//     const buscadorDescription = productos.map(d => d.description)
//     const buscadorCode = productos.map(c => c.code)
//     const buscadorPrice = productos.map(p => p.price)
//     const buscadorStock = productos.map(s => s.stock)
//     const buscadorCategory = productos.map(ca => ca.category)
//     const user = req.session.emailUser
//     const rol = req.session.rol
//     const existeRol = req.session.existRol
//     //------
//     const userEmailGithub = req.session.emailUser.email
//     const userAgeGithub = req.session.emailUser.age
//     const userFirstNameGithub = req.session.emailUser.first_name
//     //------

//     const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice,
//         buscadorStock, buscadorCategory, user, rol, existeRol, userEmailGithub, userAgeGithub, userFirstNameGithub]

//     const totalDocss = productoss.totalDocs
//     const limitt = productoss.limit
//     const totalPages = productoss.totalPages
//     const pagee = productoss.page
//     const pagingCounter = productoss.pagingCounter
//     const hasPrevPage = productoss.hasPrevPage
//     const hasNextPage = productoss.hasNextPage
//     const prevPage = productoss.prevPage
//     const nextPage = productoss.nextPage

//     const datosDePaginate = [totalDocss, limitt, totalPages, pagee, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage]

//     res.render("products", { productossFull: productossFull, datosExtras: datosDePaginate, sort })
// })

// // METODO "POST" PARA AGREGAR UN DOCUMENTO NUEVO POR MEDIO DE UN FORMULARIO.
// viewsRouter.post("/home-mongoDB", async (req, res) => {
//     try {
//         const newProduct = req.body
//         if (
//             !newProduct.title ||
//             !newProduct.description ||
//             !newProduct.code ||
//             !newProduct.price ||
//             !newProduct.stock ||
//             !newProduct.category
//         ) {
//             return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
//         }
//         const product = await productDao.addProducts(newProduct)
//         res.redirect("/home-mongoDB");
//     } catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Todos los campos son obligatorios',
//         });
//     }
// })

// // METODO "DELETE" PARA ELIMINAR POR _ID UN PRODUCTO DE mongoDB ATLAS.
// viewsRouter.delete("/home-mongodb/:pid", async (req, res) => {
//     try {
//         const pid = req.params.pid;
//         const prod = await productDao.deleteProductById(pid);

//         if (prod) {
//             res.send({ status: "Success", message: "Producto eliminado." });
//         } else {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Éxito al eliminar el producto deseado. REFRESQUE la pagina para ver los cambios.',
//             });
//             res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la pagina para ver los cambios" });
//         }
//     } catch (error) {
//         res.status(400).send({ status: "Error" });
//     }
// });

// // RENDERIZA LA VISTA "cardId"
// viewsRouter.get("/carts/:cid", async (req, res) => {
//     const cartAll = await cartsModel.find()
//     try {
//         const cid = req.params.cid
//         const cart = await cartsModel.findById(cid).populate("products.product")

//         const cartId = cart._id
//         const productId = cart.products.map(prod => prod.product._id)
//         const title = cart.products.map(prod => prod.product.title);
//         const price = cart.products.map(prod => prod.product.price);
//         const quantity = cart.products.map(prod => prod.quantity)
//         const totalPrice = price.map((p, index) => parseFloat(p) * parseFloat(quantity[index]));
//         const totalPriceFull = totalPrice.reduce((accumulator, current) => accumulator + current, 0);
//         const totalPriceFullWithComa = totalPriceFull.toLocaleString()
//         const cartIdAll = cartAll.map(i => i._id)

//         const datos = [cart, productId, title, quantity, price, totalPrice, totalPriceFullWithComa, cartId, cartIdAll]

//         res.render("cartId", { datos })
//     } catch (error) {
//         res.status(400).send({
//             status: "Error",
//             message: `Error al obtener carts. Por favor, para buscar uno vaya a /api/cartsDB `
//         })
//     }
// })

// export default viewsRouter;

