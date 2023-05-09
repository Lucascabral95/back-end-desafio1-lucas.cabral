import { promises as fs, readFile } from "fs"

class ProductManager {
    constructor() {
        this.path = "../productos.json"
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

        const productosOrdenados = JSON.stringify(this.products, null, 2)

        // await fs.writeFile(this.path, JSON.stringify(this.products))
        await fs.writeFile(this.path, productosOrdenados)
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


const producto1 = new ProductManager()

// PRODUCTOS YA AGREGADOS (EN EL ARCHIVO TXT)
producto1.addProduct("Kirby", "Figura de accion de Kirby", 7500, "../img/kirby.png", "A001", 5);
producto1.addProduct("Mario", "Figura de accion de Mario", 6000, "../img/mario.png", "A002", 10);
producto1.addProduct("Sonic", "Figura de accion de Sonis", 3000, "../img/sonic.png", "A003", 15);
producto1.addProduct("Link", "Figura de accion de Link", 5500, "../img/link.png", "A005", 20);
producto1.addProduct("Luigi", "Figura de accion de Luigi", 4500, "../img/luigi.png", "A006", 20);
producto1.addProduct("Bowser", "Figura de accion de Bowser", 6100, "../img/bowser.png", "A007", 20);

// MOSTRAR PRODUCTOS EN CONSOLA
// producto1.getProducts()

// OBTENER PRODUCTOS SEGUN SU ID
// producto1.getProductsById(2)

// ELIMINAR PRODUCTOS SEGUN SU ID
// producto1.deleteProductById(1)

// ACTUALIZAR PRODUCTOS
// producto1.updateProduct({
//     id: 1,
//     title: 'Kirby/Copia',
//     description: 'Figura de accion',
//     price: 500,
//     imagen: '../img/Kirby-copia.png',
//     code: 'A003',
//     stock: 500
// })

export default ProductManager