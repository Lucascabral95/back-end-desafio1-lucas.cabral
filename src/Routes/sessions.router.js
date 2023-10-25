import { Router } from "express";
const sessions = Router()
import { auth, authDenied, onlyAccessGithubUser } from "../middlewares/auth.js";
import { addLogger } from "../utils/logger.js";
import passport from "passport";
import { authToken } from "../jwt.js";

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
// sessions.get("/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { }) // PARA DESARROLLO  

// sessions.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }), // PARA DESARROLLO
//     (req, res) => { // PARA DESARROLLO
//         req.session.emailUser = req.user; // PARA DESARROLLO
//         req.session.rol = "Usuario"; // PARA DESARROLLO
//         req.session.exitsRol = false // PARA DESARROLLO
//         res.cookie("idDocument", req.session.emailUser.documents ? req.session.emailUser.documents.toString() : ""); // PARA DESARROLLO
//         res.redirect("/home-mongodb"); // PARA DESARROLLO
//     }
// );
sessions.get("https://back-end-desafio1-lucascabral-production.up.railway.app/api/session/github", authDenied, passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

sessions.get("/api/session/githubcallback", authDenied, passport.authenticate("github", { failureRedirect: "/api/session/login" }),
    (req, res) => {
        req.session.emailUser = req.user;
        req.session.rol = "Usuario";
        req.session.exitsRol = false;
        res.cookie("idDocument", req.session.emailUser.documents ? req.session.emailUser.documents.toString() : "");
        res.redirect("/home-mongodb");
    }
);

// PASSPORT-GITHUB2

// EN ESTA RUTA ESTAN TODOS LOS DATOS DE CONTACTO DE LOS USUARIOS LOGUEADOS CON GITHUB
sessions.get("/api/session/dentro", auth, addLogger, onlyAccessGithubUser, apiSessionDentro)

// METODO "GET" PARA VER EL REGISTRO DE USUARIOS
sessions.get("/api/session/register", authDenied, addLogger, apiSessionRegister)

// RUTA "GET" QUE MUESTRA TODA TU INFORMACION DE USUARIO
sessions.get("/api/session/current", auth, authToken, addLogger, apiSessionCurrent)

// LOGICA PARA CERRAR SESSION AL IR A ESTA RUTA.
sessions.get("/api/session/logout", auth, addLogger, apiSessionLogout)

// METODO "POST" PARA REGISTRARTE.
sessions.post("/api/session/register", addLogger, controllerApiSessionRegister)

// METODO "GET" PARA VER EL LOGIN DE USUARIOS
sessions.get("/api/session/login", authDenied, addLogger, apiSessionLogin)

// METODO "POST" PARA LOGUEARTE CON LA CONTRASEÑA YA HASHEADA DEL REGISTER.
sessions.post("/api/session/login", addLogger, apiSessionLoginPost)

export default sessions