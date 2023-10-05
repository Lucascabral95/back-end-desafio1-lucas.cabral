import { Router } from "express";
const users = Router()
import { accessDeniedforAdmin } from "../middlewares/auth.js"
import { addLogger } from "../utils/logger.js";
import { uploader, productUploader } from "../multer.js";
import {
    controllerUsersPremium,
    controllerUsersPremiumPost,
    uploadPhotos,
    uploaderPhotosProfile,
    uploaderPhotosProduct,
} from "../controllers/users.controllers.js";

// RUTA REALTIVA PARA AGREGAR TU DNI Y DOMICILIO Y ASI TENER EL PRIVILEGIO DE PASAR DE UN ROL "USER" A "PREMIUM"
users.get("/api/users/premium", addLogger, accessDeniedforAdmin, controllerUsersPremium)

// RUTA "POST" QUE PERMITE CAMBIAR EL ROL DE UN USUARIO, DE "USER" A "PREMIUM" Y VICEVERSA
users.post("/api/users/premium/:uid", addLogger, controllerUsersPremiumPost)

// RUTA RELATIVA QUE MUESTRA UN ENTORNO PARA SUBIR IMAGENES DE PERFIL Y DE PRODUCTOS
users.get("/api/users/documents", addLogger, uploadPhotos)

// RUTA "POST" QUE AGREGA UN ARCHIVO SUBIDO POR EL CLIENTE A LA CARPETA /PUBLIC/DOCUMENTS/PROFILES
users.post("/api/users/documents/profile", addLogger, uploader.single("file"), uploaderPhotosProfile)

// RUTA "POST" QUE AGREGA UN ARCHIVO SUBIDO POR EL CLIENTE A LA CARPETA /PUBLIC/DOCUMENTS/PROFILES
users.post("/api/users/documents/products", addLogger, productUploader.single("product"), uploaderPhotosProduct)

export default users