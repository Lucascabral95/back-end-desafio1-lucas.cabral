import {
    getDocumentById,
} from "../services/documents.services.js";

import {
    getByEmail,
} from "../services/views.router.services.js";

import {
    updateRoleByEmail,
} from "../services/views.router.services.js";

export const controllerUsersPremium = async (req, res) => {
    const email = req.session.emailUser
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
    
    const data = [roleOfEmail, idOfEmail, email, changeRole, accessToPremium, 
        ultimoValor, referenceLength, ]
    res.render("changeRole", { role: data })
}


export const controllerUsersPremiumPost = async (req, res) => {
    const uid = req.params.uid
    const email = req.session.emailUser
    const findUser = await getByEmail(email)
    const role = findUser.role
    const changeRole = role === "user" ? "premium" : "user"

    await updateRoleByEmail(email, changeRole)
    console.log("Exito al cambiar de Role de usuario.");
}

export const uploadPhotos = async (req, res) => {
    const user = req.session.emailUser
    const idDocument = req.cookies.idDocument;
    const find = await getDocumentById(idDocument);
    let documentName;
    let documentReference;
    //-----------------------------
    let documentName2
    let documentReference2
    //-----------------------------
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
    //----------------
    const dataDocument = [user, documentName, documentReference, ultimoValor, condicionalLength,
        documentName2, documentReference2, ultimoValor2, condicionalLength2]
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