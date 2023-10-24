// DTO PARA TODOS LOS TICKETS GENERADOS HASTA EL MOMENTO
export class TicketDTO {
    
    constructor({ _id, code, amount, purchase_dateTime, purchaser, total, ultimoValor, referenceLength, tid }) {
        this._id = _id
        this.code = code
        this.purchase_dateTime = purchase_dateTime
        this.amount = amount
        this.purchaser = purchaser,
        this.total = total 
        this.ultimoValor = ultimoValor 
        this.referenceLength = referenceLength
        this.tid = tid  
    }
}

// DTO PARA EL ULTIMO TICKET DE LA SESSION ACTUAL
export class TicketCurrentDTO {
    
    constructor({ _id, code, amount, purchase_dateTime, purcharser }) {
        this._id = _id
        this.code = code
        this.purchase_dateTime = purchase_dateTime
        this.amount = amount
        this.purchaser = purcharser
    }
}
