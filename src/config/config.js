import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT,
    key_jwt: process.env.KEY_SECRET,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackUrl: process.env.CALLBACKURL,
    mongo_atlas: process.env.CONNECTION_MONGOATLAS,
    mongoStore: process.env.MONGOSTORE,
    key_mongoStore: process.env.KEY_SECRET_MONGOSTORE
}