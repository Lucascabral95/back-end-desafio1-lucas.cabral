export const auth = (req, res, next) => {
    if (req.session.emailUser) {
        next()
    } else {
        res.redirect("/api/session/login")
    }
}

export const authDenied  = async (req, res, next) => {
    if (req.session.emailUser) {
        res.render("noAutorizado", {})
    } else {
        next()
    }
}
