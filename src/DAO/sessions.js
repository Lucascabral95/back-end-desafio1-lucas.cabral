// import mongoose from "mongoose"
import { userModel } from "./models/user.js"

export const getAll = async () => {
    let result
    try {
        result = await userModel.find()
    } catch (error) {
        console.log(error);
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
        throw error;
    }
}

export const createUser = async (user) => {
    let result
    try {
        result = await userModel.create(user)
    } catch (error) {
        console.log(error);
    }
    return result
}