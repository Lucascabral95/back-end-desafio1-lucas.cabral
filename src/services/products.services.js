import ProductsModel from "../DAO/models/products.model.js"
import ProductsManagerServices from "../DAO/productsDAO.js"
import ProductManager from "../ProductManager.js"

const productsServices = new ProductsManagerServices()
const productManagerServices = new ProductManager()

export const productsModelPaginate = async (existeCategory, existeTitle, limit, page, sort) => {
    try {
        const populate = await ProductsModel.paginate(
            { ...existeCategory, ...existeTitle },
            { limit, page, sort }
        );
        return populate;
    } catch (error) {
        console.log("Error al llamar al Populate.", error);
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const products = await productsServices.getAllProducts()
        return products
    } catch (error) {
        console.log("Error al obtener los porductos.");
    }
}

export const addProducts = async (content) => {
    try {
        const product = await productsServices.addProducts(content)
        return product
    } catch (error) {
        console.log("Error al agregar el producto.");
    }
}

// LOGICA "DELETE" DINAMICA PARA ELIMINAR PRODUCTOS DE /HOME-MONGODB
export const deleteProductById = async (pid) => {
    try {
        const product = await productsServices.deleteProductById(pid)
        return product
    } catch (error) {
        console.log("Error al eliminar el producto por su ID.");
    }
}

export const updateProduct = async (pid, productoAModificar) => {
    try {
        const product = await productsServices.updateProduct(pid, productoAModificar)
        return product
    } catch (error) {
        console.log("Error al modificar el producto.");
    }
}

export const getProductsManager = async () => {
    try {
        const products = await productManagerServices.getProducts()
        return products
    } catch (error) {
        console.log("Error al obtener los productos.");
    }
}

export const addProductsByIdManager = async (nuevoProducto) => {
    try {
        const product = await productManagerServices.addProducts(nuevoProducto)
        return product
    } catch (error) {
        console.log("Error al obtener todos los productos.");
    }
} 

export const getProductByIdManager = async (pid, productoActualizado) => {
    try {
        const productoModificado = await productManagerServices.getProductById(pid, productoActualizado)
        return productoModificado
    } catch (error) {
        console.log("Error al modificar el producto seleccionado.");
    }
}

export const updateProductMaanger = async (pid, productoActualizado) => {
    try {
        const productoModificado = await productManagerServices.updateProduct(pid, productoActualizado)
        return productoModificado
    } catch (error) {
        console.log("Error al modificar el producto seleccionado.");
    }
}

export const getProductByIdManagerTwo = async (pid) => {
    try {
        const getProduct = await productManagerServices.getProductById(pid)
        return getProduct
    } catch (error) {
        console.log("Error al obtener los productos.");
    }
}

export const deleteProductManager = async (pid) => {
    try {
        const deleteProduct = await productManagerServices.deleteProduct(pid)
        return deleteProduct
    } catch (error) {
        console.log("Error al eliminar el producto.");
    }
}

export const getProductsHome = async () => {
    const productosHome = await productManagerServices.getProducts()
    return productosHome
}

export const addProductsSockets = async (nuevoProducto) => {
    const nuevoPro = await productManagerServices.addProducts(nuevoProducto)
    return nuevoPro
}

// LOGICA "POST" PARA AGREGAR PRODUCTOS A /HOME-MONGODB
export const add = async (newProduct) => {
    const add = await productsServices.addProducts(newProduct)
    return add
}
