import {
    cartsModelFindPopulate,
    cartsModelFindByIdPopulate,
    cartsModelCreate,
    cartsModelFindById,
    cartsModelFindByIdAndUpdate,
} from "../services/cart.services.js"
import {
    cartsModelFindService,
    cartsModelFindByIdService,
    populateCart,
    getCartUser,
    getByEmail,
} from "../services/views.router.services.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
    generateAddToCartErrorInfo,
    generateTicketErrorInfo,
} from "../services/errors/info.js";
import {
    getDocumentById
} from "../services/documents.services.js";
import TicketServices from "../DAO/TicketsDAO.js"
const ticketDao = new TicketServices()

export const controllersApiCartsDB = async (req, res) => {
    try {
        const carts = await cartsModelFindPopulate();
        res.status(200).json(carts)
        req.logger.info(`Peticion GET a /api/cartsDB exitosa`)
    } catch (error) {
        res.status(500).json({ error: error.message });
        req.logger.fatal(`Error al mostrar Carts`)
    }
}

export const controllersApiCartsDBDinamico = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModelFindByIdPopulate(cid)

        if (!cart) {
            req.logger.fatal(`Carrito con _id: ${cid} no encontrado.`)
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.send({ status: "Success", cart: cart })
        req.logger.info(`Carrito con _id: ${cid} encontrado.`)
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const controllersApiCartDBPost = async (req, res) => {
    try {
        const body = req.body
        const newCart = await cartsModelCreate(body)

        res.status(200).send({ message: "Exito al crear un nuevo carrito" })
        req.logger.info(`Exito al crear nuevo carrito.`)
    } catch (error) {
        res.status(400).send({ message: "Error al crear un nuevo carrito" })
        req.logger.fatal(`Error al crear nuevo carrito.`)
    }
}

export const controllersApiCartDBDinamicoProductsDinamico = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    let cart = await cartsModelFindById(cid);
    if (!cart) {
        res.send("sorry pero es incorrecto")
        const errorInfo = generateAddToCartErrorInfo(cid, pid);
        throw CustomError.createError({
            name: "Error al agregar producto",
            cause: errorInfo,
            message: "Error al agregar el producto al carrito seleccionado.",
            code: EErrors.ADDTOCART_ERROR
        });
    } else {
        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
            req.logger.info(`Producto agregado al carrito exitosamente.`)
        }
        let result = await cart.save();
        res.status(200).json({ message: "Producto agregado exitosamente al carrito seleccionado", payload: result });
    }
}

export const controllersApiCartDBPutProductsPut = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const modificadorQuantity = req.body.quantity;

        const cart = await cartsModelFindById(cid);

        if (!cart) {
            req.logger.fatal(`Carrito no encontrado`)
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

        if (!existingProduct) {
            req.logger.fatal(`Producto no encontrado en el carrito.`)
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        if (existingProduct.quantity === null || existingProduct.quantity === undefined) {
            existingProduct.quantity = 1;
        } else {
            existingProduct.quantity = modificadorQuantity;
        }

        let result = await cart.save();

        res.status(200).json({ message: "Éxito al modificar la cantidad del producto seleccionado.", result: result });
        req.logger.info(`Exito al modificar la cantidad del producto con _id: ${pid}.`)
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al modificar la cantidad del producto seleccionado.", error: error.message, });
        req.logger.fatal(`Error al modificar la cantidad del producto seleccionado.`)
    }
}

export const controllerApiCartDBDinamicoPut = async (req, res) => {
    try {
        const cid = req.params.cid;
        const product = req.body;
        await cartsModelFindByIdAndUpdate(cid, product)

        res.status(400).send({ message: "Exito al actualizar el carrito." })
        req.logger.info(`Exito al actualizar carrito.`)
    } catch (error) {
        res.status(400).send({ message: "Error al actualizar el carrito." })
        req.logger.fatal(`Error al actualizar el carrito.`)
    }
}

export const controllerApiCartDBDinamicoProductsDinamicoDelete = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await cartsModelFindById(cid);

        if (!cart) {
            req.logger.fatal("Carrito no encontrado.")
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productIndex = cart.products.find((p) => p._id.toString() === pid.toString());

        if (productIndex === -1) {
            req.logger.fatal("Producto no encontrado en el carrito.")
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Éxito al eliminar el producto del carrito.", cart: cart });
        req.logger.info(`Exito al eliminar el producto con _id: ${pid} del carrito.`)
    } catch (error) {
        res(400).send({ message: "Error al eliminar el producto del carrito." });
        req.logger.fatal("Error al eliminar el producto del carrito.")
    }
}

export const controllerApiCartDBDinamicoDelete = async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await cartsModelFindById(cid);

        cart.products = [];

        const result = await cart.save();

        res.status(200).json({ status: "Success", message: "Éxito al eliminar todos los productos del carrito.", result: result, });
        req.logger.info(`Exito al eliminar todos los productos del carrito con _id: ${cid}.`)
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al eliminar todos los productos del carrito.", result: result });
        req.logger.fatal("Error al eliminar el carrito.")
    }
}

// RUTA "GET" PARA /CARTS/:CID/PURCHASE
export const cartsParams = async (req, res) => {
    const userr = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    const findUserr = await getByEmail(userr)
    const userIdd = findUserr._id
    const cartAll = await cartsModelFindService();
    const cid = req.params.cid;
    const cart = await cartsModelFindByIdService(cid)
    const idDocument = req.cookies.idDocument
    const find = await getDocumentById(idDocument)
    const findPhoto = find.documents.filter(i => i.image === "profile")
    let documentReference
    if (findPhoto) {
        documentReference = findPhoto.map(n => n.reference)
    }
    const ultimoValor = documentReference[documentReference.length - 1]
    const length = documentReference.length
    const referenceLength = length === 0 ? false : true
    try {
        const cartId = cart._id;
        const productId = cart.products.map((prod) => prod.product._id);
        const title = cart.products.map((prod) => prod.product.title);
        const price = cart.products.map((prod) => prod.product.price);
        const quantity = cart.products.map((prod) => prod.quantity);
        const totalPrice = price.map((p, index) => parseFloat(p) * parseFloat(quantity[index]));
        const totalPriceFull = totalPrice.reduce((accumulator, current) => accumulator + current, 0);
        const totalPriceFullWithComa = totalPriceFull
        const cartIdAll = cartAll.map((i) => i._id);
        const userEmailSession = req.session.emailUser

        req.session.sessionDataPurchase = [
            cart,
            cartId,
            productId,
            title,
            price,
            quantity,
            totalPrice,
            totalPriceFull,
            totalPriceFullWithComa,
            cartIdAll,
            userEmailSession,
            ultimoValor,
            referenceLength,
        ]

        const push1 = req.session.sessionDataPurchase[3];
        const push2 = req.session.sessionDataPurchase[5];
        const push3 = req.session.sessionDataPurchase[4];
        const combinedArray = [];
        const maxLength = Math.min(push1.length, push2.length, push3.length);
        for (let i = 0; i < maxLength; i++) {
            const producto = push1[i];
            const cantidad = push2[i];
            const precio = push3[i];
            combinedArray.push({ producto, cantidad, precio });
        }
        const productArray = combinedArray.map(productos => productos.producto)
        const cantidadArray = combinedArray.map(cantidad => cantidad.cantidad)
        const precioArray = combinedArray.map(precio => precio.precio)
        const precioTotalArray = "$ " + precioArray.reduce((total, cantidad) => total + cantidad)
        const cartIdMap = Array(title.length).fill(cartId);
        req.logger.debug(`Precio total del carrito: ${precioTotalArray}`)

        const datos = [
            cart,
            productId,
            title,
            quantity,
            price,
            totalPrice,
            totalPriceFullWithComa,
            cartId,
            cartIdAll,
            userEmailSession,
            productArray,
            cantidadArray,
            precioArray,
            precioTotalArray,
            cartIdMap,
            userIdd,
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4],
            req.session.dataSubHeader[5],
        ];

        req.logger.info(`Exito al cargar los datos de tu carrito con _id: ${cid}`)
        res.render("cartId", { datos });
    } catch (error) {
        console.log(cart);
        const datos = [
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4]
        ]
        res.render("emptyCart", { datos: datos })
    }
};

export const productsDiscointInCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    let cart = await cartsModelFindById(cid);
    if (!cart) {
        res.send("sorry pero es incorrecto")
        const errorInfo = generateAddToCartErrorInfo(cid, pid);
        throw CustomError.createError({
            name: "Error al agregar producto",
            cause: errorInfo,
            message: "Error al agregar el producto al carrito seleccionado.",
            code: EErrors.ADDTOCART_ERROR
        });
    } else {
        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());
        if (existingProduct) {
            existingProduct.quantity--;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
            req.logger.info(`Producto agregado al carrito exitosamente.`)
        }
        let result = await cart.save();
        res.status(200).json({ message: "Producto agregado exitosamente al carrito seleccionado", payload: result });
    }
}

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