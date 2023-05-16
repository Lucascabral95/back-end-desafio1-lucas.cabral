import { promises as fs, readFile } from "fs"

class CartManager {
    constructor() {
        this.path = "./carrito.json"
    }

    getCarts = async () => {
        try {
            const data = await fs.readFile(this.path, "utf-8")
            const dataParse = JSON.parse(data)
            const carritos = dataParse

            return carritos
        } catch (error) {
            console.log("Error al leer archivo json", error)
        }
    }

    addCarts = async () => {
        try {
            const carritos = await this.getCarts()
            const ultimoCartId = carritos.length > 0 ? carritos[carritos.length - 1].id : 0

            const camposObligatorios = { id: ultimoCartId + 1, products: [] }
            carritos.push(camposObligatorios)

            await fs.writeFile(this.path, JSON.stringify(carritos))
            return carritos
        } catch (error) {
            console.log("Error al agregar el nuevo carrito.")
        }
    }

}

export default CartManager
