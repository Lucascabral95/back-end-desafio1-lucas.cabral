import { ticketModel } from "./models/ticket.model.js";

class TicketDAO {
    constructor() {
        this.model = ticketModel
    }

    getAllTickets = async () => {
        let tickets
        try {
            tickets = await this.model.find()
        } catch (error) {
            console.log("Error al obtener los tickets.");
        }
        return tickets
    }

    addTickets = async (contentTicket) => {
        try {
            const tickets = await this.model.create(contentTicket)
            console.log("Exito al crear el ticket.");
            return tickets
        } catch (error) {
            console.log("Error al agregar ticket.");
            throw error; 
        }
    }

    deleteTicketById = async (tid) => {
        let ticket
        ticket = await this.model.deleteOne({ _id: tid })
        if (ticket) {
            console.log("Exito al eliminar el ticket.");
        } else {
            console.log("Error al eliminar el ticket.");
        }
    }

    updateTicketById = async (tid, newData) => {
        try {
            let ticket = await this.model.updateOne({ _id: tid }, { newData })
            return ticket
        } catch (error) {
            throw error
        }
    }
}

export default TicketDAO

