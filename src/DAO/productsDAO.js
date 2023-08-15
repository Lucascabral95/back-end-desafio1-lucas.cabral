import productsModel from "./models/products.model.js";

class ProductsManager {
    constructor() {
        this.model = productsModel
    }

    getAllProducts = async () => {
        try {
            let productos = this.model.find()
            console.log("Exito al buscar producto por id.");
            return productos
        } catch (error) {
            console.log("error al buscar productor por id");
        }
    };

    addProducts = async (datosObligatorios) => {
        let productos
        try {
            const { title, description, code, price, stock, category } = datosObligatorios
            if (title && description && code && price && stock && category) {
                productos = await this.model.create(datosObligatorios)
                console.log("Producto agregado exitosamente.");
            } else {
                console.log("No se pudo agregar el productos.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductById = async (pid) => {
        try {
            let producto = await this.model.deleteOne({ _id: pid })
            if (producto) {
                console.log("Exito al borrar el producto.");
            } else {
                console.log("No se encontro el producto.");
            }
        } catch (error) {
            console.log("Error al eliminar el producto");
        }
    }

    // updateProduct = async (pid, productoAModificar) => {
    //     try {
    //         if (
    //             !productoAModificar.title ||
    //             !productoAModificar.description ||
    //             !productoAModificar.code ||
    //             !productoAModificar.price ||
    //             !productoAModificar.stock ||
    //             !productoAModificar.category
    //         ) {
    //             console.log("Datos incompletos");
    //             return null
    //         }
    //         let result = await this.model.updateOne({ _id: pid }, productoAModificar)
    //         console.log(result);
    //     } catch (error) {
    //         console.log(Error);
    //     }
    // }
    updateProduct = async (pid, productoAModificar) => {
        try {
            if (
                !productoAModificar.title ||
                !productoAModificar.description ||
                !productoAModificar.code ||
                !productoAModificar.price ||
                !productoAModificar.stock ||
                !productoAModificar.category
            ) {
                console.log("Datos incompletos");
                return null;
            }
    
            productoAModificar.stock -= 3; // Subtract 3 from the stock
    
            let result = await this.model.updateOne({ _id: pid }, productoAModificar);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };
    

    subtracStock = async (pid, cantidad) => {
        try {
            const product = await this.model.findById(pid)
            if (product.stock > cantidad) {
                product.stock -= cantidad;
                await product.save()
                console.log("La cantidad de unidades que deseas comprar supera al stock del producto.");
            } else {
                console.log("Exito al descontrar stock del producto.");
            }

            if (!product) {
                console.log("Producto no encontrado.");
            }



        } catch (error) {
            console.log("Error al descontar stock del producto.");
        }
    }
}


export default ProductsManager;