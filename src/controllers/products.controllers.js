import {
    productsModelPaginate,
    getAllProducts,
    addProducts,
    deleteProductById,
    updateProduct,
    getProductsManager,
    addProductsByIdManager,
    updateProductMaanger,
    getProductByIdManagerTwo,
    deleteProductManager
} from "../services/products.services.js"

// export const apiProductsDB = async (req, res) => {
//     const limit = parseInt(req.query.limit) || 7 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
//     const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
//     const sort = req.query.sort // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
//     const category = req.query.category // Sirve para filtrar los productos segun su categoria (estas son case sensitive)
//     const title = req.query.title // Sirve para filtrar los productos segun su titulo (estas son case sensitive)

//     const existeCategory = category ? { category } : null
//     const existeTitle = title ? { title } : null

//     const productos = await productsModelPaginate(existeCategory, existeTitle, limit, page, sort)

//     res.send(productos)
//     console.log(productos);
// }
export const apiProductsDB = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
        const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
        const sort = req.query.sort // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
        const category = req.query.category // Sirve para filtrar los productos segun su categoria (estas son case sensitive)
        const title = req.query.title // Sirve para filtrar los productos segun su titulo (estas son case sensitive)
    
        const existeCategory = category ? { category } : null
        const existeTitle = title ? { title } : null
    
        const productos = await productsModelPaginate(existeCategory, existeTitle, limit, page, sort)
    
        res.send({ status: "success", payload: productos })
        req.logger.info("Productos obtenidos exitosamente de la Base de Datos.")
    } catch (error) {
        req.logger.fatal("Error al obtener los productos de la Base de Datos")
        res.status(500).send("Error al obtener los productos de la Base de Datos")
    }
}

export const apiProductsDBDinamico = async (req, res) => {
    try {
        let pid = req.params.pid;
        let producto = await getAllProducts();
        let productoBuscado = producto.find((prod) => prod._id.toString() === pid);

        if (productoBuscado) {
            res.send({ status: "success", payload: productoBuscado });
            req.logger.info(`Solicitud GET a /api/productsdb/:pid exitosa. Producto buscado: ${productoBuscado.title}`)
        } else {
            res.send({ message: "Producto no encontrado" })
            req.logger.fatal(`Producto con _id: ${pid} no encontrado.`)
        }

    } catch (error) {
        res.status(400).send({ status: "Error", message: "Error al obtener el producto seleccionado." });
    }
}
//------------------------------------------------------------------------------------------------------------------
export const apiProductsDBPost = async (req, res) => {
    try {
        let content = req.body
        if (!content.owner) {
            content.owner = "premium";
        }
        const results = await addProducts(content)
        res.status(200).send({ message: "El producto se agregó exitosamente a la Base de Datos", payload: results })
        req.logger.info("Exito al agregar producto.")
    } catch (error) {
        res.status(400).send({ status: "error", error })
        req.logger.fatal("Error al agregar producto.")
    }
}
//------------------------------------------------------------------------------------------------------------------

export const apiProductsDBDinamicoDelete = async (req, res) => {
    try {
        let { pid } = req.params
        let result = await deleteProductById(pid)
        if (result) {
            res.status(400).send({ message: "Producto no encontrado en la Base de Datos" })
            req.logger.fatal(`Error al eliminar el producto con _id: ${pid}`)
        } else {
            res.status(200).send({ message: "Exito al eliminar el producto de la Base de Datos.", payload: result })
            req.logger.info(`Exito al eliminar el producto de la Base de Datos segun su _id: ${pid}`)
        }
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al eliminar el producto de la Base de Datos segun su _id." })
    }
}

export const apiProductsDBDinamicoPut = async (req, res) => {
    try {
        const { pid } = req.params
        const productoAModificar = req.body
        const result = updateProduct(pid, productoAModificar)

        res.send({ status: "success", payload: result })
        req.logger.info(`Exito al modificar el producto con _id: ${pid}`)
    } catch (error) {
        res.status(400).send({ status: "error", message: "Producto no encontrado." })
        req.logger.fatal(`Error al modificar el producto con _id: ${pid}`)
    }
}

export const apiProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const productos = await getProductsManager()

        if (!isNaN(limit)) {
            const limiteDeProductos = productos.slice(0, limit)
            res.send(limiteDeProductos)
        } else {
            res.send(productos)
            req.logger.info(`Peticion GET para /api/productos exitosa.`)
        }
    } catch (error) {
        req.logger.fatal("Error al leer productos.json")
        res.status(500).send({ status: "error", message: "Error al leer productos.json" })
    }
}

export const apiProductosDinamico = async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productos = await getProductsManager()
        const productorPorId = productos.find(prod => prod.id === pid)

        if (!productorPorId) {
            req.logger.fatal(`Producto con _id: ${pid} no encontrado.`)
            res.send(productos)
        } else {
            res.send(productorPorId)
            req.logger.info(`Producto con _id: ${pid} encontrado. ${productorPorId.title}.`)
        }
    } catch (error) {
        req.logger.fatal("Error al encontrar encontrar producto buscado por Id.")
        res.status(500).send({ status: "error", message: "No se encontro el producto del Id indicado." })
    }
}

export const apiProductosPost = async (req, res) => {
    try {
        const nuevoProducto = req.body

        if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.code || !nuevoProducto.price || !nuevoProducto.stock || !nuevoProducto.category) {
            req.logger.fatal("Todos los campos son obligatorios")
            return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        }

        const productos = await addProductsByIdManager(nuevoProducto)
        res.status(201).send({ status: "success", message: "Exito al agregar nuevo producto." })
        req.logger.info(`Exito al agregar nuevo producto: ${productos.title}`)
    } catch (error) {
        req.logger.fatal(`Error al leer o escribir en productos.json`)
        res.status(400).send({ status: "error", message: "Error al leer o escribir en productos.json" });
    }
}

export const apiProductosPut = async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoActualizado = req.body
        await updateProductMaanger(pid, productoActualizado)
        const productoExistente = await getProductByIdManagerTwo(pid)

        if (!productoExistente) {
            res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
            req.logger.fatal(`No se encontro ningun producto con _id: ${pid}`)
        } else {
            res.status(201).send({ status: "success", message: `Exito al modificar el producto con id ${pid}` })
            req.logger.info(`Exito al modificar producto con _id: ${pid}.`)
        }
    } catch (error) {
        req.logger.fatal("Error al modificar el producto elegido productos.json", error);
        res.status(404).send({ status: "error", message: "Error al intentar modificar producto en productos.json" });
    }
}

export const apiProductosDinamicoDelete = async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoExistente = await getProductByIdManagerTwo(pid)

        if (!productoExistente) {
            res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
            req.logger.fatal(`No se encontró ningún producto con el id ${pid}`)
        } else {
            await deleteProductManager(pid)
            res.status(201).send({ status: "success", message: `Exito al eliminar producto con id ${pid}` })
            req.logger.info(`Exito al eliminar producto con _id ${pid}`)
        }

    } catch (error) {
        req.logger.fatal(`Error al eliminar producto en productos.json`)
        res.status(404).send({ status: "error", message: "Error al eliminar producto en productos.json." })
    }
}