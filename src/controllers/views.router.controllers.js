import {
    addProducts,
    add,
    deleteProductById,
    getCartUser,
    populateCart,
    getByEmail,
    createUser,
    serviceFaker,
    updatePasswordByEmail,
    getChatFromMongoAtlas,
} from "../services/views.router.services.js"
import {
    getAllDocuments,
    getDocumentById,
} from "../services/documents.services.js"
import { TicketCurrentDTO, TicketDTO } from "../DAO/DTOs/ticketDTO.js";
import cartsModel from "../DAO/models/carts.model.js"
import { documentModel } from "../DAO/models/user.js";
import TicketServices from "../DAO/TicketsDAO.js"
const ticketDao = new TicketServices()
import { createHash, isValidPassword } from "../utils.js";
import bcrypt from "bcrypt"
import { generateToken } from "../jwt.js";
import { sendMail } from "../services/nodemailer.js";
//-----------Custom Error------------------------------
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { 
    generateProductErrorInfo, 
    generateTicketErrorInfo 
} from "../services/errors/info.js";
//-----------Custom Error------------------------------
//------ UUID (para generar links temporales) ---------
import { v4 as uuidv4 } from 'uuid';
//------ UUID (para generar links temporales) ---------

// LOGIGA DE /API/SESSION/CURRENT
export const controllerHomeMongodb = async (req, res) => {
    try {
        const emailJwt = req.session.emailJwt;
        const dataUserCookie = req.cookies.dataUser || {};
        const dataUserFirstName = req.session.data[0];
        const dataUserLastName = req.session.data[1];
        const dataUserAge = req.session.data[2];
        const dataUserRole = req.session.rol;
        const dataUserCart = req.session.data[3];

        const datos = {
            email: emailJwt,
            firstName: dataUserFirstName,
            lastName: dataUserLastName,
            age: dataUserAge,
            role: dataUserRole,
            cart: dataUserCart,
        }
        return datos
    } catch (error) {
        res.status(500).json({ message: 'Error de inicio de sesión.' });
    }
}


// LOGICA "POST" DE /API/SESSION/REGISTER
export const apiSessionRegisterPost = async (req, res) => {
    let user = req.body;

    try {
        const resultado = await controllerApiSessionRegister(user);
        console.log(resultado);

        req.session.dataUser = resultado;
        res.render("login", {});
    } catch (error) {
        console.error("Error al registrar el usuario y el carrito:", error);
        res.render("register-error", {});
    }
};

// LOGICA "POST" DE /API/SESSION/REGISTER 
export const controllerApiSessionRegister = async (user) => {
    try {
        if (!user.first_name || !user.last_name || !user.email || !user.age || !user.password) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const cuentaUsuario = await getByEmail(user.email);
        if (cuentaUsuario) {
            throw new Error("El usuario ya está registrado.");
        }
        const newCart = cartsModel({ products: [] });
        //--------------------------------------------
        const newDocument = documentModel({ documents: [] })
        //--------------------------------------------      
        const savedCart = await newCart.save();
        const savedDocument = await newDocument.save()
        const newUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            password: createHash(user.password),
            role: user.role,
            cart: savedCart._id,
            documents: savedDocument._id,
            //-------------------------------------------- 
            dni: "",
            domicilio: ""
            //--------------------------------------------        
        };
        const savedUser = await createUser(newUser);
        //-------------------para poner hora y fecha al crear usuario--------------------------
        await savedUser.updateLastConnection();
        //-------------------para poner hora y fecha al crear usuario--------------------------
        return savedUser;
    } catch (error) {
        return null;
    }
};

// LOGICA "POST" DE /API/SESSION/LOGIN
export const controllerApiSessionLogin = async (req, res, user) => {
    try {
        const busquedaData = await getByEmail(user.email);

        if (!busquedaData || !isValidPassword(busquedaData, user.password)) {
            // req.logger.fatal(`Error al intentar iniciar sesión con ${busquedaData.email}`);
            return res.render("login-error", {});
        } else if (busquedaData.email === null || typeof busquedaData.email === "undefined") {
            return res.render("login-error", {});
        } else if (user.password === "adminCod3r123" && user.email === "adminCoder@coder.com") {
            req.session.rol = "Admin";
            req.session.existRol = true;
            req.session.emailUser = user.email;
            req.session.emailUser = "adminCoder@coder.com";
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart]
            const token_access = generateToken(user.email);
            req.session.emailJwt = user.email;
            return res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
        } else {
            req.session.rol = "Usuario";
            req.session.existRol = true;
            req.session.emailUser = user.email;
            //----------------
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart]
            //----------------
            // propiedades de JWT.redirect("/api/session/current");
            const token_access = generateToken(user.email);
            req.logger.debug(`Email del usuario: ${user.email}`)
            req.logger.debug(`Token JWT del usuario: ${token_access}`)
            req.logger.info(`Inicio de sesion exitoso con email: ${busquedaData.email}`)
            req.session.emailJwt = user.email;
            //-------------------para actualizar hora y fecha al crear usuario--------------------------
            await busquedaData.updateLastConnection();
            res.cookie("idDocument", busquedaData.documents ? busquedaData.documents.toString() : "");
            req.session.lastConnection = busquedaData.last_connection
            //-------------------para actualizar hora y fecha al crear usuario--------------------------
            return res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Interno del Servidor");
    }
}
//---------------------------------------------
// // LOGICA "POST" PARA DESCONTAR STOCK DE PRODUCTOS SEGUN SU _ID EN MONGODB ATLAS. 
// export const controllerStock = async (req, res) => {
    //     const cid = req.params.cid;
    //     try {
        //         let cart = await populateCart(cid)
        //         const { products } = cart;
        //         for (const item of products) {
            //             const pid = item.product._id.toString();
            //             const quantity = item.quantity;
            
            //             await getCartUser(pid, quantity);
            //         }
            //         cart.products = [];
            //         await cart.save();
            //         res.send(cart);
            //         req.logger.info("¡¡¡Compra y descuento del stock exitosos!!! ")
            //     } catch (error) {
                //         req.logger.fatal("Error:", error)
                //         res.status(500).send("Error de servidor");
                //     }
                // }
                
// export const controllerTicket = async (req, res) => {
//     const amount = req.session.sessionDataPurchase[8]
//     const purchaser = req.session.emailUser;

//     if (!amount || !purchaser) {
    //         req.logger.fatal("Todos los campos son obligatorios.")
    //         const tickerError = generateTicketErrorInfo(amount, purchaser)
    //         throw CustomError.createError({
        //             name: "Error al generar el ticket.",
        //             cause: tickerError,
        //             message: "Todos los campos son obligatorios.",
        //             code: EErrors.TICKET_ERROR
        //         })
        //     } else {
            //         const generatedTicket = await ticketDao.addTickets(amount, purchaser);
            //         req.session.generatedTicket = generatedTicket
            //         res.redirect("/home-mongodb")
            //     }
            // };
            //---------------------------------------------
            
            // RUTA RELATIVA QUE MUESTRA UN NUMERO DINAMICO (100 EN ESTE CASO) DE PRODUCTOS PROVENIENTES DE "FAKER"
            export const controllerMock = async (req, res) => {
                try {
                    const productsMap = await serviceFaker(100)
                    const products = productsMap.map(p => p.product)
                    const price = productsMap.map(price => price.price)
        const color = productsMap.map(color => color.color)
        const dataBase = [products, price, color]
        
        res.render("mockingProducts", { data: dataBase })
        req.logger.info("Peticion GET a /mockingproducts exitosa.")
    } catch (error) {
        res.status(500).send("Error al mostrar el mock de productos.")
        req.logger.fatal("Error al mostrar el mock de productos.")
    }
}

// RUTA RELATIVA QUE MUESTRA EN TERMINAL LOS LOGGER DE WINSTON 
export const controllerLoggerExamples = async (req, res) => {
    try {
        req.logger.warning("Hola, soy warn")
        req.logger.fatal("Hola, soy fatal")
        req.logger.debug("Hola, soy debug")
        res.send({ message: "¡Prueba de logger!" })
    } catch (error) {
        console.log("Error al generar en la terminar la lista de errores.");
        next(error)
    }
}

export const controllerNodemailer = async (req, res) => {
    let email = req.query.email
    try {
        const linkToken = uuidv4()
        const expirationTime = Math.floor(Date.now() / 1000) + 3600 // tiempo en segundos para que expire este link temporal para restablecer la contraseña (1 hora)
        const enlace = `http://localhost:8080/link/${linkToken}?expira=${expirationTime}`
        
        let option = ({
            from: " Proyecto de Backend <lucasgamerpolar10@gmail.com>",
            to: email,
            subject: "Link para restablecer contraseña. Expira en 1 hora.",
            html: `
            <div>
            <p> Para actualizar su contraseña, </p> <a href="${enlace}"> clickeá acá. </a>
            </div>
            `,
            attachments: []
        })
        
        const findEmail = await getByEmail(email)
        
        if (findEmail) {
            let result = await sendMail(option)
            res.cookie("emailRecuperacion", email, { maxAge: 3600000 }); // tiempo en milisegundos que se guardara la cookie (1 hora)
            res.send({ status: "success", result: "Email sent" })
            req.logger.info(`Exito al enviar correo a ${email}`)
        } else {
            req.logger.fatal(`Email no existente en la base de datos.`);
        }
        
    } catch (error) {
        req.logger.fatal(`Error al enviar correo a ${email}`);
    }
}

export const controllerGenerateLink = async (req, res) => {
    res.render("generateLink");
};

export const controllerLink = async (req, res) => {
    const linkToken = req.params.linkToken;
    const expirationTime = req.query.expira;
    
    const tiempoRestante = expirationTime - Math.floor(Date.now() / 1000);
    const emailCheck = req.cookies.emailRecuperacion
    console.log(emailCheck);
    
    if (tiempoRestante > 0) {
        res.render("change-password", { email: emailCheck })
    } else {
        res.render("expirationPage")
    }
}

export const controllerRecoverPassword = async (req, res) => {
    res.render("recoverPassword")
}

export const controllerChangePassword = async (req, res) => {
    try {
        const password = req.body
        const user = req.cookies.emailRecuperacion
        
        const findEmail = await findEmail(user)
        const emailPass = findEmail.password
        console.log(emailPass);
        
        if (password) {
            
        } else {
            req.logger.fatal("Ingrese una contraseña.")
        }
        
    } catch (error) {
        req.logger.fatal("No se ha podido cambiar la contraseña.")
    }
}

export const controllerChangePasswordGet = async (req, res) => {
    const newPassword = req.body.password;
    const user = req.cookies.emailRecuperacion;
    
    try {
        const findEmail = await getByEmail(user);
        
        if (!findEmail) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        const emailPassword = findEmail.password;
        const isPasswordValid = await bcrypt.compare(newPassword, emailPassword);
        
        if (isPasswordValid) {
            req.logger.warning("La contraseña debe ser distinta a la orignal.");
            res.send({ message: "Error al cambiar la contraseña. Debe ser diferente a la orignal" });
        } else {
            const passHasheada = await createHash(newPassword)
            await updatePasswordByEmail(user, passHasheada)
            req.logger.info("Exito al cambiar la contraseña.");
            res.render("successChangePassword")
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

export const getAllDocumentss = async (req, res) => {
    try {
        const document = await getAllDocuments()
        res.send(document)
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al obtener los productos" })
    }
}

export const getDocumentByIdd = async (req, res) => {
    try {
        const did = req.params.did
        const document = await getDocumentById(did)
        
        res.send(document)
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al mostrar el documento" })
    }
}

export const addDataInDocument = async (req, res) => {
    try {
        const did = req.params.did
        const { name, reference } = req.body
        const findDocument = await getDocumentById(did)
        
        if (!findDocument) {
            res.status(400).send("No se encontro el documento")
        }
        
        if (!name || !reference) {
            res.send("Name y Reference son campos obligatorios.")
        } else {
            findDocument.documents.push({ name, reference })
            await findDocument.save();
            res.send("Exito al agregar datos al documento.")
        }
        
    } catch (error) {
        res.status(400).send({ status: "error", message: "Error al agregar datos al documento" })
    }
}
// NO ELIMINAR NO ELIMINAR NO ELIMINAR NO ELIMINAR NO ELIMINAR NO ELIMINAR NO ELIMINAR NO ELIMINAR 
// export const completedPurchase = async (req, res) => {
//     try {
//         const dataTicket = req.session.generatedTicket
//         const tid = req.session.emailUser
//         let tickets = await ticketDao.getTicketByCart(tid)
//         const ticketId = tickets.map(id => id._id.toString())
//         const ticketDatatime = tickets.map(id => id.purchase_dateTime)
//         const ticketPurchaser = tickets.map(id => id.purchaser)
//         const ticketCode = tickets.map(id => id.code)
//         const ticketAmount = tickets.map(id => id.amount)
//         //-----------------------------------------------
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
//         //-----------------------------------------------
//         const total = ticketId.length
//         const mockTicket = [ticketId, ticketDatatime, ticketPurchaser, ticketCode, ticketAmount, total,
//             ultimoValor, referenceLength, tid,]

//             console.log(dataTicket)
            
//             res.render("completedPurchase", { ticket: dataTicket, mock: mockTicket })
//             req.logger.info("Peticion GET a /mockingPurchase exitosa.")
//         } catch (error) {
//             req.logger.fatal("Error", error)
//             res.status(500).send("An error occurred.");
//         }
//     }
export const completedPurchase = async (req, res) => {
    try {
        //-------- github -----------
        // const userr = req.session.emailUser // TITULAR
        const userr = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
        //-------- github -----------
        const findUserr = await getByEmail(userr)
        const userIdd = findUserr._id
        const userCartt = findUserr.cart
        const dataTicket = req.session.generatedTicket
        //-------- github -----------
        // const tid = req.session.emailUser // TITULAR
        const tid = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
        //-------- github -----------
        let tickets = await ticketDao.getTicketByCart(tid)
        const ticketId = tickets.map(id => id._id.toString())
        const ticketDatatime = tickets.map(id => id.purchase_dateTime)
        const ticketPurchaser = tickets.map(id => id.purchaser)
        const ticketCode = tickets.map(id => id.code)
        const ticketAmount = tickets.map(id => id.amount)
        //-----------------------------------------------
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
        const total = ticketId.length

            const mockTicket = new TicketDTO({
                _id: ticketId,
                purchase_dateTime: ticketDatatime,
                purchaser: ticketPurchaser,
                code: ticketCode, 
                amount: ticketAmount,
                total: total,
                ultimoValor: ultimoValor,
                referenceLength: referenceLength,
                tid: tid
            })
            const ticketCurrentDto = new TicketCurrentDTO({
                _id: dataTicket?._id,
                code: dataTicket?.code,
                purchase_dateTime: dataTicket?.purchase_dateTime,
                amount: dataTicket?.amount,
                purcharser: dataTicket?.purchaser,
            })

            if (req.session.compraHecha) {
                delete req.session.compraHecha
            }
            const data = {
                email: req.session.dataSubHeader[4],
                uid: req.session.dataSubHeader[0],
                cart: req.session.dataSubHeader[1],
                referenceLength: req.session.dataSubHeader[2],
                ultimoValor: req.session.dataSubHeader[3]
            }
            const amountt = Object.values(mockTicket.amount);
            const ultimoAmount = amountt[amountt.length - 1]
            const codee = Object.values(mockTicket.code);
            const ultimoCode = codee[codee.length - 1]
            const iddd = Object.values(mockTicket._id);
            const ultimoIddd = iddd[iddd.length - 1]
            const datatimee = Object.values(mockTicket.purchase_dateTime);
            const ultimoDatatimee = datatimee[datatimee.length - 1]
            const emailPur = Object.values(mockTicket.purchaser);
            const ultimoPurr = emailPur[emailPur.length - 1]
            const lastPurchasee = {
                ultimoAmount: ultimoAmount,
                ultimoCode: ultimoCode,
                ultimoIddd: ultimoIddd,
                ultimoDatatimee: ultimoDatatimee,
                ultimoPurr: ultimoPurr
            }
                        
            res.render("completedPurchase", { ticket: ticketCurrentDto, mock: mockTicket, data: data, last: lastPurchasee })
            req.logger.info("Peticion GET a /mockingPurchase exitosa.")
        } catch (error) {
            req.logger.fatal("Error", error)
            res.status(500).send("An error occurred.");
        }
    }

    
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
        req.logger.info("Exito al ingresar a /api/session/dentro")
    }
    
    // RUTA GET A LA RUTA RAIZ "/"
    export const rutaRaiz = (req, res) => {
        res.redirect("/api/session/login")
    // res.render("index");
    // req.logger.info("Actualmente te encontras en la ruta raiz del proyecto.")
}

// RUTA "GET" DE /CHAT
export const getChat = async (req, res) => {
    let mensajes = await getChatFromMongoAtlas()
    let messageMongo = mensajes.map(mensaje => mensaje.message)
    let horaMongo = mensajes.map(men => men.hour)
    let userMongo = mensajes.map(men => men.user)
    let user = req.session.emailUser
    
    const combineData = [horaMongo, messageMongo, userMongo, user]
    const datitos = [
        req.session.dataSubHeader[0],
        req.session.dataSubHeader[1],
        req.session.dataSubHeader[2],
        req.session.dataSubHeader[3],
        req.session.dataSubHeader[4],
        req.session.dataSubHeader[5]
    ]
    
    res.render("chat.handlebars", { combineData: combineData, datos: datitos })
    req.logger.info("Peticion GET a /chat exitosa.")
}

// RUTA "GET" DE /API/SESSION/REGISTER
export const apiSessionRegister = async (req, res) => {
    res.render("register", {})
    req.logger.info("Peticion GET a /api/session/register exitosa.")
}

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
    
    
    
    
    
    
    // export const apiUserData = async (req, res) => {
        //     try {
            //         const user = req.session.emailUser;
            //         let findUser = await getByEmail(user);
            
            //         if (!findUser) {
                //             return res.status(404).json({ error: 'Usuario no encontrado' });
                //         }
                //         const { identificacion, domicilio } = req.body;
                //         findUser.dni = identificacion;
                //         findUser.domicilio = domicilio;
                //         await findUser.save();
                //         req.logger.info(findUser);
                
                //         // res.status(200).json({ message: 'Operación exitosa' });
                //         // res.redirect("/api/users/premium")
                //         setTimeout(() => {
                    //             res.redirect("/api/users/premium")
                    //         }, 1000);
                    //     } catch (error) {
        //         req.logger.fatal('Error en chequeo:', error);
        //         res.status(500).json({ error: 'Hubo un error en el servidor' });
        //     }
        // };
        
        
        // // LOGICA "POST" PARA /REALTIMEPRODUCTS
        // export const controllerRealTimeProductsPost = async (req, res, nuevoProducto) => {
            //     if (
                //         !nuevoProducto.title ||
                //         !nuevoProducto.description ||
                //         !nuevoProducto.code ||
                //         !nuevoProducto.price ||
                //         !nuevoProducto.stock ||
                //         !nuevoProducto.category
                //     ) {
                    //         return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" });
                    //     }
                    //     const productos = await addProducts(nuevoProducto);
                    //     return productos
                    // }
                    
                    
                    // LOGICA "POST" DE /HOME-MONGODB
                    // export const controllerMongoDbPost = async (req, res, newProduct) => {
                        //     if (
                            //         !newProduct.title ||
                            //         !newProduct.description ||
                            //         !newProduct.code ||
                            //         !newProduct.price ||
                            //         !newProduct.stock ||
                            //         !newProduct.category
                            //     ) {
                                //         const errorInfo = generateProductErrorInfo(newProduct);
                                //         throw CustomError.createError({
                                    //             name: "Error al agregar producto.",
                                    //             cause: errorInfo,
                                    //             message: "Todos los campos son obligatorios.",
                                    //             code: EErrors.INCOMPLETE_FIELDS
                                    //         });
                                    //     }
                                    //     const product = await add(newProduct);
                                    //     return product
                    // };
                    
                    // LOGICA "GET" DINAMICA DE /HOME-MONGODB
                    // export const controllerMongoDbDinamico = async (pid) => {
                    //     try {
                        //         const prod = await deleteProductById(pid);
                        //         return prod;
                        
                        //     } catch (error) {
                            //         throw error;
                            //     }
                            // };
                            
                            
                            
                            // RUTA "GET" DE /API/SESSION/LOGIN
                            // export const apiSessionLogin = async (req, res) => {
                            //     res.render("login", {})
                            //     req.logger.info("Peticion GET a /api/session/login exitosa.")
                            // }
                            
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