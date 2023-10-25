import jwt from "jsonwebtoken"
import config from "./config/config.js"

const KEY_SECRET = config.key_jwt

// MIDDLEWARE QUE GUARDA LA GENERA UNA COOKIE ASOCIADA AL EMAIL CON EL QUE TE LOGUEASTE
export const generateToken = (user) => {
    const token = jwt.sign({ user }, KEY_SECRET, { expiresIn: "3h" })
    return token
}

// MIDDLEWARE QUE RECIBE EL VALOR DE "REQ.COOKIES.AUTHTOKEN" CON EL TOKEN "JWT" Y SE ENCARGA DE LEERLO Y VERIFICAR QUE SEA CORRECTO PARA DEJARTE AVANZAR A LA RUTA DONDE SE LO APLICA.
export const authToken = (req, res, next) => {
    const token = req.cookies.authToken
    if (!token) {
        return res.status(401).json({
            error: "No tiene token",
            message: "No tiene token"
        })
    }
    try {
        req.user = jwt.verify(token, KEY_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({
            error: "Token invalido.",
            message: "El token enviado no es valido o no tiene el nivel de acceso suficiente para este recurso."
        })
    }
}
// export const authToken = (req, res, next) => {
//     const token = req.cookies.authToken
//     if (!token) {
//         return res.status(401).json({
//             error: "No tiene token",
//             message: "No tiene token"
//         })
//     }
//     try {
//         req.user = jwt.verify(token, KEY_SECRET)
//         next()
//     } catch (error) {
//         return res.status(401).json({
//             error: "Token invalido.",
//             message: "El token enviado no es valido o no tiene el nivel de acceso suficiente para este recurso."
//         })
//     }
// }