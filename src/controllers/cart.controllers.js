import {
    cartsModelFindPopulate,
    cartsModelFindByIdPopulate,
    cartsModelCreate,
    cartsModelFindById,
    cartsModelFindByIdAndUpdate,

} from "../services/cart.services.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateAddToCartErrorInfo, generateTicketErrorInfo } from "../services/errors/info.js";

export const controllersApiCartsDB = async (req, res) => {
    try {
        const carts = await cartsModelFindPopulate();
        res.json(carts)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const controllersApiCartsDBDinamico = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModelFindByIdPopulate(cid)

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.send({ status: "Success", cart: cart })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const controllersApiCartDBPost = async (req, res) => {
    try {
        const body = req.body
        const newCart = await cartsModelCreate(body)

        res.send({ status: "success", message: "Exito al crear un nuevo carrito" })
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al crear un nuevo carrito" })
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
            const errorInfo = generateAddToCartErrorInfo(cid);
            throw CustomError.createError({
                name: "Error al agregar producto",
                cause: errorInfo,
                message: "Error al agregar el producto al carrito.",
                code: EErrors.ADDTOCART_ERROR
            });
        } else {
            const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            let result = await cart.save();
            res.status(201).json(result);
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
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const existingProduct = cart.products.find((product) => product.product.toString() === pid.toString());

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        if (existingProduct.quantity === null || existingProduct.quantity === undefined) {
            existingProduct.quantity = 1;
        } else {
            existingProduct.quantity = modificadorQuantity;
        }

        let result = await cart.save();

        res.status(200).json({ status: "Success", message: "Éxito al modificar la cantidad del producto seleccionado.", result: result, });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al modificar la cantidad del producto seleccionado.", error: error.message, });
    }
}

export const controllerApiCartDBDinamicoPut = async (req, res) => {
    try {
        const cid = req.params.cid;
        const product = req.body;
        await cartsModelFindByIdAndUpdate(cid, product)

        res.send({ status: "Success", message: "Exito al actualizar el carrito." })
    } catch (error) {
        res.send({ status: "Error", message: "Error al actualizar el carrito." })
    }
}

export const controllerApiCartDBDinamicoProductsDinamicoDelete = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await cartsModelFindById(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productIndex = cart.products.find((p) => p._id.toString() === pid.toString());

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.json({ status: "Success", message: "Éxito al eliminar el producto del carrito.", cart: cart });
    } catch (error) {
        res.send({ status: "Error", message: "Error al eliminar el producto del carrito." });
    }
}

export const controllerApiCartDBDinamicoDelete = async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await cartsModelFindById(cid);

        cart.products = [];

        const result = await cart.save();

        res.status(200).json({ status: "Success", message: "Éxito al eliminar el carrito.", result: result, });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Error al eliminar el carrito.", result: result });
    }
}


