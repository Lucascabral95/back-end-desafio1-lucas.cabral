import { Router } from "express";
const viewsRouter = Router();
import { authDenied, lockUser, accessDeniedAdmin } from "../middlewares/auth.js"
import { addLogger } from "../utils/logger.js";
import {
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

// RUTA RAIZ DEL PROYECTO
viewsRouter.get("/", addLogger, rutaRaiz)

// RUTA "GET" PARA IR AL CHAT /CHAT. (SOLO DISPONIBLE PARA ADMIN)
viewsRouter.get("/chat", lockUser, addLogger, getChat)

//RENDERIZA VISTA "GET" DE /COMPLETED/PURCHASE 
viewsRouter.get("/completed/purchase", accessDeniedAdmin, addLogger, completedPurchase)

// RUTA RELATIVA QUE MUESTRA UN NUMERO DINAMICO (100 EN ESTE CASO) DE PRODUCTOS PROVENIENTES DE "FAKER"
// (LO PODES VER INCLUSO SI NO ESTAS LOGUEADO)
viewsRouter.get("/mockingproducts", addLogger, controllerMock)

// RUTA REALTIVA QUE AL EJECUTARLO MUESTRA EN CONSOLA LOS LOGGERS CON SUS NIVELES CORRESPONDIENTES
viewsRouter.get("/logger", addLogger, controllerLoggerExamples)

// RUTA RELATIVA QUE AL IR TE ENVIA UN EMAIL
viewsRouter.get("/email", addLogger, authDenied, controllerNodemailer)

// RUTA REALTIVA PARA CAMBIAR LA CONTRASEÑA
viewsRouter.get("/generatelink", addLogger, authDenied, controllerGenerateLink)

// RUTA REALTIVA PARA CAMBIAR LA CONTRASEÑA
viewsRouter.get("/link/:linkToken", addLogger, authDenied, controllerLink)

// RUTA REALTIVA PARA RENDERIZAR LA VISTA DEL ENVIO DE EMAIL
viewsRouter.get("/recoverPassword", addLogger, authDenied, controllerRecoverPassword)

// RUTA "POST" PARA CAMBIAR LA CONTRASEÑA DEL EMAIL DEL USUARIO POR MEDIO DEL LINK TEMPORAL GENERADO CON "UUID"
viewsRouter.post("/changePassword", addLogger, authDenied, controllerChangePasswordGet)

// RUTA RELATIVA QUE MUESTRA TODOS LOS DOCUMENTOS
viewsRouter.get("/api/documents", getAllDocumentss)

// RUTA RELATIVA QUE MUESTRA UN DOCUMENTO SEGUN SU _ID
viewsRouter.get("/api/documents/:did", getDocumentByIdd)

// RUTA "POST" QUE EN UN DOCUMENTO INDICADO AGREGA UN NOMBRE Y UNA REFERENCIA 
viewsRouter.post("/api/documents/:did", addDataInDocument);

export default viewsRouter;
