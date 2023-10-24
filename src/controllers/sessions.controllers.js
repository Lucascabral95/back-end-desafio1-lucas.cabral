import cartsModel from "../DAO/models/carts.model.js"
import { documentModel } from "../DAO/models/user.js"
import { createHash, isValidPassword } from "../utils.js"
import { generateToken } from "../jwt.js"
import SessionsDTO from "../DAO/DTOs/sessionsDTO.js"
import {
    getByEmail,
    createUser,
} from "../services/views.router.services.js"
import {
    getDocumentById,
} from "../services/documents.services.js"

export const apiSessionDentro = async (req, res) => {
    let user = req.session.emailUser
    let rol = req.session.rol
    let existeRol = req.session.existRol
    //------------------------------
    const userId = req.session.emailUser._id
    const userFirstName = req.session.emailUser.first_name
    const userLastName = req.session.emailUser.last_name
    const userEmail = req.session.emailUser.email
    const userAge = req.session.emailUser.age
    const userPassword = req.session.emailUser.password || null
    const userRolee = req.session.emailUser.role
    const userCart = req.session.emailUser.cart
    const userDocuments = req.session.emailUser.documents
    const userDni = req.session.emailUser.dni || "No registra"
    const userDomicilio = req.session.emailUser.domicilio || "No registra"
    const userLastConnection = req.session.emailUser.last_connection || "No registra última conexión"

    const data = {
        id: userId,
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        edad: userAge,
        password: userPassword,
        role: userRolee,
        cart: userCart,
        documents: userDocuments,
        dni: userDni,
        domicilio: userDomicilio,
        ultimaConexion: userLastConnection
    }
    //------------------------------

    let userNameGithub = req.session.emailUser.first_name
    let userEmailGithub = req.session.emailUser.email
    let userAgeGithub = req.session.emailUser.age
    const userData = [user, rol, userNameGithub, userEmailGithub, userAgeGithub, existeRol]

    // console.log(req.session.emailUser._id)

    res.render("pageGithub", { user: userData, data: data })
    req.logger.info("Exito al ingresar a /api/session/dentro")
}

export const apiSessionRegister = async (req, res) => {
    res.render("register", {})
    req.logger.info("Peticion GET a /api/session/register exitosa.")
}

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
//         res.cookie('emailCurrent', email);
//         res.render("current", { datos: datas })
//         req.logger.info("Peticion GET a /api/session/current exitosa.")
//     } catch (error) {
//         res.status(500).json({ message: 'Error al obtener los datos de usuario.' });
//         req.logger.fatal("Error al obtener los datos de usuario.")
//     }
// };
export const apiSessionCurrent = async (req, res) => {
    try {
        //-------- github -----------
        // const email = req.session.emailUser// TITULAR
        const email = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
        //-------- github -----------                
        const findUser = await getByEmail(email)
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
        console.log(ultimoValor, referenceLength)
        const idUser = findUser._id
        const showw = findUser.role !== "admin" ? false : true
        const datito = [ultimoValor, referenceLength, idUser, showw]
        const dnii = findUser.dni || "No registra"
        const domicilioo = findUser.domicilio || "No registra"

        const sessionsDTO = new SessionsDTO({
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            email: email,
            age: findUser.age,
            //---------------
            dni: dnii,
            domicilio: domicilioo,
            //---------------
            role: findUser.role,
            cart: findUser.cart,
            document: findUser.documents,
            last_connection: findUser.last_connection
        });

        res.cookie('emailCurrent', email);
        res.render("current", { datos: sessionsDTO, datito: datito })
        req.logger.info("Peticion GET a /api/session/current exitosa.")
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos de usuario.' });
        req.logger.fatal("Error al obtener los datos de usuario.")
    }
};

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
export const apiSessionLogout = async (req, res) => {
    const email = req.session.emailUser;
    const last = await getByEmail(email);
    await last?.updateLastConnection();
    req.session.destroy(error => {
        req.logger.info(`Terminando conexión a las: ${last?.last_connection}`);
        res.render("login");
        req.logger.info("¡¡¡Desbloqueo exitoso!!!");
    });
};


// LOGICA "POST" DE /API/SESSION/REGISTER 
export const controllerApiSessionRegister = async (req, res) => {
    try {
        const user = req.body;
        if (!user.first_name || !user.last_name || !user.email || !user.age || !user.password) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const cuentaUsuario = await getByEmail(user.email);
        if (cuentaUsuario) {
            throw new Error("El usuario ya está registrado.");
        }
        const newCart = cartsModel({ products: [] });
        const newDocument = documentModel({ documents: [] });
        const savedCart = await newCart.save();
        const savedDocument = await newDocument.save();
        const newUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            password: createHash(user.password),
            role: user.role,
            cart: savedCart._id,
            documents: savedDocument._id,
            dni: "",
            domicilio: ""
        };
        const savedUser = await createUser(newUser);
        await savedUser.updateLastConnection();

        req.logger.info(savedUser);
        req.logger.info(`Nuevo usuario registrado con email: ${savedUser.email}`);
        res.cookie("dataUser", savedUser).render("login", {});
    } catch (error) {
        req.logger.fatal("Error al registrar el usuario y el carrito:", error);
        res.render("register-error", {});
    }
};

// RUTA "GET" DE /API/SESSION/LOGIN
export const apiSessionLogin = async (req, res) => {
    res.render("login", {})
    req.logger.info("Peticion GET a /api/session/login exitosa.")
}

// LOGICA "POST" DE /API/SESSION/LOGIN
export const apiSessionLoginPost = async (req, res) => {
    try {
        const user = req.body;
        const busquedaData = await getByEmail(user.email);

        if (!busquedaData || !isValidPassword(busquedaData, user.password)) {
            return res.render("login-error", {});
        } else if (busquedaData.email === null || typeof busquedaData.email === "undefined") {
            return res.render("login-error", {});
        } else if (user.password === "adminCod3r123" && user.email === "adminCoder@coder.com") {
            req.session.rol = "Admin";
            req.session.existRol = true;
            req.session.emailUser = "adminCoder@coder.com";
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart];
            const token_access = generateToken(user.email);
            req.session.emailJwt = user.email;
            res.cookie("idDocument", busquedaData.documents ? busquedaData.documents.toString() : "");
            //------
            // res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
            //------
            res.cookie("authToken", token_access, { httpOnly: true }).redirect("/home-mongodb");
        } else {
            req.session.rol = "Usuario";
            req.session.existRol = true;
            req.session.emailUser = user.email;
            req.session.data = [busquedaData.first_name, busquedaData.last_name, busquedaData.age, busquedaData.cart];
            const token_access = generateToken(user.email);
            req.logger.debug(`Email del usuario: ${user.email}`);
            req.logger.debug(`Token JWT del usuario: ${token_access}`);
            req.logger.info(`Inicio de sesion exitoso con email: ${busquedaData.email}`);
            await busquedaData.updateLastConnection();
            res.cookie("idDocument", busquedaData.documents ? busquedaData.documents.toString() : "");
            req.session.lastConnection = busquedaData.last_connection;
            //------
            // res.cookie("authToken", token_access, { httpOnly: true }).redirect("/api/session/current");
            //------
            res.cookie("authToken", token_access, { httpOnly: true }).redirect("/home-mongodb");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Interno del Servidor");
    }
}
