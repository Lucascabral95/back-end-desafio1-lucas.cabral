import mongoose from "mongoose"

const ticketsSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_dateTime: String,
    amount: Number,
    purchaser: String
})

export const ticketModel = mongoose.model("tickets", ticketsSchema)