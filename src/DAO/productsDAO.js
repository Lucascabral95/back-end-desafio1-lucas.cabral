import productsModel from "./models/products.model.js";

class ProductsManager {
    constructor() {
        this.model = productsModel
    }

    getAllProducts = async (req) => {
        try {
            let productos = this.model.find()
            console.log("Exito al buscar productos.");
            return productos
        } catch (error) {
            console.log("Error al buscar productos.");
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
                return null
            }
            let result = await this.model.updateOne({ _id: pid }, productoAModificar)
            console.log(result);
        } catch (error) {
            console.log(Error);
        }
    }

    subtractStock = async (pid, stock) => {
        try {
            let findProduct = await this.model.findById({ _id: pid });

            if (!findProduct) {
                return { status: "error", msg: "No se encontro el producto." };
            }

            if (findProduct.stock < stock) {
                return { status: "error", msg: "Stock Insuficiente." };
            } else {
                findProduct.stock -= stock;
                await findProduct.save();
                return { status: "success", payload: findProduct };
            }
        } catch (error) {
            console.log("Error al intentar restar el stock.", error);
            throw error;
        }
    }
}


export default ProductsManager;