export const auth = (req, res, next) => {
    if (req.session.emailUser) {
        next()
    } else {
        res.render("login", { status: "failed" })
    }
}

export const authDenied  = async (req, res, next) => {
    if (req.session.emailUser) {
        // res.send({ status: "error", message: "Estando autenticado no puede acceder a esta pagina" })
        res.render("noAutorizado", {})
    } else {
        next()
    }
}

