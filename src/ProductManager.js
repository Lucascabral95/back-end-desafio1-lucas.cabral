import { promises as fs, readFile } from "fs"

class ProductManager {
    constructor() {
        this.path = "./productos.json"
    }

    getProducts = async () => {
        try {
            const data = await fs.readFile(this.path, "utf-8")
            const dataParse = JSON.parse(data)
            const producto = dataParse

            return producto
        } catch (error) {
            console.log("Error al leer productos.json")
        }
    }

    addProducts = async (nuevoProducto) => {
        try {
            const productos = await this.getProducts()

            const ultimoProductoId = productos.length > 0 ? productos[productos.length - 1].id : 0
            const incrementoId = ultimoProductoId + 1
            nuevoProducto.id = incrementoId
            const productoDefinitivo = { ...nuevoProducto, status: true }
            productos.push(productoDefinitivo)

            await fs.writeFile(this.path, JSON.stringify(productos))
            return productos
        } catch (error) {
            console.log("Error", error)
        }
    }

    updateProduct = async (pid, productoActualizado) => {
        try {
            const productos = await this.getProducts()
            const productoPorId = productos.findIndex(prod => prod.id === pid)
            productoActualizado.id = productos[productoPorId].id
            productos[productoPorId] = productoActualizado

            await fs.writeFile(this.path, JSON.stringify(productos))
        } catch (error) {
            console.log("Error al modificar producto.")
        }
    }

    deleteProduct = async (pid) => {
        try {
            const productos = await this.getProducts()
            const eliminarProducto = productos.findIndex(prod => prod.id === pid)

            if (eliminarProducto === -1) {
                console.log("error")
            } else {
                productos.splice(eliminarProducto, 1)
                await fs.writeFile(this.path, JSON.stringify(productos))
                return productos
            }
        } catch (error) {
            console.log("Error al borrar producto.")
        }
    }

    getProductById = async (pid) => {
        const productos = await this.getProducts()
        return productos.find((prod) => prod.id === pid)
    }

}

export default ProductManager
