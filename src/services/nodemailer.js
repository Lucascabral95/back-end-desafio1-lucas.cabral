import nodemailer from "nodemailer"
import config from "../config/config.js"

const USER_EMAIL = config.email_nodemailer
const USER_PASS = config.pass_nodemailer

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: USER_EMAIL,
        pass: USER_PASS
    }
})

export const sendMail = async (option) => {
    let result = await transport.sendMail(option)
    return result
}