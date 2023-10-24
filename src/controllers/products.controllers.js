import { sendMail } from "../services/nodemailer.js"
import { ProductsFsDTO } from "../DAO/DTOs/productsDTO.js"
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
    deleteProductManager,
    getProductsHome,
    addProductsSockets,
    add,
} from "../services/products.services.js"
import {
    getByEmail,
    getPaginateHomeMongoDB,
} from "../services/views.router.services.js"
import {
    getDocumentById,
} from "../services/documents.services.js"
import {
    generateProductErrorInfo,
} from "../services/errors/info.js"

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

export const homeProducts = async (req, res) => {
    try {
        const productsHome = await getProductsHome()
        const productsDto = productsHome.map(prods => new ProductsFsDTO(
            prods.id,
            prods.title,
            prods.description,
            prods.code,
            prods.price,
            prods.stock,
            prods.category,
            prods.status
        ));

        res.render("home", { data: productsDto })
        req.logger.info("Peticion GET a /home exitosa.")
    } catch (error) {
        res.status(404).send({ status: "error", message: "No se ha podido encontrar la lista de productos." })
        req.logger.fatal("No se ha podido encontrar la lista de productos.")
    }
}

export const realTimeProducts = (req, res) => {
    res.render("realtimeproducts")
    req.logger.info("Peticion GET a /products/fs/socket exitosa.")
}

export const deleteProductsSocket = async (req, res) => {
}

export const addProductsSocket = async (req, res) => {
    try {
        let nuevoProducto = req.body;

        if (
            !nuevoProducto.title ||
            !nuevoProducto.description ||
            !nuevoProducto.code ||
            !nuevoProducto.price ||
            !nuevoProducto.stock ||
            !nuevoProducto.category
        ) {
            res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
        } else {
            const productos = await addProductsSockets(nuevoProducto);
            req.logger.info(`Producto agregado exitosamente.`);
            res.redirect("/products/fs/socket");
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
        });
        req.logger.fatal(`Todos los campos son obligatorios.`);
    }
};

// RUTA GET PARA /HOME-MONGODB QUE MUESTRA TODOS LOS PRODUCTOS Y LOS FILTRA POR CATEGORIAS, PAGINAS, DE MAYOR A MENOR PRECIO, ETC
export const homeMongoDB = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
    const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
    const sort = req.query.sort || "createdAt" // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
    const category = req.query.category // Sirve para filtrar los productos segun su categoria (éstas son case sensitive)
    const productoss = await getPaginateHomeMongoDB(category, limit, page, sort)

    //-----
    // const emailUser = req.session.emailUser // TITULAR
    const emailUser = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    //-----
    const findUser = await getByEmail(emailUser)
    const roleUser = findUser ? findUser.role : null;
    const roleView = roleUser === "premium" ? true : false; //Si el rol user es igual a "premium" sera true, sino sera false.
    const roleOwner = roleUser === "admin" ? "admin" : emailUser

    const productos = productoss.docs
    const buscadorId = productos.map(i => i._id)
    const buscadorTitle = productos.map(title => title.title)
    const buscadorDescription = productos.map(d => d.description)
    const buscadorCode = productos.map(c => c.code)
    const buscadorPrice = productos.map(p => p.price)
    const buscadorStock = productos.map(s => s.stock)
    const buscadorCategory = productos.map(ca => ca.category)
    const buscadorOwner = productos.map(o => o.owner)
    const user = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    const rol = req.session.rol
    const existeRol = req.session.existRol
    const ownerAdmin = roleUser === "admin" ? "admin" : user
    const ultimaConexion = req.session.lastConnection || "No registra"
    const UltimaConexionDefinitiva = `Última conexión: ${ultimaConexion} 🕓`
    const idDocument = req.cookies.idDocument
    const find = await getDocumentById(idDocument)
    const findPhoto = find.documents.filter(i => i.image === "profile")
    let documentReference
    if (findPhoto) {
        documentReference = findPhoto.map(n => n.reference)
    }
    const ultimoValor = documentReference[documentReference.length - 1]
    const length = documentReference.length
    const referenceLength = length === 0 ? false : true
    const canDelete = buscadorOwner === emailUser ? true : false
    const userEmailGithub = req.session.emailUser.email
    const userAgeGithub = req.session.emailUser.age
    const userFirstNameGithub = req.session.emailUser.first_name
    const cartIdUser = req.session?.data?.[3] ?? req.session.emailUser.cart;
    const cartIdUserMap = Array(productos.length).fill(cartIdUser);
    const arrayEmailUser = Array(productos.length).fill(emailUser);
    const mostrarONo = roleUser === "Admin" ? false : true
    const accessAdminn = rol === "Admin" ? true : false
    const findUserrr = findUser?._id
    const showONoAdmin = emailUser !== "adminCoder@coder.com" ? false : true

    const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice,
        buscadorStock, buscadorCategory, user, rol, existeRol, userEmailGithub, userAgeGithub,
        userFirstNameGithub, cartIdUser, cartIdUserMap, mostrarONo, roleUser,
        roleView, roleOwner, buscadorOwner, ownerAdmin, canDelete, arrayEmailUser,
        UltimaConexionDefinitiva, ultimoValor, referenceLength, accessAdminn, findUserrr, showONoAdmin]

    const totalDocss = productoss.totalDocs
    const limitt = productoss.limit
    const totalPages = productoss.totalPages
    const pagee = productoss.page
    const pagingCounter = productoss.pagingCounter
    const hasPrevPage = productoss.hasPrevPage
    const hasNextPage = productoss.hasNextPage
    const prevPage = productoss.prevPage
    const nextPage = productoss.nextPage
    const accesoProductos = roleUser === "premium" || roleUser === "admin" ? true : false;
    const bloqueoProductos = true

    const datosDePaginate = [totalDocss, limitt, totalPages, pagee,
        pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage, accesoProductos, bloqueoProductos]
    req.session.dataSubHeader = findUser ? [findUser._id, cartIdUser, referenceLength, ultimoValor, user, showONoAdmin] : [];

    res.render("products", { productossFull: productossFull, datosExtras: datosDePaginate, sort })
    req.logger.info("Peticion GET a /home-mongoDB exitosa.")
}

// RUTA "POST" QUE AGREGA UN PRODUCTO A LA BASE DE DATOS
export const homeMongodbPost = async (req, res) => {
    try {
        const newProduct = req.body;

        if (
            !newProduct.title ||
            !newProduct.description ||
            !newProduct.code ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.category
        ) {
            const errorInfo = generateProductErrorInfo(newProduct);
            throw CustomError.createError({
                name: "Error al agregar producto.",
                cause: errorInfo,
                message: "Todos los campos son obligatorios.",
                code: EErrors.INCOMPLETE_FIELDS
            });
        }
        const product = await add(newProduct);

        res.setHeader('Refresh', '1');
        res.redirect("/home-mongoDB");
    } catch (error) {
        req.logger.fatal(error);
        res.status(500).send({ status: "error", message: "Error al agregar el producto" });
    }
};

// RUTA "DELETE" QUE ELIMINA UN PRODUCTO SEGUN SU _ID
export const homeMongodbDinamica = async (req, res, pid) => {
    try {
        const pid = req.params.pid;
        const prod = await deleteProductById(pid);

        if (prod) {
            res.send({ status: "Success", message: "Producto eliminado." });
            req.logger.fatal("Producto eliminado.")
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.',
            });
            res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la página para ver los cambios" });
            req.logger.info("Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.")
        }
    } catch (error) {
        res.status(400).send({ status: "Error" });
        req.logger.fatal("Error.")
    }
}

export const deleteUserAndSendEmail = async (req, res) => {
    try {
        const email = req.params.email
        const pid = req.params.pid
        const prod = await deleteProductById(pid)
        const findEmail = await getByEmail(email)
        const emailUserr = findEmail.email

        const option = {
            from: "Proyecto Final de Backend <lucasgamerpolar10@gmail.com>",
            to: emailUserr,
            subject: "Su producto fue eliminado",
            html: `
                   <div>
                     <p>Estimado usuario ${emailUserr}: un producto que usted agrego al ecommerce de Lucas Cabral fue eliminado por el <span style="color: red;"> Admin del website </span>. </p>
    
                     <p>Disculpe las molestias.</p>
                   </div>
                 `,
            attachments: []
        }
        const result = await sendMail(option)
        console.log(`Correo enviado a: ${emailUserr}: ${result}`)

        if (prod) {
            res.send({ status: "Success", message: "Producto eliminado." });
            req.logger.fatal("Producto eliminado.")
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.',
            });
            res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la página para ver los cambios" });
            req.logger.info("Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.")
        }
    } catch (error) {
        res.status(400).send({ status: "Error", message: "Error al eliminar producto" });
        req.logger.fatal("Error al eliminar producto.")
    }
}