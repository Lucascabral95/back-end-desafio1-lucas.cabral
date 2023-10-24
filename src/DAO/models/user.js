import mongoose from "mongoose";
import moment from "moment";

const documentsSchema = new mongoose.Schema({
    documents: {
        type: [
            {
                name: String,
                reference: String,
                image: String
            }
        ]
    }
})

export const documentModel = mongoose.model("documents", documentsSchema)

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, default: "user" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    // last_connection: Date,
    last_connection: String,
    documents: { type: mongoose.Schema.Types.ObjectId, ref: "documents" },
    dni: Number,
    domicilio: String
});

userSchema.methods.updateLastConnection = function () {
    moment.locale('es');
    const fechaHora = moment().format('MMMM Do YYYY, h:mm:ss a');
    this.last_connection = fechaHora;
    return this.save();
};

export const userModel = mongoose.model("users", userSchema);