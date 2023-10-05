import { DocumentsDAO } from "../DAO/DocumentsDAO.js";
const document = new DocumentsDAO()

export const getAllDocuments = async () => {
    try {
        const documents = await document.getAllDocuments()
        return documents
    } catch (error) {
        console.log("Error al obtener los documentos");
    }
}

export const getDocumentById = async (did) => {
    try {
        const documents = await document.getDocumentById(did)
        return documents
    } catch (error) {
        console.log("Error al obtener el documento");
    }
}

