import { userModel } from "../DAO/models/user.js";
import UsersDTO from "../DAO/DTOs/users.DTO.js";
import {
    getDocumentById,
} from "../services/documents.services.js";
import {
    getByEmail,
    updateRoleByEmail,
    getAll,
} from "../services/views.router.services.js";
import {
    deleteUser,
    filterAndDeleteUsers
} from "../DAO/sessions.js";

export const controllerUsersPremium = async (req, res) => {
    //----------github------------------------------
    const userGithubEmail = req.session.emailUser.email
    const userGithubId = req.session.emailUser._id
    const userGithubRole = req.session.emailUser.role
    //----------github------------------------------
    // const email = req.session.emailUser  // titular
    const email = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    //----------github------------------------------
    const findUser = await getByEmail(email)
    const roleOfEmail = findUser.role
    const idOfEmail = findUser._id
    const changeRole = findUser.role === "user" ? "premium" : "user"
    const accessToPremium = findUser.domicilio?.trim() === "" ? false : true
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

    //------------------ GITHUB ----------
    const data = [
        roleOfEmail,
        idOfEmail,
        email,
        changeRole,
        accessToPremium,
        ultimoValor,
        referenceLength,
    ];

    for (let i = 0; i < 5; i++) {
        data.push(req.session.dataSubHeader && req.session.dataSubHeader[i] !== undefined ? req.session.dataSubHeader[i] : null);
    }
    //------------------ GITHUB ----------
    console.log(req.session.emailUser)

    // const data = [roleOfEmail, idOfEmail, email, changeRole, accessToPremium,
    //     ultimoValor, referenceLength, req.session.dataSubHeader[0], req.session.dataSubHeader[1],
    //     req.session.dataSubHeader[2], req.session.dataSubHeader[3], req.session.dataSubHeader[4]]

    res.render("changeRole", { role: data })
}


export const controllerUsersPremiumPost = async (req, res) => {
    const uid = req.params.uid
    //----------------GITHUB--------------
    // const email = req.session.emailUser // TITULAR
    const email = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    //----------------GITHUB--------------
    const findUser = await getByEmail(email)
    const role = findUser.role
    const changeRole = role === "user" ? "premium" : "user"

    await updateRoleByEmail(email, changeRole)
    console.log("Exito al cambiar de Role de usuario.");
}

export const uploadPhotos = async (req, res) => {
    //--------- github ------------
    // const user = req.session.emailUser // TITULAR
    const user = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    //--------- github ------------
    const findUserr = await getByEmail(user)
    const userIdd = findUserr._id
    const userCart = findUserr.cart
    const idDocument = req.cookies.idDocument;
    const find = await getDocumentById(idDocument);
    let documentName;
    let documentReference;
    let documentName2
    let documentReference2
    const filteredDocuments = find.documents.filter(doc => doc.image === "profile");
    const filteredDocuments2 = find.documents.filter(doc => doc.image === "product");
    if (filteredDocuments) {
        documentName = filteredDocuments.map(doc => doc.name);
        documentReference = filteredDocuments.map(doc => doc.reference);
    }
    if (filteredDocuments2) {
        documentName2 = filteredDocuments2.map(doc => doc.name);
        documentReference2 = filteredDocuments2.map(doc => doc.reference);
    }

    let ultimoValor = documentReference[documentReference.length - 1]
    const length = documentName.length
    const condicionalLength = length === 0 ? false : true;
    //----------------
    const ultimoValor2 = documentReference2[documentReference2.length - 1]
    const length2 = documentName2.length
    const condicionalLength2 = length2 === 0 ? false : true;
    const showw = user !== "adminCoder@coder.com" ? false : true
    //----------------
    const dataDocument = [user, documentName, documentReference, ultimoValor, condicionalLength,
        documentName2, documentReference2, ultimoValor2, condicionalLength2, userIdd, userCart, showw]
    res.render("uploadPictures", { data: dataDocument })
}

export const uploaderPhotosProfile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo guardar la imagen" })
    } else {
        console.log(req.file.originalname);
        const originalname = req.file.originalname
        const idDocu = req.cookies.idDocument

        const newData = {
            name: originalname,
            reference: `/documents/profiles/${originalname}`,
            image: "profile"

        }
        const docu = await getDocumentById(idDocu)
        docu.documents.push(newData)
        await docu.save();
        res.cookie("myAvatar", `/documents/profiles/${originalname}`)
        setTimeout(() => {
            res.redirect("/api/users/documents");
        }, 1000);
    }
}

export const uploaderPhotosProduct = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo guardar la imagen" })
    } else {
        const originalname = req.file.originalname
        const idDocu = req.cookies.idDocument

        const newData = {
            name: originalname,
            reference: `/documents/products/${originalname}`,
            image: "product"
        }
        const docu = await getDocumentById(idDocu)
        docu.documents.push(newData)
        await docu.save()
        res.cookie("myAvatar", `/documents/profiles/${originalname}`)
        setTimeout(() => {
            res.redirect("/api/users/documents");
        }, 1000);
    }
}

export const allUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const users = await getAll();
        const totalUsers = users.length;
        const totalPages = Math.ceil(totalUsers / limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const usersSubset = users.slice(startIndex, endIndex);

        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        const paginaAnterior = parseInt(page - 1)
        const paginaSiguiente = parseInt(page + 1)
        const paginasDisponibles = [
            hasNextPage,
            hasPreviousPage,
            page,
            paginaAnterior,
            paginaSiguiente,
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4],
            req.session.dataSubHeader[5]
        ]

        const datosDTO = usersSubset.map(user => {
            return new UsersDTO(user.first_name, user.email, user.role);
        });
        const nombreDTO = datosDTO.map(n => n.nombre);
        const emailDTO = datosDTO.map(n => n.email);
        const roleDTO = datosDTO.map(n => n.role);
        const dataDTO = {
            nombre: nombreDTO,
            email: emailDTO,
            role: roleDTO
        }

        res.render("allUsers", { datos: dataDTO, availablePage: paginasDisponibles });
    } catch (error) {
        req.fatal(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

export const deleteApiUser = async (req, res) => {
    const email = req.params.email
    const findEmail = await getByEmail(email)

    if (findEmail) {
        await deleteUser(email)
        req.logger.info(`Usuario ${email} eliminado de la base de datos`)
        res.status(200).send({ status: "success", message: "Usuario eliminado" })
    } else {
        res.status(404).send({ status: "error", message: "No se encontro usuario" })
    }
}

export const updateUserByIdPost = async (req, res) => {
    const email = req.params.email;
    const newRole = req.body.role;
    const findUser = await getByEmail(email);

    if (!findUser) {
        res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        return;
    }

    if (newRole) {
        await updateRoleByEmail(email, newRole);
        res.status(200).send({ status: "success", message: "Rol del usuario actualizado exitosamente" });
        req.logger.info("Rol del usuario actualizado exitosamente")
    } else {
        res.status(400).send({ status: "error", message: "El campo 'role' es obligatorio" });
    }
};

export const apiUserData = async (req, res) => {
    try {
        //----------github------
        // const user = req.session.emailUser; //  TITULAR
        const user = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
        let findUser = await getByEmail(user);
        //----------github------

        if (!findUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const { identificacion, domicilio } = req.body;
        findUser.dni = identificacion;
        findUser.domicilio = domicilio;
        await findUser.save();
        req.logger.info(findUser);

        setTimeout(() => {
            res.redirect("/api/users/premium")
        }, 1000);
    } catch (error) {
        req.logger.fatal('Error en chequeo:', error);
        res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
};

export const deleteUsersFor = async (req, res) => {
    try {
        const usuariosAEliminar = await deleteUsers100Years()
        let cantidadUsuariosEliminados
        if (usuariosAEliminar) {
            cantidadUsuariosEliminados = usuariosAEliminar.length
        }

        res.status(200).send({ status: "success", message: `Se eliminaron: ${cantidadUsuariosEliminados} usuarios` })
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error al eliminar usuarios por inactividad" });
    }
};

export const eliminarUsuariosPorInactividad = async (req, res) => {
    const deletedCount = await filterAndDeleteUsers(userModel);

    if (deletedCount > 0) {
        const cuentasEliminadas = deletedCount > 0 ? true : false;
        const responseCounts = `Se eliminaron a ${deletedCount} usuario(s)`;
        const email = req.session.emailUser;
        const responses = {
            cuentaEliminadaIf: cuentasEliminadas,
            cantidad: responseCounts,
            email: email
        }

        const datos = [
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4],
            req.session.dataSubHeader[5]
        ]

        res.render("deleteUsers", { response: responses, datos: datos });
        console.log(`Se han eliminado ${deletedCount} usuario(s).`);
    } else {
        const cuentasEliminadasOno = deletedCount === 0 ? true : false
        const email = req.session.emailUser
        const datos = [
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4],
            req.session.dataSubHeader[5]
        ]
        const resp = {
            cuentaEliminadaElse: cuentasEliminadasOno,
            email: email
        }
        res.render("deleteUsers", { response: resp, datos: datos });
    }
};
