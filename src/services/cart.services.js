import cartsModel from "../DAO/models/carts.model.js"

export const cartsModelFindPopulate = async (req, res) => {
    try {
        const populate = await cartsModel.find().populate("products.product");
        return populate
    } catch (error) {
        console.log("Error al llamar a la funcion con Populate.");
    }
}

export const cartsModelFindByIdPopulate = async (cid) => {
    try {
        const cart = await cartsModel.findById(cid).populate("products.product");
        return cart;
    } catch (error) {
        console.error("Error al llamar a la funcion con Populate:", error);
        throw error;
    }
}

export const cartsModelCreate = async (req, res, body) => {
    try {
        const create = await cartsModel.create(body)
        return create
    } catch (error) {
        console.log("Error crear un carrito.");
    }
}

export const cartsModelFindById = async (cid) => {
    try {
        const findById = await cartsModel.findById(cid);
        return findById;
    } catch (error) {
        console.log("Error al buscar carrito.");
    }
}

export const cartsModelFindByIdAndUpdate = async (cid, product) => {
    try {
        const updatedCart = await cartsModel.findByIdAndUpdate(
            cid,
            { $push: { products: product } },
            { new: true }
        );
        return updatedCart;
    } catch (error) {
        console.log("Error al actualizar carrito.", error);
        throw error;
    }
}
