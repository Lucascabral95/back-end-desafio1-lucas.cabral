import cartsModel from "./models/carts.model.js"
import productsModel from "./models/products.model.js"

class CartsManager {
    constructor() {
        this.model = cartsModel,
            this.productsModel = productsModel
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

    getCartById = async (pid) => {
        try {
            let cart = await this.model.findById({ _id: pid })
            return cart
        } catch (error) {
            console.log(("Producto no encontrado"));
        }
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
            const findProducto = await this.productsModel.findByIdAndUpdate(
                { _id: pid },
                { $inc: { stock: -quantity } }
            )

            if (findProducto) {
                console.log("Stock actualizado correctamente.");
            } else {
                console.log("Producto no encontrado.", findProducto);
            }

        } catch (error) {
            console.log("Error:", error);
        }
    }
}

export default CartsManager