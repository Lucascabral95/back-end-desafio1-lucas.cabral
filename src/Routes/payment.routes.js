import { Router } from "express";
const payment = Router()
import { addLogger } from "../utils/logger.js";
import { accessDeniedAdmin } from "../middlewares/auth.js";
import { compraHecha } from "../middlewares/expiration-link.js";
import {
    createSession,
    cancel,
    successfulPurchase,
} from "../controllers/payment.controllers.js";

// RUTA RELATIVA QUE MUESTRA LA VISTA DE PAGO DE STRIPE
payment.get("/create-checkout-session", addLogger, accessDeniedAdmin, createSession)

// RUTA A LA QUE TE REDIRIJE UNA COMPRA EXITOSA EN STRIPE. ESTA HACE DOS METODOS POST: 1) GENERA UN TICKET DE COMPRA CON LOS DETALLES. 2) HACE EL DESCUENTO DEL STOCK DE LOS PRODUCTOS Y ADEMAS VACIA EL CARRITO
// *SOLO SE PUEDE ACCEDER DESPUES DE HABER REALIZADO UNA COMPRA EXITOSA EN STRIPE*
payment.get("/success", addLogger, compraHecha, successfulPurchase)

// RUTA QUE MUESTRA EL PAGO CANCELADO MEDIANTE STRIPE
payment.get("/cancel", addLogger, cancel)

export default payment