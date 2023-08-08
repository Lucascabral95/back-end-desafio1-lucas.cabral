// ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA  // 
// ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA  //
// ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA  //
import Swal from 'sweetalert2';
import {
    controllerHomeMongodb,
    controllerApiSessionRegister,
    controllerApiSessionLogin,
    controllerRealTimeProductsPost,
    controllerMongoDbPost,
    controllerMongoDbDinamico
} from "../controllers/views.router.controllers.js"

import {
    getProductsHome,
    getChatFromMongoAtlas,
    getPaginateHomeMongoDB,
    cartsModelFindService,
    cartsModelFindByIdService
} from "../services/views.router.services.js"

import cartsModel from '../DAO/models/carts.model.js';


// RUTA "GET" DE /API/SESSION/DENTRO
export const apiSessionDentro = async (req, res) => {
    let user = req.session.emailUser
    let rol = req.session.rol
    let existeRol = req.session.existRol

    let userNameGithub = req.session.emailUser.first_name
    let userEmailGithub = req.session.emailUser.email
    let userAgeGithub = req.session.emailUser.age
    const userData = [user, rol, userNameGithub, userEmailGithub, userAgeGithub, existeRol]

    res.render("pageGithub", { user: userData })
}

// RUTA "GET" DE /API/SESSION/REGISTER
export const apiSessionRegister = async (req, res) => {
    res.render("register", {})
}

// RUTA "POST" DE /API/SESSION/REGISTER
export const apiSessionRegisterPost = async (req, res) => {
    let user = req.body;

    try {
        const resultado = await controllerApiSessionRegister(user);
        console.log(resultado);
        res.cookie("dataUser", resultado).render("login", {});
    } catch (error) {
        console.error("Error al registrar el usuario y el carrito:", error);
        res.render("register-error", {});
    }
};

// RUTA "GET" DE /API/SESSION/LOGIN
export const apiSessionLogin = async (req, res) => {
    res.render("login", {})
}

// RUTA "POST" DE /API/SESSION/LOGIN
export const apiSessionLoginPost = async (req, res) => {
    let user = req.body
    try {
        await controllerApiSessionLogin(req, res, user)
        console.log(`estilo al iniciar sesion.`);
    } catch (error) {
        console.log("error al iniciar sesion");
    }
}

// RUTA "GET" DE /API/SESSION/CURRENT
export const apiSessionCurrent = async (req, res) => {
    try {
        const datos = controllerHomeMongodb(req, res);
        res.render("current", { datos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos de usuario.' });
    }
};

// RUTA "GET" DE /API/SESSION/LOGO
export const apiSessionLogout = (req, res) => {
    req.session.destroy(error => {
        res.render("login")
    })
}

//----------------------------------------------------------------------------------------------------

// RUTA RAIZ "GET" DE /
export const rutaRaiz = (req, res) => {
    res.render("index");
}

// RUTA "GET" DE /REALTIMEPRODUCTS
export const realTimeProducts = (req, res) => {
    res.render("realtimeproducts")
}

// RUTA "POST" PARA AGREGAR PRODUCTOS EN /REALTIMEPRODUCTS
export const realTimeProductsPost = async (req, res) => {
    try {
        let nuevoProducto = req.body
        await controllerRealTimeProductsPost(req, res, nuevoProducto)
        res.redirect("/realtimeproducts");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
        });
    }
}

// RUTA "GET" DE /HOME
export const homeProducts = async (req, res) => {
    try {
        const productsHome = await getProductsHome()
        res.render("home", { data: productsHome })
    } catch (error) {
        res.status(404).send({ status: "error", message: "No se ha podido encontrar la lista de productos." })
    }
}

// RUTA "GET" DE /HOME-MONGODB
export const homeMongoDB = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
    const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
    const sort = req.query.sort || "createdAt" // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
    const category = req.query.category // Sirve para filtrar los productos segun su categoria (éstas son case sensitive)

    const productoss = await getPaginateHomeMongoDB(category, limit, page, sort)

    const productos = productoss.docs

    const buscadorId = productos.map(i => i._id)
    const buscadorTitle = productos.map(title => title.title)
    const buscadorDescription = productos.map(d => d.description)
    const buscadorCode = productos.map(c => c.code)
    const buscadorPrice = productos.map(p => p.price)
    const buscadorStock = productos.map(s => s.stock)
    const buscadorCategory = productos.map(ca => ca.category)
    const user = req.session.emailUser
    const rol = req.session.rol
    const existeRol = req.session.existRol
    //------
    const userEmailGithub = req.session.emailUser.email
    const userAgeGithub = req.session.emailUser.age
    const userFirstNameGithub = req.session.emailUser.first_name
    //------

    const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice,
        buscadorStock, buscadorCategory, user, rol, existeRol, userEmailGithub, userAgeGithub, userFirstNameGithub]

    const totalDocss = productoss.totalDocs
    const limitt = productoss.limit
    const totalPages = productoss.totalPages
    const pagee = productoss.page
    const pagingCounter = productoss.pagingCounter
    const hasPrevPage = productoss.hasPrevPage
    const hasNextPage = productoss.hasNextPage
    const prevPage = productoss.prevPage
    const nextPage = productoss.nextPage

    const datosDePaginate = [totalDocss, limitt, totalPages, pagee, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage]

    res.render("products", { productossFull: productossFull, datosExtras: datosDePaginate, sort })
}
// RUTA "POST" DE /HOME-MONGODB
export const homeMongodbPost = async (req, res) => {
    try {
        let newProduct = req.body;
        await controllerMongoDbPost(req, res, newProduct);
        res.redirect("/home-mongoDB");
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", message: "Error al agregar el producto" });
    }
};

// RUTA "GET" DINAMICA DE /HOME-MONGODB
export const homeMongodbDinamica = async (req, res, pid) => {
    try {
        const pid = req.params.pid;
        const prod = await controllerMongoDbDinamico(pid);

        if (prod) {
            res.send({ status: "Success", message: "Producto eliminado." });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.',
            });
            res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la página para ver los cambios" });
        }
    } catch (error) {
        res.status(400).send({ status: "Error" });
    }
}

// RUTA "GET" DE /CHAT
export const getChat = async (req, res) => {
    let mensajes = await getChatFromMongoAtlas()
    let messageMongo = mensajes.map(mensaje => mensaje.message)
    let horaMongo = mensajes.map(men => men.hour)
    let userMongo = mensajes.map(men => men.user)
    let user = req.session.emailUser

    const combineData = [horaMongo, messageMongo, userMongo, user]

    res.render("chat.handlebars", { combineData })
}

// RUTA "GET" PARA /CARTS/:CID
export const cartsParams = async (req, res) => {
    try {
        const cartAll = await cartsModelFindService();
        const cid = req.params.cid;
        const cart = await cartsModelFindByIdService(cid)

        const cartId = cart._id;
        const productId = cart.products.map((prod) => prod.product._id);
        const title = cart.products.map((prod) => prod.product.title);
        const price = cart.products.map((prod) => prod.product.price);
        const quantity = cart.products.map((prod) => prod.quantity);
        const totalPrice = price.map((p, index) => parseFloat(p) * parseFloat(quantity[index]));
        const totalPriceFull = totalPrice.reduce((accumulator, current) => accumulator + current, 0);
        const totalPriceFullWithComa = totalPriceFull.toLocaleString();
        const cartIdAll = cartAll.map((i) => i._id);

        const datos = [
            cart,
            productId,
            title,
            quantity,
            price,
            totalPrice,
            totalPriceFullWithComa,
            cartId,
            cartIdAll,
        ];

        res.render("cartId", { datos });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: `Error al obtener carritos. Por favor, para buscar uno vaya a /api/cartsDB`,
        });
    }
};
