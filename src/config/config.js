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
    key_mongoStore: process.env.KEY_SECRET_MONGOSTORE,
    persitencia: process.env.PERSITENCE,
    loggers: process.env.LOGGER_ENV,
    email_nodemailer: process.env.USER_EMAIL,
    pass_nodemailer: process.env.EMAIL_PASS,
    key_stripe: process.env.KEY_STRIPE,
    url_environment: process.env.URL_ENVIRONMENT
}