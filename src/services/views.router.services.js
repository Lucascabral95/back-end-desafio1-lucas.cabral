// CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA
// CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA
// CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA // CAPA DE PERSISTENCIA

import ProductManager from "../ProductManager.js";
import MessagesManager from "../DAO/MessagesDAO.js"
import ProductModel from "../DAO/models/products.model.js"
import { userModel } from "../DAO/models/user.js";
import ProductsManager2 from "../DAO/productsDAO.js"
import CartService from "../DAO/models/carts.model.js"
import { generatorProducts } from "../mocks/products.js";

import CartsManager from "../DAO/CartsDAO.js";
const cartDao = new CartsManager()

const productsService = new ProductManager()
const messageService = new MessagesManager()
const productDao = new ProductsManager2()

// OBTENER POPULATE CART
export const populateCart = async (cid) => {
    const cart = await CartService.findById(cid).populate("products.product");
    return cart
}


// OBTENER CART DE COMPRA DE USUARIOS
export const getCartUser = async (pid, quantity) => {
    const cart = await cartDao.subtractStock(pid, quantity)
    return cart
}

// OBTENER FUNCIONES DE PRODUCTOS PARA 
export const getProductsHome = async () => {
    const productosHome = await productsService.getProducts()
    return productosHome
}

// LOGICA "POST" PARA AGREGAR PRODUCTOS A /REALTIMEPRODUCTS
export const addProducts = async (nuevoProducto) => {
    const nuevoPro = await productsService.addProducts(nuevoProducto)
    return nuevoPro
}

// LOGICA "POST" PARA AGREGAR PRODUCTOS A /HOME-MONGODB
export const add = async (newProduct) => {
    const add = await productDao.addProducts(newProduct)
    return add
}

// LOGICA "DELETE" DINAMICA PARA ELIMINAR PRODUCTOS DE /HOME-MONGODB
export const deleteProductById = async (pid) => {
    const deleteMongoDB = await productDao.deleteProductById(pid)
    return deleteMongoDB
}

// LOGICA "PUT" DINAMICA PARA MODIFICAR STOCK DE PRODUCTOS EN /CARTS/:PID/:STOCK
export const updateStock = async (pid, stock) => {
    const updateStock = await productDao.subtractStock(pid, stock)
    return updateStock
}

// OBTENER CHAT CONECTADO A MONGO-DB ATLAS PARA /CHAT
export const getChatFromMongoAtlas = async () => {
    const mensajes = await messageService.getMessages()
    return mensajes
}

// OBTENER PAGINATE PARA /HOME-MONGODB
export const getPaginateHomeMongoDB = async (category, limit, page, sort) => {
    let productos = await ProductModel.paginate(category ? { category } : null, { limit, page, sort })
    return productos
}

// OBTENER FUNCIONES PARA EL REGISTRO DE USUARIOS
export const getAll = async () => {
    let result
    try {
        result = await userModel.find()
    } catch (error) {
        console.log(error);
    }
    return result
}

export const getByEmail = async (email) => {
    let result
    try {
        result = await userModel.findOne({ email })
        return result
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createUser = async (user) => {
    let result
    try {
        result = await userModel.create(user)
    } catch (error) {
        console.log(error);
    }
    return result
}

// OBTENER CARTS/POPULATE DE CART MODEL PARA /CARTS/:CID
export const cartsModelFindService = async () => {
    try {
        const results = CartService.find()
        return results;
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;
    }
};

export const cartsModelFindByIdService = async (cid) => {
    try {
        const result2 = CartService.findById(cid).populate("products.product")
        return result2
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;
    }
};


export const serviceFaker = async (num) => {
    const products = generatorProducts(num)
    return products
}