// CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO //
// CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO //
// CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO // CAPA DE SERVICIO //
import {
    getByEmail,
    createUser,
    addProducts,
    add,
    deleteProductById,
    getCartUser,
    populateCart,
    serviceFaker,
    updatePasswordByEmail,
    updateRoleByEmail,
} from "../services/views.router.services.js"
import cartsModel from "../DAO/models/carts.model.js"
import { createHash, isValidPassword } from "../utils.js";
import bcrypt from "bcrypt"
import { generateToken } from "../jwt.js";
import { sendMail } from "../services/nodemailer.js";
import Swal from 'sweetalert2'
//-----------Custom Error------------------------------
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo, generateTicketErrorInfo } from "../services/errors/info.js";
//-----------Custom Error------------------------------
//------ UUID (para generar links temporales) ---------
import { v4 as uuidv4 } from 'uuid';
//------ UUID (para generar links temporales) ---------


// LOGIGA DE /API/SESSION/CURRENT
export const controllerHomeMongodb = async (req, res) => {
    try {
        const emailJwt = req.session.emailJwt;
        const dataUserCookie = req.cookies.dataUser || {};

        // const email = req.session.emailUser
        // const findUser = await getByEmail(email)
        // const role = findUser.role

        const dataUserFirstName = req.session.data[0];
        const dataUserLastName = req.session.data[1];
        const dataUserAge = req.session.data[2];
        const dataUserRole = req.session.rol;
        const dataUserCart = req.session.data[3];

        const datos = {
            email: emailJwt,
            firstName: dataUserFirstName,
            lastName: dataUserLastName,
            age: dataUserAge,
            role: dataUserRole,
            cart: dataUserCart,
        }
        return datos
    } catch (error) {
        res.status(500).json({ message: 'Error de inicio de sesión.' });
    }
}


// LOGICA "POST" DE /API/SESSION/REGISTER
export const apiSessionRegisterPost = async (req, res) => {
    let user = req.body;

    try {
        const resultado = await controllerApiSessionRegister(user);
        console.log(resultado);

        req.session.dataUser = resultado;
        res.render("login", {});
    } catch (error) {
        console.error("Error al registrar el usuario y el carrito:", error);
        res.render("register-error", {});
    }
};

// LOGICA "POST" DE /API/SESSION/REGISTER 
export const controllerApiSessionRegister = async (user) => {
    try {
        if (!user.first_name || !user.last_name || !user.email || !user.age || !user.password) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const cuentaUsuario = await getByEmail(user.email);
        if (cuentaUsuario) {
            throw new Error("El usuario ya está registrado.");
        }

        const newCart = cartsModel({ products: [] });
        const savedCart = await newCart.save();
        const newUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            password: createHash(user.password),
            role: user.role,
            cart: savedCart._id,
        };
        const savedUser = await createUser(newUser);
        return savedUser;
    } catch (error) {
        return null;
    }
};

// LOGICA "POST" DE /API/SESSION/LOGIN
export const controllerApiSessionLogin = async (req, res, user) => {
    try {
        const busquedaData = await getByEmail(user.email);

        if (!busquedaData || !isValidPassword(busquedaData, user.password)) {
            // req.logger.fatal(`Error al intentar iniciar sesión con ${busquedaData.email}`);
            return res.render("login-error", {});
        } else if (busquedaData.email === null || typeof busquedaData.email === "undefined") {
            return res.render("login-error", {});
        } else if (user.password === "adminCod3r123" && user.email === "adminCoder@coder.com") {
            req.session.rol = "Admin";
            req.session.existRol = true;
            req.session.emailUser = user.email;
            req.session.emailUser = "adminCoder@coder.com";
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart]
            const token_access = generateToken(user.email);
            req.session.emailJwt = user.email;
            return res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
        } else {
            req.session.rol = "Usuario";
            req.session.existRol = true;
            req.session.emailUser = user.email;
            //----------------
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart]
            //----------------
            // propiedades de JWT
            const token_access = generateToken(user.email);
            req.logger.debug(`Email del usuario: ${user.email}`)
            req.logger.debug(`Token JWT del usuario: ${token_access}`)
            req.logger.info(`Inicio de sesion exitoso con email: ${busquedaData.email}`)
            req.session.emailJwt = user.email;
            return res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Interno del Servidor");
    }
}


// LOGICA "POST" PARA /REALTIMEPRODUCTS
export const controllerRealTimeProductsPost = async (req, res, nuevoProducto) => {
    if (
        !nuevoProducto.title ||
        !nuevoProducto.description ||
        !nuevoProducto.code ||
        !nuevoProducto.price ||
        !nuevoProducto.stock ||
        !nuevoProducto.category
    ) {
        return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
    }
    const productos = await addProducts(nuevoProducto);
    return productos
}

// LOGICA "POST" DE /HOME-MONGODB
export const controllerMongoDbPost = async (req, res, newProduct) => {
    if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category
    ) {
        const errorInfo = generateProductErrorInfo(newProduct);
        throw CustomError.createError({
            name: "Error al agregar producto.",
            cause: errorInfo,
            message: "Todos los campos son obligatorios.",
            code: EErrors.INCOMPLETE_FIELDS
        });
    }
    const product = await add(newProduct);
    return product
};

// LOGICA "GET" DINAMICA DE /HOME-MONGODB
export const controllerMongoDbDinamico = async (pid) => {
    try {
        const prod = await deleteProductById(pid);
        return prod;
        
    } catch (error) {
        throw error;
    }
};

// LOGICA "POST" PARA DESCONTAR STOCK DE PRODUCTOS SEGUN SU _ID EN MONGODB ATLAS. 
export const controllerStock = async (req, res) => {
    const cid = req.params.cid;
    try {
        let cart = await populateCart(cid)
        const { products } = cart;
        for (const item of products) {
            const pid = item.product._id.toString();
            const quantity = item.quantity;

            await getCartUser(pid, quantity);
        }
        cart.products = [];
        await cart.save();
        res.send(cart);
        req.logger.info("¡¡¡Compra y descuento del stock exitosos!!! ")
    } catch (error) {
        req.logger.fatal("Error:", error)
        res.status(500).send("Error de servidor");
    }
}

import TicketServices from "../DAO/TicketsDAO.js"
// import { log } from "winston";
const ticketDao = new TicketServices()

// METODO "POST" PARA CREAR UN TICKET CON SUS RESPECTIVOS CAMPOS OBLIGATORIOS
// export const controllerTicket = async (req, res) => {
//     try {
//         const amount = req.session.sessionDataPurchase[8]
//         console.log(amount);
//         const purchaser = req.session.emailUser;

//         const generatedTicket = await ticketDao.addTickets(amount, purchaser);
//         console.log("Ticket generado exitosamente:", generatedTicket);
//         req.session.generatedTicket = generatedTicket

//         // res.status(201).json({ message: "Ticket generado exitosamente", ticket: generatedTicket });
//         res.redirect("/home-mongodb")
//     } catch (error) {
//         console.error("Error en el controlador:", error);
//         res.status(500).json({ error: "Ocurrió un error al generar el ticket" });
//     }
// };

export const controllerTicket = async (req, res) => {
    const amount = req.session.sessionDataPurchase[8]
    const purchaser = req.session.emailUser;

    if (!amount || !purchaser) {
        req.logger.fatal("Todos los campos son obligatorios.")
        const tickerError = generateTicketErrorInfo(amount, purchaser)
        throw CustomError.createError({
            name: "Error al generar el ticket.",
            cause: tickerError,
            message: "Todos los campos son obligatorios.",
            code: EErrors.TICKET_ERROR
        })
    } else {
        const generatedTicket = await ticketDao.addTickets(amount, purchaser);
        req.session.generatedTicket = generatedTicket
        res.redirect("/home-mongodb")
    }
};

// RUTA RELATIVA QUE MUESTRA UN NUMERO DINAMICO (100 EN ESTE CASO) DE PRODUCTOS PROVENIENTES DE "FAKER"
export const controllerMock = async (req, res) => {
    try {
        const productsMap = await serviceFaker(100)
        const products = productsMap.map(p => p.product)
        const price = productsMap.map(price => price.price)
        const color = productsMap.map(color => color.color)
        const dataBase = [products, price, color]

        res.render("mockingProducts", { data: dataBase })
        req.logger.info("Peticion GET a /mockingproducts exitosa.")
    } catch (error) {
        res.status(500).send("Error al mostrar el mock de productos.")
        req.logger.fatal("Error al mostrar el mock de productos.")
    }
}

// RUTA RELATIVA QUE MUESTRA EN TERMINAL LOS LOGGER DE WINSTON 
export const controllerLoggerExamples = async (req, res) => {
    try {
        req.logger.warning("Hola, soy warn")
        req.logger.fatal("Hola, soy fatal")
        req.logger.debug("Hola, soy debug")
        res.send({ message: "¡Prueba de logger!" })
    } catch (error) {
        console.log("Error al generar en la terminar la lista de errores.");
        next(error)
    }
}

export const controllerNodemailer = async (req, res) => {
    let email = req.query.email
    try {
        const linkToken = uuidv4()
        const expirationTime = Math.floor(Date.now() / 1000) + 3600 // tiempo en segundos para que expire este link temporal para restablecer la contraseña (1 hora)
        const enlace = `http://localhost:8080/link/${linkToken}?expira=${expirationTime}`

        let option = ({
            from: " Proyecto de Backend <lucasgamerpolar10@gmail.com>",
            to: email,
            subject: "Link para restablecer contraseña. Expira en 1 hora.",
            html: `
            <div>
            <p> Para actualizar su contraseña, </p> <a href="${enlace}"> clickeá acá. </a>
            </div>
            `,
            attachments: []
        })

        const findEmail = await getByEmail(email)

        if (findEmail) {
            let result = await sendMail(option)
            res.cookie("emailRecuperacion", email, { maxAge: 3600000 }); // tiempo en milisegundos que se guardara la cookie (1 hora)
            res.send({ status: "success", result: "Email sent" })
            req.logger.info(`Exito al enviar correo a ${email}`)
        } else {
            req.logger.fatal(`Email no existente en la base de datos.`);
        }

    } catch (error) {
        req.logger.fatal(`Error al enviar correo a ${email}`);
    }
}

export const controllerGenerateLink = async (req, res) => {
    res.render("generateLink");
};

export const controllerLink = async (req, res) => {
    const linkToken = req.params.linkToken;
    const expirationTime = req.query.expira;

    const tiempoRestante = expirationTime - Math.floor(Date.now() / 1000);
    const emailCheck = req.cookies.emailRecuperacion
    console.log(emailCheck);

    if (tiempoRestante > 0) {
        res.render("change-password", { email: emailCheck })
    } else {
        res.render("expirationPage")
    }
}

export const controllerRecoverPassword = async (req, res) => {
    res.render("recoverPassword")
}

export const controllerChangePassword = async (req, res) => {
    try {
        const password = req.body
        const user = req.cookies.emailRecuperacion

        const findEmail = await findEmail(user)
        const emailPass = findEmail.password
        console.log(emailPass);

        if (password) {

        } else {
            req.logger.fatal("Ingrese una contraseña.")
        }

    } catch (error) {
        req.logger.fatal("No se ha podido cambiar la contraseña.")
    }
}

export const controllerChangePasswordGet = async (req, res) => {
    const newPassword = req.body.password;
    const user = req.cookies.emailRecuperacion;

    try {
        const findEmail = await getByEmail(user);

        if (!findEmail) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        const emailPassword = findEmail.password;
        const isPasswordValid = await bcrypt.compare(newPassword, emailPassword);

        if (isPasswordValid) {
            req.logger.warning("La contraseña debe ser distinta a la orignal.");
            res.send({ message: "Error al cambiar la contraseña. Debe ser diferente a la orignal" });
        } else {
            const passHasheada = await createHash(newPassword)
            await updatePasswordByEmail(user, passHasheada)
            req.logger.info("Exito al cambiar la contraseña.");
            // res.status(401).send({ message: "Exito al cambiar la contraseña" });
            res.render("successChangePassword")
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}


export const controllerUsersPremium = async (req, res) => {
    const email = req.session.emailUser
    const findUser = await getByEmail(email)
    const roleOfEmail = findUser.role
    const idOfEmail = findUser._id

    const changeRole = findUser.role === "user" ? "premium" : "user"
    const data = [roleOfEmail, idOfEmail, email, changeRole]

    res.render("changeRole", { role: data })
}

export const controllerUsersPremiumPost = async (req, res) => {
    const uid = req.params.uid
    const email = req.session.emailUser
    const findUser = await getByEmail(email)
    const role = findUser.role
    const changeRole = role === "user" ? "premium" : "user"

    await updateRoleByEmail(email, changeRole)
    console.log("Exito al cambiar de Role de usuario.");
}

