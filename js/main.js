const fs = require("fs")

class ProductManager {
    constructor() {
        this.path = "productos.json"
        this.producto = []
        this.idContador = 1
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("ERROR: Todos los campos son obligatorios.")
        }

        const nuevoProducto = {
            id: this.idContador,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.producto.push(nuevoProducto)
        this.idContador++
        console.log("¡Producto agregado exitosamente!")

        fs.writeFile(this.path, JSON.stringify(this.producto), (error, data) => {
            if (!error) {
                console.log(data)
            } else {
                console.log(`Error: ${error}`)
            }
        })
    }


    getProduct() {
        console.log("Hasta el momento usted tiene estos productos")
        return fs.readFile(this.path, "utf-8", (error) => {
            if (!error) {
                console.log(this.producto)
            } else {
                console.log("Error. No se pudo leer.")

            }
        })
    }
      

    getProductById(id) {
        const productoRepetido = this.producto.find(producto => producto.id === id)
        if (!productoRepetido) {
            console.log("No se encontro ningun id.")
        } else {
            console.log(productoRepetido)
        }
    }

    updateProduct(id, actualizarProduct) {
        const actualizarProducto = this.producto.findIndex(producto => producto.id === id)
        if (actualizarProducto !== -1) {
            this.producto[actualizarProducto] = {
                ...this.producto[actualizarProducto],
                ...actualizarProduct
            }
            fs.writeFile(this.path, JSON.stringify(this.producto), (error)=>{
                if(error){
                    console.log("Error")
                }
            })
        } else {
            console.log("No se ha podido modificar el producto.")
        }
    }


    deleteProduct(id) {
        const eliminarProduct = this.producto.findIndex(producto => producto.id === id);
        if (eliminarProduct !== -1) {
            this.producto.splice(eliminarProduct, 1);
            console.log("Producto eliminado exitosamente!");

            fs.writeFile(this.path, JSON.stringify(this.producto), (error, data) => {
                if (!error) {
                    console.log(data)
                } else {
                    console.log(`Error: ${error}`)
                }
            })
        } else {
            console.log("No se elimino el producto con el id indicado.");
        }
    }
    
}

const productManager1 = new ProductManager()

productManager1.addProduct({
    title: "Nintendo Switch",
    description: "Consola de videojuegos",
    price: 215000,
    thumbnail: "../img/nintendo.png",
    code: "A001",
    stock: 13
})

productManager1.addProduct({
    title: "PlayStation 5",
    description: "Consola de videojuegos",
    price: 400000,
    thumbnail: "../img/ps4.png",
    code: "A002",
    stock: 3
})
productManager1.addProduct({
    title: "Xbox",
    description: "Consola de videojuegos",
    price: 150000,
    thumbnail: "../img/xbox.png",
    code: "A003",
    stock: 3
})
productManager1.addProduct({
    title: "Pelota",
    description: "Pelota de futbol",
    price: 50000,
    thumbnail: "../img/pelota.png",
    code: "A004",
    stock: 50
})

// productManager1.getProduct()
productManager1.addProduct({
    title: "Mario",
    description: "Figura de accion de Mario",
    price: 15000,
    thumbnail: "../img/mario.png",
    code: "A005",
    stock: 150
})
// productManager1.getProduct()
productManager1.deleteProduct(1)
productManager1.addProduct({
    title: "Kirby",
    description: "Figura de accion de Kirby",
    price: 45000,
    thumbnail: "../img/kirby.png",
    code: "A006",
    stock: 26
})
productManager1.updateProduct(6, {
    title: "No Kirby",
    description: "No Kirby",
    price: 15000,
    thumbnail: "../img/NoKirby.png",
    code: "A007",
    stock: 150
})
productManager1.getProduct()
productManager1.deleteProduct(2)
productManager1.getProduct()