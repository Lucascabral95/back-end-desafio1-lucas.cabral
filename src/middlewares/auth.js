import { getByEmail } from "../services/views.router.services.js"

export const auth = (req, res, next) => {
    if (req.session.emailUser) {
        next()
    } else {
        res.redirect("/api/session/login")
    }
}

export const authDenied = async (req, res, next) => {
    if (req.session.emailUser) {
        res.render("noAutorizado", {})
    } else {
        next()
    }
}

export const lockUser = async (req, res, next) => {
    if (req.session.rol === "Admin") {
        next()
    } else {
        const role = req.session.rol === "Admin" ? true : false
        res.render("lockUser", { rol: role })
    }
}

export const accessDeniedAdmin = async (req, res, next) => {
    if (req.session.rol === "Usuario") {
        next()
    } else {
        const role = req.session.rol === "Usuario" ? false : true
        res.render("lockUser", { rol: role })
    }
}

export const accessDeniedforAdmin = async (req, res, next) => {
    const email = req.session.emailUser
    const findUser = await getByEmail(email)
    const roleUser = findUser.role

    if (roleUser === "admin") {
        return res.status(403).send("Acceso denegado para administradores");
    } else {
        next()
    }
}
