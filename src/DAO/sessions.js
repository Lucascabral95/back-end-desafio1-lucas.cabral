// ESTE ES EL DAO PRINCIPAL ¡¡¡NO BORRAR!!!
import { userModel } from "./models/user.js"

export const getAll = async () => {
    let result
    try {
        result = await userModel.find()
    } catch (error) {
        console.log(error);
        // req.logger.fatal("Error al mostrar los usuarios.")
    }
    return result
}

export const getByEmail = async (email) => {
    let result
    try {
        result = await userModel.findOne({ email })
        return result
    } catch (error) {
        console.log(error);
        // req.logger.fatal("Error al encontrar usuario por su ID.")
        throw error;
    }
}

export const createUser = async (user) => {
    let result
    try {
        result = await userModel.create(user)
    } catch (error) {
        console.log(error);
        // req.logger.fatal("Error al crear usuario nuevo.")
    }
    return result
}