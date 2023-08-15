export class TicketDTO {
    constructor({ code, amount, purchase_dataTime, purcharser }) {
        this.code = code
        this.amount = amount
        this.purcharser = purcharser
        this.purchase_dataTime = purchase_dataTime
    }
}