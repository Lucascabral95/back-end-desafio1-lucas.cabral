import mongoose from "mongoose";

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
    last_connection: Date,
    documents: { type: mongoose.Schema.Types.ObjectId, ref: "documents" },
    dni: Number,
    domicilio: String
});

// Método para actualizar last_connection
userSchema.methods.updateLastConnection = function () {
    const buenosAiresOffset = -3 * 60 * 60 * 1000;
    const fechaHoraActual = new Date(new Date().getTime() + buenosAiresOffset);
    const formattedDate = fechaHoraActual.toISOString().replace(/\.(\d+)Z$/, "Z");

    this.last_connection = formattedDate;
    return this.save();
};

export const userModel = mongoose.model("users", userSchema);