import { promises as fs } from "fs"

class ProductManager {
    constructor() {
        this.path = "productos.txt"
        this.products = []
    }

    static id = 0

// AGREGAR PRODUCTOS
    addProduct = async (title, description, price, imagen, code, stock) => {

        ProductManager.id++

        let nuevoProducto = {
            id: ProductManager.id,
            title,
            description,
            price,
            imagen,
            code,
            stock
        }

        this.products.push(nuevoProducto)

        await fs.writeFile(this.path, JSON.stringify(this.products))
    }


// LEER ARCHIVO TXT CON LOS PRODUCTOS
    readProducts = async () => {
        let respuesta = await fs.readFile(this.path, "utf-8")
        return JSON.parse(respuesta)
    }


// OBTENER LOS PRODUCTO EN CONSOLA
    getProducts = async () => {
        let respuesta2 = await this.readProducts()
        return console.log(respuesta2)
    }

// OBTENER LOS PRODUCTOS SEGUN SU ID
    getProductsById = async (id) => {
        let respuesta3 = await this.readProducts()
        if (!respuesta3.find(product => product.id === id)) {
            console.log("Producto no encontado.")
        } else {
            console.log(respuesta3.find(product => product.id === id))
        }
    }

// ELIMINAR PRODUCTOR SEGUN SU ID
    deleteProductById = async (id) => {
        let respuesta3 = await this.readProducts()
        let productFilter = respuesta3.filter(products => products.id !== id)
        await fs.writeFile(this.path, JSON.stringify(productFilter))
        console.log("Producto eliminado.")
    }

// ACTUALIZAR PRODUCTOS
    updateProduct = async ({ id, ...productoCambiado }) => {
        await this.deleteProductById(id)
        let productOld = await this.readProducts()
        let productosModificados = [ ...productOld, { id, ...productoCambiado } ]
        await fs.writeFile(this.path, JSON.stringify(productosModificados))
        console.log(productosModificados)
    }

}


const producto1 = new ProductManager

// PRODUCTOS YA AGREGADOS (EN EL ARCHIVO TXT)
// producto1.addProduct("Kirby", "Figura de accion", 15000, "../img/kirby.png", "A001", 5);
// producto1.addProduct("Mario", "Figura de accion", 30000, "../img/mario.png", "A002", 10);
// producto1.addProduct("Sonic", "Figura de accion", 30000, "../img/sonic.png", "A003", 15);
// producto1.addProduct("Zelda", "Figura de accion", 30000, "../img/zelda.png", "A004", 20);

// MOSTRAR PRODUCTOS EN CONSOLA
producto1.getProducts()

// OBTENER PRODUCTOS SEGUN SU ID
producto1.getProductsById(2)

// ELIMINAR PRODUCTOS SEGUN SU ID
producto1.deleteProductById(1)

// ACTUALIZAR PRODUCTOS
producto1.updateProduct({
    id: 1,
    title: 'Kirby/Copia',
    description: 'Figura de accion',
    price: 500,
    imagen: '../img/Kirby-copia.png',
    code: 'A003',
    stock: 500
})