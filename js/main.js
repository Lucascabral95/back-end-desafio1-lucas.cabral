class ProductManager {
    constructor() {
        this.productos = []
        this.idContador = 1
    }

    addProducto({ title, description, price, thumbnail, code, stock }) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("ERROR: ¡Todos los campos son obligatorios!")
            return
        }

        const productoSinRepetir = this.productos.find((product) => product.code === code)

        if (productoSinRepetir) {
            console.log("ERROR: ¡El codigo ya existe!")
            return
        }

        const nuevoProducto = {
            id: this.idContador,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        this.productos.push(nuevoProducto)
        this.idContador++

        console.log("Producto agregado existosamente")
    }

    getProductos() {
        return this.productos

    }


    getProductById(id) {
        const productt = this.productos.find((product) => product.id === id)
        if (!productt) {
            console.log("NOT FOUND. Id no encontrado")
        } 
        return productt
    }

}

const productManager1 = new ProductManager()

productManager1.addProducto({
    title: "Peluche Pikachu",
    description: "Edicion-Limitada",
    price: 3500,
    thumbnail: "../img/pikachu-peluche.png",
    code: "PK001",
    stock: 50
})

productManager1.addProducto({
    title: "Peluche Mew",
    description: "Edicion-Ultra-Rara",
    price: 11500,
    thumbnail: "../img/mew-peluche.png",
    code: "PK002",
    stock: 15
})

const verTodosLosProductos1 = productManager1.getProductos()
console.log(verTodosLosProductos1)

productManager1.addProducto({
    title: "Peluche Ponyta",
    description: "Edicion-Mega-Rara",
    price: 7500,
    thumbnail: "../img/ponyta-peluche.png",
    code: "PK003",
    stock: 15
})

const verTodosLosProductos2 = productManager1.getProductos()
console.log(verTodosLosProductos2)

const encontrarProducto = productManager1.getProductById(3)
console.log(encontrarProducto)

const noExisteProducto = productManager1.getProductById(4)
console.log(noExisteProducto)
