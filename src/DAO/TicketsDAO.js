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

    // addTickets = async (amount, purchaser) => {
    //     try {
    //         const opciones = {
    //             timeZone: 'America/Argentina/Buenos_Aires',
    //             year: '2-digit',
    //             month: '2-digit',
    //             day: '2-digit',
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             second: '2-digit'
    //         };
    //         const fechaHoraActual = new Date();
    //         const formatoFechaHora = new Intl.DateTimeFormat('es-AR', opciones).format(fechaHoraActual);
    //         const dateTime = `'Fecha y hora:', ${formatoFechaHora}`

    //         const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //         let codigoAlfanumerico = '';
    //         for (let i = 0; i < 8; i++) {
    //             const indice = Math.floor(Math.random() * caracteres.length);
    //             codigoAlfanumerico += caracteres.charAt(indice);
    //         }

    //         const dataTicket = {
    //             code: codigoAlfanumerico,
    //             amount: amount,
    //             purchaser: purchaser,
    //             purchase_dateTime: dateTime
    //         }
    //         const tickets = await this.model.create(dataTicket)
    //         console.log("Exito al crear el ticket.");
    //         return tickets
    //     } catch (error) {
    //         console.log("Error al agregar ticket.");
    //     }
    // }
    addTickets = async (amount, purchaser) => {
        try {
            const opciones = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const fechaHoraActual = new Date();
            const formatoFechaHora = new Intl.DateTimeFormat('es-AR', opciones).format(fechaHoraActual);
    
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let codigoAlfanumerico = '';
            for (let i = 0; i < 8; i++) {
                const indice = Math.floor(Math.random() * caracteres.length);
                codigoAlfanumerico += caracteres.charAt(indice);
            }
    
            const dataTicket = {
                code: codigoAlfanumerico,
                amount: amount,
                purchaser: purchaser,
                purchase_dateTime: formatoFechaHora 
            };
    
            const ticket = await this.model.create(dataTicket);
            console.log("Exito al crear el ticket.");
            return ticket;
        } catch (error) {
            console.log("Error al agregar ticket:", error);
            throw error; 
        }
    };

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

