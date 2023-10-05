import { documentModel } from "./models/user.js";

export class DocumentsDAO {
    constructor() {
        this.model = documentModel
    }

    getAllDocuments = async () => {
        let document
        try {
            document = await this.model.find()
        } catch (error) {
            console.log("Error al mostrar todos los documentos");
        }
        return document
    }

    getDocumentById = async (did) => {
        try {
            const document = await this.model.findById({ _id: did })
            return document
        } catch (error) {
            console.log("Error al mostrar el documento");
        }
    }
}