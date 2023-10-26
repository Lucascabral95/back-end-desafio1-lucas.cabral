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
    const token = req.cookies.authToken;

    if (token) {
        try {
            req.user = jwt.verify(token, KEY_SECRET);
        } catch (error) {
            return res.status(401).json({
                error: "Token inválido.",
                message: "El token enviado no es válido o no tiene el nivel de acceso suficiente para este recurso."
            });
        }
    }

    if (req.session.emailUser.last_name === "Usuario de Github" || token) {
        next();
    } else {
        return res.status(401).json({
            error: "Acceso no autorizado.",
            message: "No tiene el nivel de acceso suficiente para este recurso."
        });
    }
};
