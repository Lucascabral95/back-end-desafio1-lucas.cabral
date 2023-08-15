import cartsModel from "./models/carts.model.js"

class CartsManager {
    constructor() {
        this.model = cartsModel
    }

    getAllCarts = async () => {
        let carts
        try {
            carts = await this.model.find()
        } catch (error) {
            console.log("Error al mostrar carts");
        }
        return carts
    }

    addCarts = async (contenidoBody1) => {
        try {
            const carts = await cartsModel.create(contenidoBody1)
            console.log("Exito al crear cart.");
        } catch (error) {
            console.log("Error al crear cart.");
        }
    }

    deleteCartById = async (cid) => {
        let cart
        cart = await this.model.deleteOne({ _id: cid })
        if (cart) {
            console.log("Exito al eliminar el cart.");
        }
    }

    updateCartById = async (cartId, newData) => {
        try {
            const updateCart = await this.model.updateOne({ _id: cartId }, { newData })
            return updateCart
        } catch (error) {
            throw error
        }
    }

    subtractStock = async (pid, quantity) => {
        try {
            const findProducto = await this.model.findByIdAndUpdate(
                { _id: pid },
                { $inc: { stock: quantity } }
            )

            if (findProducto) {
                console.log("Stock actualizado correctamente.");
            } else {
                console.log("Producto no encontrado.");
            }

        } catch (error) {
            console.log("Error al restar stock con la compra");
        }
    }
}

export default CartsManager