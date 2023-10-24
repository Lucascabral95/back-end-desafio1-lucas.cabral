import { Router } from "express";
const users = Router()
import { auth, lockUser, accessDeniedAdmin } from "../middlewares/auth.js"
import { authToken } from "../jwt.js";
import { addLogger } from "../utils/logger.js";
import { uploader, productUploader } from "../multer.js";
import {
    controllerUsersPremium,
    controllerUsersPremiumPost,
    uploadPhotos,
    uploaderPhotosProfile,
    uploaderPhotosProduct,
    allUsers,
    deleteApiUser,
    updateUserByIdPost,
    apiUserData,
    eliminarUsuariosPorInactividad,
} from "../controllers/users.controllers.js";

// RUTA "GET" QUE MUESTRA UNA TABLA CON EL NOMBRE/EMAIL/ROLE DE TODOS LOS USUARIOS DE LA BASE DE DATOS Y LA POSIBILIDAD DE PODER MODIFICAR SUS ROLES. (VISTA DISPONIBLE SOLO PARA "ADMIN")
users.get("/api/users", addLogger, lockUser, allUsers)

// RUTA "DELETE" QUE ELIMINAR A TODOS LOS USUARIOS QUE NO HAYAN ENTRADO INICIADO SESION O SE HAYAN DESLOGUADO EN LA ULTIMA MEDIA HORA
users.get("/api/users/delete", addLogger, lockUser, eliminarUsuariosPorInactividad)

// RUTA RELATIVA PARA AGREGAR TU DNI Y DOMICILIO Y ASI TENER EL PRIVILEGIO DE PASAR DE UN ROL "USER" A "PREMIUM"
users.get("/api/users/premium", addLogger, accessDeniedAdmin, controllerUsersPremium)

// RUTA "POST" QUE PERMITE CAMBIAR EL ROL DE UN USUARIO, DE "USER" A "PREMIUM" Y VICEVERSA
users.post("/api/users/premium/:uid", addLogger, controllerUsersPremiumPost)

// RUTA RELATIVA QUE MUESTRA UN ENTORNO PARA SUBIR IMAGENES DE PERFIL Y DE PRODUCTOS
users.get("/api/users/documents", addLogger, auth, authToken, uploadPhotos)

// RUTA "POST" QUE AGREGA UN ARCHIVO SUBIDO POR EL CLIENTE A LA CARPETA /PUBLIC/DOCUMENTS/PROFILES
users.post("/api/users/documents/profile", addLogger, uploader.single("file"), uploaderPhotosProfile)

// RUTA "POST" QUE AGREGA UN ARCHIVO SUBIDO POR EL CLIENTE A LA CARPETA /PUBLIC/DOCUMENTS/PROFILES
users.post("/api/users/documents/products", addLogger, productUploader.single("product"), uploaderPhotosProduct)

// RUTA "DELETE" QUE ELIMINA UN USUARIO POR EMAIL. (VISTA DISPONIBLE SOLO PARA "ADMIN")
users.delete("/api/users/:email", addLogger, deleteApiUser) // ATENCION

// RUTA "POST" QUE ACTUALIZA EL ROL DE UN USUARIO. (VISTA DISPONIBLE SOLO PARA "ADMIN")
users.post("/api/users/:email", addLogger, updateUserByIdPost) // ATENCION

// RUTA "POST" QUE AGREGA EN EL ESQUEMA DE LOS USUARIOS EL DNI Y EL DOMICILIO DEL USUARIO EN SESSION
users.post("/api/user/data", addLogger, apiUserData)

export default users