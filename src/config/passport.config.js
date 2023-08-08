import passport from "passport"
import GithubStrategy from "passport-github2"
import { createUser, getAll, getByEmail } from "../DAO/sessions.js"
import config from "../config/config.js"

const CLIENTID = config.clientId
const CLIENTSECRET = config.clientSecret
const CALLBACKURL = config.callbackUrl

const initializePassport = () => {

    passport.use("github", new GithubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: CALLBACKURL,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let userEmail = profile.emails[0].value
            let user = await getByEmail(userEmail)
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    email: userEmail,
                    password: "",
                    age: 27,
                    cart: ""
                }
                let result = await createUser(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await getByEmail(id)
        done(null, user)
    })
}

export default initializePassport
