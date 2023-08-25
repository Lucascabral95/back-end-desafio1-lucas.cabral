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
} from "../services/views.router.services.js"
import cartsModel from "../DAO/models/carts.model.js"
import { createHash, isValidPassword } from "../utils.js";
import { generateToken } from "../jwt.js";
// import { generatorProducts } from "../mocks/products.js";
import cart from "../Routes/cart.js";
//-----------Custom Error------------------------------
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo, generateTicketErrorInfo } from "../services/errors/info.js";
//-----------Custom Error------------------------------

// LOGIGA DE /API/SESSION/CURRENT
export const controllerHomeMongodb = (req, res) => {
    try {
        const emailJwt = req.session.emailJwt;
        const dataUserCookie = req.cookies.dataUser || {};

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
        console.error("Error al registrar el usuario y el carrito:", error.message)
        return null;
    }
};

// LOGICA "POST" DE /API/SESSION/LOGIN
export const controllerApiSessionLogin = async (req, res, user) => {
    try {
        const busquedaData = await getByEmail(user.email);

        if (!busquedaData || !isValidPassword(busquedaData, user.password)) {
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
            console.log(user.email, token_access);
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
// export const controllerMongoDbPost = async (req, res, newProduct) => {
//     try {
//         if (
//             !newProduct.title ||
//             !newProduct.description ||
//             !newProduct.code ||
//             !newProduct.price ||
//             !newProduct.stock ||
//             !newProduct.category
//         ) {
//             return res
//                 .status(401)
//                 .json({ status: "error", message: "Todos los campos son obligatorios" });
//         }
//         const product = await add(newProduct);
//         return product
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ status: "error", message: "Error al agregar el producto" });
//     }
// };
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
    console.log("LLEGO?");
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
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error de servidor");
    }
}

import TicketServices from "../DAO/TicketsDAO.js"
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
    console.log(amount);
    const purchaser = req.session.emailUser;

    if (!amount || !purchaser) {
        const tickerError = generateTicketErrorInfo(amount, purchaser)
        new CustomError({
            name: "Error al generar el ticket",
            cause: tickerError,
            message: "Todos los campos son obligatorios.",
            code: EErrors.TICKET_ERROR
        })
    } else{
        const generatedTicket = await ticketDao.addTickets(amount, purchaser);
        console.log("Ticket generado exitosamente:", generatedTicket);
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
    } catch (error) {
        res.status(500).send("Error al mostrar el mock de productos.")
        console.log("Error al mostrar el mock de productos.");
    }
}
