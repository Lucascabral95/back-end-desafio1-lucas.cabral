// ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA // ESTA ES LA CAPA DE VISTA  // 
import Swal from 'sweetalert2';
import {
    // controllerRealTimeProductsPost,
    // controllerMongoDbPost,
    // controllerMongoDbDinamico,
    controllerApiSessionRegister,
    controllerApiSessionLogin, 
} from "../controllers/views.router.controllers.js"

import {
    // getProductsHome,
    // getPaginateHomeMongoDB,
    // getChatFromMongoAtlas,
    cartsModelFindService,
    cartsModelFindByIdService,
    getByEmail,
} from "../services/views.router.services.js"

import {
    getDocumentById
} from '../services/documents.services.js';

// RUTA "GET" DE /API/SESSION/DENTRO
// export const apiSessionDentro = async (req, res) => {
//     let user = req.session.emailUser
//     let rol = req.session.rol
//     let existeRol = req.session.existRol

//     let userNameGithub = req.session.emailUser.first_name
//     let userEmailGithub = req.session.emailUser.email
//     let userAgeGithub = req.session.emailUser.age
//     const userData = [user, rol, userNameGithub, userEmailGithub, userAgeGithub, existeRol]

//     res.render("pageGithub", { user: userData })
//     req.logger.info("Exito al ingresar a /api/session/dentro")
// }

// // RUTA "GET" DE /API/SESSION/REGISTER
// export const apiSessionRegister = async (req, res) => {
//     res.render("register", {})
//     req.logger.info("Peticion GET a /api/session/register exitosa.")
// }

// RUTA "POST" DE /API/SESSION/REGISTER
// export const apiSessionRegisterPost = async (req, res) => {
//     let user = req.body;

//     try {
//         const resultado = await controllerApiSessionRegister(user);
//         req.logger.info(resultado)
//         req.logger.info(`Nuevo usuario registrado con email: ${resultado.email}`)
//         res.cookie("dataUser", resultado).render("login", {});
//     } catch (error) {
//         req.logger.fatal("Error al registrar el usuario y el carrito:", error)
//         res.render("register-error", {});
//     }
// };


// RUTA "POST" DE /API/SESSION/LOGIN
// export const apiSessionLoginPost = async (req, res) => {
//     let user = req.body
//     try {
//         await controllerApiSessionLogin(req, res, user)
//     } catch (error) {
//         req.logger.fatal("Error al iniciar sesion.")
//     }
// }

// RUTA "GET" DE /API/SESSION/CURRENT
// export const apiSessionCurrent = async (req, res) => {
//     try {
//         const email = req.session.emailUser
//         const findUser = await getByEmail(email)
//         const name = findUser.first_name
//         const lastName = findUser.last_name
//         const age = findUser.age
//         const role = findUser.role
//         const cart = findUser.cart
//         //--------------------------------------------------------------------------------
//         const idDocument = req.cookies.idDocument
//         const find = await getDocumentById(idDocument)
//         const findPhoto = find.documents.filter(i => i.image === "profile")
//         let documentReference
//         if (findPhoto) {
//             documentReference = findPhoto.map(n => n.reference)
//         }
//         const ultimoValor = documentReference[documentReference.length - 1]
//         const length = documentReference.length
//         const referenceLength = length === 0 ? false : true
//         console.log(ultimoValor, referenceLength)
//         //--------------------------------------------------------------------------------
//         const datas = [email, name, lastName, age, role, cart,
//             ultimoValor, referenceLength,]
//             res.cookie('emailCurrent', email);
//             res.render("current", { datos: datas })
//             req.logger.info("Peticion GET a /api/session/current exitosa.")
//         } catch (error) {
//             res.status(500).json({ message: 'Error al obtener los datos de usuario.' });
//         req.logger.fatal("Error al obtener los datos de usuario.")
//     }
// };

// RUTA "GET" DE /API/SESSION/LOGOUT
// export const apiSessionLogout = async (req, res) => {
//     const email = req.session.emailUser
//     const last = await getByEmail(email)
//     await last.updateLastConnection()
//     req.session.destroy(error => {
//         req.logger.info(`Terminando conexion a las: ${last.last_connection}`);
//         res.render("login")
//         req.logger.info("¡¡¡Desloqueo exitoso!!!")
//     })
// }
//----------------------------------------------------------------------------------------------------

// RUTA RAIZ "GET" DE /
// export const rutaRaiz = (req, res) => {
//     res.render("index");
//     req.logger.info("Actualmente te encontras en la ruta raiz del proyecto.")
// }




// RUTA "GET" DE /HOME-MONGODB
// export const homeMongoDB = async (req, res) => {
    //     const limit = parseInt(req.query.limit) || 10 // Especifica la cantidad de elementos a mostrar. Si no especifico esa cantidad, por defecto el numero despues del ||
    //     const page = parseInt(req.query.page) || 1 // Especifica la pagina en la que quiero estar. Si no especifico, mostrar en la pagina que se pone despues del ||
    //     const sort = req.query.sort || "createdAt" // Sirve para odenar numeros y palabras. Si pongo ?sort=-price, se ordenaran los precios de manera descendente, sino se ordenaran de manera ascendente 
    //     const category = req.query.category // Sirve para filtrar los productos segun su categoria (éstas son case sensitive)
    
    //     const productoss = await getPaginateHomeMongoDB(category, limit, page, sort)
    
    //     const emailUser = req.session.emailUser
    //     const findUser = await getByEmail(emailUser)
    //     //-----------------------------
    //     // const roleUser = findUser.role 
    //     const roleUser = findUser ? findUser.role : null;
    //     //-----------------------------
    //     const roleView = roleUser === "premium" ? true : false; //Si el rol user es igual a "premium" sera true, sino sera false.
    //     const roleOwner = roleUser === "admin" ? "admin" : emailUser
    
    //     const productos = productoss.docs
    //     const buscadorId = productos.map(i => i._id)
    //     const buscadorTitle = productos.map(title => title.title)
    //     const buscadorDescription = productos.map(d => d.description)
    //     const buscadorCode = productos.map(c => c.code)
    //     const buscadorPrice = productos.map(p => p.price)
    //     const buscadorStock = productos.map(s => s.stock)
    //     const buscadorCategory = productos.map(ca => ca.category)
    //     const buscadorOwner = productos.map(o => o.owner)
    //     const user = req.session.emailUser
    //     const rol = req.session.rol
    //     const existeRol = req.session.existRol
    //     const ownerAdmin = roleUser === "admin" ? "admin" : user
    //     const ultimaConexion = req.session.lastConnection || "No registra"
    //     //-----------------------------
    //     // const modConection = ultimaConexion.split("T")[1].split(".")[0]
    //     // const fechaNormal = ultimaConexion.split("T")[0]
    //     // const partesFecha = fechaNormal.split("-");
    //     // const fechaInvertida = partesFecha.reverse().join("-");
    //     // const UltimaConexionDefinitiva = `Ultima conexion 🕓: ${fechaInvertida} a las ${modConection}`
    //     const UltimaConexionDefinitiva = `Última conexión: ${ultimaConexion} 🕓`
    //     //-----------------------------
    //     const idDocument = req.cookies.idDocument
    //     const find = await getDocumentById(idDocument)
    //     const findPhoto = find.documents.filter(i => i.image === "profile")
    //     let documentReference
    //     if (findPhoto) {
        //         documentReference = findPhoto.map(n => n.reference)
        //     }
        //     const ultimoValor = documentReference[documentReference.length - 1]
        //     const length = documentReference.length
        //     const referenceLength = length === 0 ? false : true
        //     //-----------------------------
//     const canDelete = buscadorOwner === emailUser ? true : false
//     //------
//     const userEmailGithub = req.session.emailUser.email
//     const userAgeGithub = req.session.emailUser.age
//     const userFirstNameGithub = req.session.emailUser.first_name
//     const cartIdUser = req.session.data[3]
//     const cartIdUserMap = Array(productos.length).fill(cartIdUser);
//     const arrayEmailUser = Array(productos.length).fill(emailUser);
//     //------
//     const mostrarONo = roleUser === "Admin" ? false : true
//     //------
//     const productossFull = [buscadorId, buscadorTitle, buscadorDescription, buscadorCode, buscadorPrice,
//         buscadorStock, buscadorCategory, user, rol, existeRol, userEmailGithub, userAgeGithub,
//         userFirstNameGithub, cartIdUser, cartIdUserMap, mostrarONo, roleUser,
//         roleView, roleOwner, buscadorOwner, ownerAdmin, canDelete, arrayEmailUser,
//         UltimaConexionDefinitiva, ultimoValor, referenceLength,]

//     const totalDocss = productoss.totalDocs
//     const limitt = productoss.limit
//     const totalPages = productoss.totalPages
//     const pagee = productoss.page
//     const pagingCounter = productoss.pagingCounter
//     const hasPrevPage = productoss.hasPrevPage
//     const hasNextPage = productoss.hasNextPage
//     const prevPage = productoss.prevPage
//     const nextPage = productoss.nextPage
//     const accesoProductos = roleUser === "premium" || roleUser === "admin" ? true : false;
//     const bloqueoProductos = true

//     const datosDePaginate = [totalDocss, limitt, totalPages, pagee,
//         pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage, accesoProductos, bloqueoProductos]

//     res.render("products", { productossFull: productossFull, datosExtras: datosDePaginate, sort })
//     req.logger.info("Peticion GET a /home-mongoDB exitosa.")
// }

// RUTA "POST" DE /HOME-MONGODB
// export const homeMongodbPost = async (req, res) => {
    //     try {
        //         let newProduct = req.body;
        //         await controllerMongoDbPost(req, res, newProduct);
        //         res.setHeader('Refresh', '1')
        //         res.redirect("/home-mongoDB");
        
        //     } catch (error) {
            //         req.logger.fatal(error)
            //         res.status(500).send({ status: "error", message: "Error al agregar el producto" });
            //     }
            // };
            
            // RUTA "GET" DINAMICA DE /HOME-MONGODB
            // export const homeMongodbDinamica = async (req, res, pid) => {
                //     try {
                    //         const pid = req.params.pid;
                    //         const prod = await controllerMongoDbDinamico(pid);
                    
                    //         if (prod) {
                        //             res.send({ status: "Success", message: "Producto eliminado." });
                        //             req.logger.fatal("Producto eliminado.")
                        //         } else {
                            //             Swal.fire({
                                //                 icon: 'success',
                                //                 title: 'Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.',
                                //             });
                                //             res.send({ status: "Success", message: "Exito al eliminar el producto. \n\nPor favor, REFRESQUE la página para ver los cambios" });
                                //             req.logger.info("Éxito al eliminar el producto deseado. REFRESQUE la página para ver los cambios.")
                                //         }
                                //     } catch (error) {
                                    //         res.status(400).send({ status: "Error" });
                                    //         req.logger.fatal("Error.")
                                    //     }
                                    // }
                                    
                    // // RUTA "GET" DE /CHAT
                    //                 export const getChat = async (req, res) => {
                    //                     let mensajes = await getChatFromMongoAtlas()
                    //                     let messageMongo = mensajes.map(mensaje => mensaje.message)
                    //                     let horaMongo = mensajes.map(men => men.hour)
                    //                     let userMongo = mensajes.map(men => men.user)
                    //                     let user = req.session.emailUser
                                        
                    //                     const combineData = [horaMongo, messageMongo, userMongo, user]
                                        
                    //                     res.render("chat.handlebars", { combineData })
                    //                     req.logger.info("Peticion GET a /chat exitosa.")
                    //                 }
                                    
                    
                                    // RUTA "GET" PARA /CARTS/:CID/PURCHASE
//                                     export const cartsParams = async (req, res) => {
//     const cartAll = await cartsModelFindService();
//     const cid = req.params.cid;
//     const cart = await cartsModelFindByIdService(cid)
//     try {
//         const cartId = cart._id;
//         const productId = cart.products.map((prod) => prod.product._id);
//         const title = cart.products.map((prod) => prod.product.title);
//         const price = cart.products.map((prod) => prod.product.price);
//         const quantity = cart.products.map((prod) => prod.quantity);
//         const totalPrice = price.map((p, index) => parseFloat(p) * parseFloat(quantity[index]));
//         const totalPriceFull = totalPrice.reduce((accumulator, current) => accumulator + current, 0);
//         const totalPriceFullWithComa = totalPriceFull
//         const cartIdAll = cartAll.map((i) => i._id);
//         const userEmailSession = req.session.emailUser

//         req.session.sessionDataPurchase = [
//             cart,
//             cartId,
//             productId,
//             title,
//             price,
//             quantity,
//             totalPrice,
//             totalPriceFull,
//             totalPriceFullWithComa,
//             cartIdAll,
//             userEmailSession,
//         ]
        
//         const push1 = req.session.sessionDataPurchase[3];
//         const push2 = req.session.sessionDataPurchase[5];
//         const push3 = req.session.sessionDataPurchase[4];
//         const combinedArray = [];
//         const maxLength = Math.min(push1.length, push2.length, push3.length);
//         for (let i = 0; i < maxLength; i++) {
//             const producto = push1[i];
//             const cantidad = push2[i];
//             const precio = push3[i];
//             combinedArray.push({ producto, cantidad, precio });
//         }
//         const productArray = combinedArray.map(productos => productos.producto)
//         const cantidadArray = combinedArray.map(cantidad => cantidad.cantidad)
//         const precioArray = combinedArray.map(precio => precio.precio)
//         const precioTotalArray = "$ " + precioArray.reduce((total, cantidad) => total + cantidad)
//         req.logger.debug(`Precio total del carrito: ${precioTotalArray}`)
        
//         const datos = [
//             cart,
//             productId,
//             title,
//             quantity,
//             price,
//             totalPrice,
//             totalPriceFullWithComa,
//             cartId,
//             cartIdAll,
//             userEmailSession,
//             productArray,
//             cantidadArray,
//             precioArray,
//             precioTotalArray
//         ];
        
//         req.logger.info(`Exito al cargar los datos de tu carrito con _id: ${cid}`)
//         res.render("cartId", { datos });
//     } catch (error) {
//         console.log(cart);
//         res.render("emptyCart")
//     }
// };




//RUTAS COMENTADAS PORQUE FUERON ENVIADAS A SU ROUTER CORRECTO


// RUTA "GET" DE /HOME
// export const homeProducts = async (req, res) => {
    //     try {
        //         const productsHome = await getProductsHome()
        //         res.render("home", { data: productsHome })
        //         req.logger.info("Peticion GET a /home exitosa.")
        //     } catch (error) {
            //         res.status(404).send({ status: "error", message: "No se ha podido encontrar la lista de productos." })
            //         req.logger.fatal("No se ha podido encontrar la lista de productos.")
            //     }
            // }
            
            
            // // RUTA "GET" DE /REALTIMEPRODUCTS
            // export const realTimeProducts = (req, res) => {
                //     res.render("realtimeproducts")
                //     req.logger.info("Peticion GET a /products/fs/socket exitosa.")
                
                //     moment.locale('es');
                //     const fecha = moment().format('LLLL');
                //     console.log(fecha)
                // }
                
                // // RUTA "POST" PARA AGREGAR PRODUCTOS EN /REALTIMEPRODUCTS
                // export const realTimeProductsPost = async (req, res) => {
                    //     try {
                        //         let nuevoProducto = req.body
                        //         await controllerRealTimeProductsPost(req, res, nuevoProducto)
                        //         req.logger.info(`Producto agregado exitosamente.`)
                        //         res.redirect("/realtimeproducts");
                        //     } catch (error) {
                            //         Swal.fire({
                                //             icon: 'error',
//             title: 'Error',
//             text: 'Todos los campos son obligatorios',
//         });
//         req.logger.fatal(`Todos los campos son obligatorios.`)
//     }
// }


// RUTA "GET" DE /API/SESSION/LOGIN
// export const apiSessionLogin = async (req, res) => {
//     res.render("login", {})
//     req.logger.info("Peticion GET a /api/session/login exitosa.")
// }