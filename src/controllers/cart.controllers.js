import {
    cartsModelFindPopulate,
    cartsModelFindByIdPopulate,
    cartsModelCreate,
    cartsModelFindById,
    cartsModelFindByIdAndUpdate,

} from "../services/cart.services.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
    generateAddToCartErrorInfo,
} from "../services/errors/info.js";

export const controllersApiCartsDB = async (req, res) => {
    try {
        const carts = await cartsModelFindPopulate();
        // res.json(carts)
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
//----------------------------------------------------------------------------------------------
// export const controllersApiCartDBDinamicoProductsDinamico = async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const pid = req.params.pid;

//         let cart = await cartsModelFindById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: "Carrito no encontrado" });
//         }

//         const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

//         if (existingProduct) {
//             existingProduct.quantity++;
//         } else {
//             cart.products.push({ product: pid, quantity: 1 });
//         }

//         let result = await cart.save();

//         res.status(201).json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }
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
        res.status(200).json({ message: "Producto agregado exitosamente al carrito seleccionado", payload: result});
    }
}
//----------------------------------------------------------------------------------------------

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


