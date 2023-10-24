import { Router } from "express";
const sessions = Router()
import { auth, authDenied, lockUser, accessDeniedAdmin } from "../middlewares/auth.js";
import { addLogger } from "../utils/logger.js";
import passport from "passport";
//--------------------------------------JWT-------------------------------------------
import { authToken } from "../jwt.js";
//--------------------------------------JWT-------------------------------------------

import {
    apiSessionDentro,
    apiSessionRegister,
    apiSessionCurrent,
    apiSessionLogout,
    controllerApiSessionRegister,
    apiSessionLogin,
    apiSessionLoginPost,
} from "../controllers/sessions.controllers.js";

// PASSPORT-GITHUB2
// RUTA "GET" PARA LOGUEARTE CON TU CUENTA DE GITHUB.
sessions.get("/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

sessions.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }),
    (req, res) => {
        req.session.emailUser = req.user;
        req.session.rol = "Usuario";
        req.session.exitsRol = false
        // res.redirect("/api/session/dentro");
        res.redirect("/home-mongodb");
    }
);
// PASSPORT-GITHUB2

// RUTA RAIZ DE "/API/SESSION/DENTRO" CON HANDLEBARS. ACA TE REDIRIGE EL SERVIDOR AL LOGUEARTE EN GITHUB Y EN EL LOGIN DE MONGO-DB ATLAS
sessions.get("/api/session/dentro", auth, addLogger, apiSessionDentro)

// METODO "GET" PARA VER EL REGISTRO DE USUARIOS
sessions.get("/api/session/register", authDenied, addLogger, apiSessionRegister)

// RUTA "GET" CON DOS MIDDLEWARES DONDE SOLO SE PUEDE ACCEDER LUEGO DE LOGUEARTE CORRECTAMENTE Y QUE EL SERVIDOR LEA CORRECTAMENTE TU TOKEN "JWT"
// ENVIADO DESDE LA COOKIE "authToken" Y SE ASEGURE QUE SEA EL TOKEN CORRECTO ASOCIADO AL USUARIO EN CUESTION.
// Esta ruta te muestra todos los datos con los que te registraste: nombre, apellido, edad, email, rol (user), e .ID del cart generado.
sessions.get("/api/session/current", auth, authToken, addLogger, apiSessionCurrent)

// LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
sessions.get("/api/session/logout", auth, addLogger, apiSessionLogout)

// METODO "POST" PARA REGISTRARTE. AL HACERLO, LA CONTRASEÑA SE HASHEA CON BCRYPT Y SE LEE EN EL LOGIN. TAMBIEN SE CREA UN CART CON SU ID 
// EN REFERENCIA A LA COLECCION CARTS.
sessions.post("/api/session/register", addLogger, controllerApiSessionRegister)

// METODO "GET" PARA VER EL LOGIN DE USUARIOS
sessions.get("/api/session/login", authDenied, addLogger, apiSessionLogin)

// METODO "POST" PARA LOGUEARTE CON LA CONTRASEÑA YA HASHEADA DEL REGISTER. AL LOGUEARTE CORRECTAMENTE SE GENERA UN TOKEN "JWT" Y SE ALMACENA EN 
// COOKIE "authToken" DONDE EL SERVIDOR LA LEE Y VERIFICA EN "/API/SESSION/CURRENT", SI ES CORRECTO EL TOKEN, EL MIDDLEWARE "authToken" TE DEJA ENTRAR EN DICHA RUTA
sessions.post("/api/session/login", addLogger, apiSessionLoginPost)

export default sessions