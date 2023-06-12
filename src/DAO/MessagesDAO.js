import { messagesModel } from "./models/messages.model.js";

class MessagesManager {
    constructor() {
        this.model = messagesModel
    }

    getMessages = async () => {
        let mensajes
        try {
            mensajes = await this.model.find()
        } catch (error) {
            console.log("Error al mostrar los mensajes");
        }
        return mensajes
    }

    addMessages = async (mensajeChat) => {
        let mensaje
        try {
            mensaje = await this.model.create(mensajeChat)
            console.log("Exito al agregar mensaje");
        } catch (error) {
            console.log("Error al agregar mensaje");
        }
    }

}

export default MessagesManager