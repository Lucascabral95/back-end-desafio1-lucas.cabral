import { Router } from "express";
const viewsRouter = Router();
import passport from "passport"
import { auth, authDenied, lockUser, accessDeniedAdmin } from "../middlewares/auth.js"
import { addLogger } from "../utils/logger.js";
//--------------------------------------JWT-------------------------------------------
import { authToken } from "../jwt.js"
//--------------------------------------JWT-------------------------------------------
//--------------------------------------controllers de esta ruta----------------------
// import {
    // realTimeProducts,
    // homeProducts,
    // realTimeProductsPost,
    // homeMongoDB,
    // homeMongodbPost,
    // homeMongodbDinamica,
    // apiSessionLogin,
    // apiSessionLogout,
    // apiSessionDentro,
    // rutaRaiz,
    // getChat,
    // apiSessionRegister,
    // apiSessionCurrent,
    // apiSessionRegisterPost,
    // apiSessionLoginPost,
    // cartsParams
// } from "../ViewsLayer/views.router.layer.js";
import {
    // apiUserData,
    // apiSessionDentro,
    // apiSessionRegister,
    // apiSessionCurrent,
    // apiSessionLogout,
    // apiSessionLogin,
    // controllerStock,
    // controllerTicket,
    controllerMock,
    controllerLoggerExamples,
    controllerNodemailer,
    controllerGenerateLink,
    controllerLink,
    controllerRecoverPassword,
    controllerChangePasswordGet,
    getAllDocumentss,
    getDocumentByIdd,
    addDataInDocument,
    completedPurchase,
    rutaRaiz,
    getChat,
} from "../controllers/views.router.controllers.js"

//--------------------------------------controllers de esta ruta-------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// PASSPORT-GITHUB2
// RUTA "GET" PARA LOGUEARTE CON TU CUENTA DE GITHUB.
// viewsRouter.get("/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

// viewsRouter.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }),
//     (req, res) => {
//         req.session.emailUser = req.user;
//         req.session.rol = "Usuario";
//         req.session.exitsRol = false
//         res.redirect("/api/session/dentro");
//     }
// );
// PASSPORT-GITHUB2

// RUTA RAIZ DE "/API/SESSION/DENTRO" CON HANDLEBARS. ACA TE REDIRIGE EL SERVIDOR AL LOGUEARTE EN GITHUB Y EN EL LOGIN DE MONGO-DB ATLAS
// viewsRouter.get("/api/session/dentro", auth, addLogger, apiSessionDentro)

// METODO "GET" PARA VER EL REGISTRO DE USUARIOS
// viewsRouter.get("/api/session/register", authDenied, addLogger, apiSessionRegister)

//------------------------------------------------------------------------------------------------------------------------------
// METODO "POST" PARA REGISTRARTE. AL HACERLO, LA CONTRASEÑA SE HASHEA CON BCRYPT Y SE LEE EN EL LOGIN. TAMBIEN SE CREA UN CART CON SU ID 
// EN REFERENCIA A LA COLECCION CARTS.
// viewsRouter.post("/api/session/register", addLogger, apiSessionRegisterPost)

//------------------------------------------------------------------------------------------------------------------------------
// METODO "GET" PARA VER EL LOGIN DE USUARIOS
// viewsRouter.get("/api/session/login", authDenied, addLogger, apiSessionLogin)

// METODO "POST" PARA LOGUEARTE CON LA CONTRASEÑA YA HASHEADA DEL REGISTER. AL LOGUEARTE CORRECTAMENTE SE GENERA UN TOKEN "JWT" Y SE ALMACENA EN 
// COOKIE "authToken" DONDE EL SERVIDOR LA LEE Y VERIFICA EN "/API/SESSION/CURRENT", SI ES CORRECTO EL TOKEN, EL MIDDLEWARE "authToken" TE DEJA ENTRAR EN DICHA RUTA
// viewsRouter.post("/api/session/login", addLogger, apiSessionLoginPost)

// RUTA "GET" CON DOS MIDDLEWARES DONDE SOLO SE PUEDE ACCEDER LUEGO DE LOGUEARTE CORRECTAMENTE Y QUE EL SERVIDOR LEA CORRECTAMENTE TU TOKEN "JWT"
// ENVIADO DESDE LA COOKIE "authToken" Y SE ASEGURE QUE SEA EL TOKEN CORRECTO ASOCIADO AL USUARIO EN CUESTION.
// Esta ruta te muestra todos los datos con los que te registraste: nombre, apellido, edad, email, rol (user), e .ID del cart generado.
// viewsRouter.get("/api/session/current", auth, authToken, addLogger, apiSessionCurrent)
//---------------------------JWT------------------------------------------

// // LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
// viewsRouter.get("/api/session/logout", auth, addLogger, apiSessionLogout)

// RENDERIZA LA VISTA "cardId" QUE TIENE LA LISTA DE TODAS LAS COMPRAS DEL USUARIO, CON SUS RESPECTIVOS DETALLES Y TICKETS GENERADOS
// viewsRouter.get("/carts/:cid/purchase", addLogger, accessDeniedAdmin, cartsParams)

// RUTA RAIZ DEL PROYECTO
viewsRouter.get("/", addLogger, rutaRaiz)

// METODO "POST" PARA RESTAR LA CANTIDAD DE STOCK DE UNA COMPRA /CARTS/:PID/:STOCK
// viewsRouter.post("/cart/:cid/buy", addLogger, controllerStock)

// METODO "POST" PARA CREAR UN TICKET CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS
// viewsRouter.post("/cart/:cid/purchase", addLogger, controllerTicket)

// RUTA "GET" PARA IR AL CHAT /CHAT
viewsRouter.get("/chat", lockUser, addLogger, getChat)

//RENDERIZA VISTA "GET" DE /COMPLETED/PURCHASE
viewsRouter.get("/completed/purchase", accessDeniedAdmin, addLogger, completedPurchase)

// RUTA RELATIVA QUE MUESTRA UN NUMERO DINAMICO (100 EN ESTE CASO) DE PRODUCTOS PROVENIENTES DE "FAKER"
// (LO PODES VER INCLUSO SI NO ESTAS LOGUEADO)
viewsRouter.get("/mockingproducts", addLogger, controllerMock)

// RUTA REALTIVA QUE AL EJECUTARLO MUESTRA EN CONSOLA LOS LOGGERS CON SUS NIVELES CORRESPONDIENTES
viewsRouter.get("/logger", addLogger, controllerLoggerExamples)

// RUTA REALTIVA QUE AL IR TE ENVIA UN EMAIL
viewsRouter.get("/email", addLogger, authDenied, controllerNodemailer)

// RUTA REALTIVA PARA CAMBIAR LA CONTRASEÑA
viewsRouter.get("/generatelink", addLogger, authDenied, controllerGenerateLink)

// RUTA REALTIVA PARA CAMBIAR LA CONTRASEÑA
viewsRouter.get("/link/:linkToken", addLogger, authDenied, controllerLink)

// RUTA REALTIVA PARA RENDERIZAR LA VISTA DEL ENVIO DE EMAIL
viewsRouter.get("/recoverPassword", addLogger, authDenied, controllerRecoverPassword)

// RUTA "POST" PARA CAMBIAR LA CONTRASEÑA DEL EMAIL DEL USUARIO POR MEDIO DEL LINK TEMPORAL GENERADO CON UUID
viewsRouter.post("/changePassword", addLogger, authDenied, controllerChangePasswordGet)

// RUTA RELATIVA QUE MUESTRA TODOS LOS DOCUMENTOS
viewsRouter.get("/api/documents", getAllDocumentss)

// RUTA RELATIVA QUE MUESTRA UN DOCUMENTO SEGUN SU _ID
viewsRouter.get("/api/documents/:did", getDocumentByIdd)

// RUTA "POST" QUE EN UN DOCUMENTO INDICADO AGREGA UN NOMBRE Y UNA REFERENCIA 
viewsRouter.post("/api/documents/:did", addDataInDocument);

export default viewsRouter;





// RUTAS COMENTADAS PORQUE FUERON LLEVADAS A SU ROUTER CORRECTO


// RUTAS SOLICITADAS EN LA CUARTA PRACTICA INTEGRADORA 
// RUTA "POST" QUE AGREGA EN EL ESQUEMA DE LOS USUARIOS EL DNI Y EL DOMICILIO DEL USUARIO EN SESSION
// viewsRouter.post("/api/user/data", addLogger, apiUserData)


// RUTA "GET" PARA OBTENER LOS PRODUCTOS DE FILE SYSTEM 
// viewsRouter.get("/products/fs", addLogger, homeProducts)

// RUTA "GET" PARA OBTENER LOS PRODUCTOS DE FILE SYSTEM EN TIEMPO REAL CON WEB SOCKET
// viewsRouter.get("/products/fs/socket", addLogger, realTimeProducts)

// RUTA "DELETE" PARA /REALTIMEPRODUCTS
// viewsRouter.delete("/realtimeproducts", async (req, res) => {
    // });
    
    // RUTA "POST" PARA /REALTIMEPRODUCTS
    // viewsRouter.post("/realtimeproducts", addLogger, realTimeProductsPost)
    
    // RUTA "GET" QUE RENDERIZA CON PAGINATION Y AGGREGATION LA VISTA "PRODUCTS.HANDLEBARS"
    // viewsRouter.get("/home-mongoDB", auth, addLogger, homeMongoDB)
    
    // METODO "POST" PARA AGREGAR UN DOCUMENTO NUEVO POR MEDIO DE UN FORMULARIO. 
    // viewsRouter.post("/home-mongoDB", addLogger, homeMongodbPost)
    
    // METODO "DELETE" PARA ELIMINAR POR _ID UN PRODUCTO DE mongoDB ATLAS.
    // viewsRouter.delete("/home-mongodb/:pid", addLogger, homeMongodbDinamica)
    
    
    
    
    
    
    
    
    
    // METODO "GET" PARA VER EL LOGIN DE USUARIOS
    // viewsRouter.get("/api/session/login", authDenied, addLogger, apiSessionLogin)
    
    // // // LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
    // viewsRouter.get("/api/session/logout", auth, addLogger, apiSessionLogout)
    
    // // RUTA RAIZ DE "/API/SESSION/DENTRO" CON HANDLEBARS. ACA TE REDIRIGE EL SERVIDOR AL LOGUEARTE EN GITHUB Y EN EL LOGIN DE MONGO-DB ATLAS
    // viewsRouter.get("/api/session/dentro", auth, addLogger, apiSessionDentro)
    
    // // METODO "GET" PARA VER EL REGISTRO DE USUARIOS
    // viewsRouter.get("/api/session/register", authDenied, addLogger, apiSessionRegister)
    
    
    
    
    // RUTA RAIZ DEL PROYECTO
    // viewsRouter.get("/", addLogger, rutaRaiz)
    
    // // RUTA "GET" PARA IR AL CHAT /CHAT
    // viewsRouter.get("/chat", lockUser, addLogger, getChat)
    
    


// RUTA PARA PROBAR ARTILLERY
// viewsRouter.get("/operacionsencilla", (req, res) => {
    //     let sum = 0
    //     for (let i = 0; i < 1000000; i++) {
        //         sum += i
        //     }
        //     res.send({ sum })
        // })
        
        // viewsRouter.get("/operacioncompleja", (req, res) => {
            //     let sum = 0
            //     for (let i = 0; i < 5e8; i++) {
                //         sum += i
//     }
//     res.send({ sum })
// })
