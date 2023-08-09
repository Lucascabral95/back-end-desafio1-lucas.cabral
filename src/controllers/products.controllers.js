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

export const apiProductsDB = async (req, res) => {
    const limit = parseInt(req.query.limit) || 7 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
    const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
    const sort = req.query.sort // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
    const category = req.query.category // Sirve para filtrar los productos segun su categoria (estas son case sensitive)
    const title = req.query.title // Sirve para filtrar los productos segun su titulo (estas son case sensitive)

    const existeCategory = category ? { category } : null
    const existeTitle = title ? { title } : null

    const productos = await productsModelPaginate(existeCategory, existeTitle, limit, page, sort)

    res.send(productos)
    console.log(productos);
}

export const apiProductsDBDinamico = async (req, res) => {
    try {
        let pid = req.params.pid;
        let producto = await getAllProducts();
        let productoBuscado = producto.find((prod) => prod._id.toString() === pid);

        if (productoBuscado) {
            res.send({ status: "success", payload: productoBuscado });
        } else {
            res.send({ message: "Producto no encontrado" })
        }

    } catch (error) {
        res.status(400).send({ status: "Error", message: "Error al obtener el producto seleccionado." });
    }
}

export const apiProductsDBPost = async (req, res) => {
    try {
        let content = req.body
        const results = await addProducts(content)
        res.send({ status: "success", payload: results })
    } catch (error) {
        res.status(400).send({ status: "error", error })
    }
}

export const apiProductsDBDinamicoDelete = async (req, res) => {
    let { pid } = req.params
    try {
        let result = await deleteProductById(pid)
        if (result) {
            res.send({ status: "success", payload: result })
        } else {
            res.send({ status: "success", message: "Se elimino el producto." })
        }
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al intentar eliminar el producto." })
    }
}

export const apiProductsDBDinamicoPut = async (req, res) => {
    try {
        const { pid } = req.params
        const productoAModificar = req.body
        const result = updateProduct(pid, productoAModificar)

        res.send({ status: "success", payload: result })
    } catch (error) {
        res.status(400).send({ status: "error", message: "Producto no encontrado." })
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
        }
    } catch (error) {
        console.log("Error al leer productos.json", error)
        res.status(500).send({ status: "error", message: "Error al leer productos.json" })
    }
}

export const apiProductosDinamico = async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productos = await getProductsManager()
        const productorPorId = productos.find(prod => prod.id === pid)

        if (!productorPorId) {
            console.log(`Producto con ${pid} no encontrado.`)
            res.send(productos)
        } else {
            res.send(productorPorId)
        }

    } catch (error) {
        console.log("Error al encontrar encontrar producto buscado por Id.")
        res.status(500).send({ status: "error", message: "No se encontro el producto del Id indicado." })
    }
}

export const apiProductosPost = async (req, res) => {
    try {
        const nuevoProducto = req.body
        
        if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.code || !nuevoProducto.price || !nuevoProducto.stock || !nuevoProducto.category) {
            return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        }
        
        const productos = await addProductsByIdManager(nuevoProducto)
        res.status(201).send({ status: "success", message: "Exito al agregar nuevo producto." })
    } catch (error) {
        console.log("Error al leer o escribir en productos.json");
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
        } else {
            res.status(201).send({ status: "success", message: `Exito al modificar el producto con id ${pid}` })
        }
        
    } catch (error) {
        console.log("Error al modificar el producto elegido productos.json", error);
        res.status(404).send({ status: "error", message: "Error al intentar modificar producto en productos.json" });
    }
}

export const apiProductosDinamicoDelete = async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoExistente = await getProductByIdManagerTwo(pid)

        if (!productoExistente) {
            res.status(404).send({ status: "error", message: `No se encontró ningún producto con el id ${pid}` });
        } else {
            await deleteProductManager(pid)
            res.status(201).send({ status: "success", message: `Exito al eliminar producto con id ${pid}` })
        }

    } catch (error) {
        console.log("Error al eliminar producto en productos.json", error)
        res.status(404).send({ status: "error", message: "Error al eliminar producto en productos.json." })
    }
}