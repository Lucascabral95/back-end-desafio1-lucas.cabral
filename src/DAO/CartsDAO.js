import { cartsModel } from "./models/carts.model.js"

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

    addCarts = async (contenidoCart) => {
        try {
            const { productos = [] } = contenidoCart

            const cart = await cartsModel.create({ productos })
            console.log("Creacion de carrito exitosa.");
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