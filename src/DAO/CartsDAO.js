// import { cartsModel } from "./models/carts.model.js"
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

}

export default CartsManager