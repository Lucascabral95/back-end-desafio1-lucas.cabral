import passport from "passport"
import GithubStrategy from "passport-github2"
import { createUser, getAll, getByEmail } from "../DAO/sessions.js"

const initializePassport = () => {

    passport.use("github", new GithubStrategy({
        clientID: "Iv1.22d1252768890a2d",
        clientSecret: "2cb1214bc25952e71d6bc09d1e0a7461ef792d44",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
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
