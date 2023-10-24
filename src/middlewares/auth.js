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
        const email = req.session.emailUser
        const data = [
            email,
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4]
        ]
        res.render("lockUser", { rol: data })
    }
}

export const accessDeniedAdmin = async (req, res, next) => {
    if (req.session.rol === "Usuario") {
        next()
    } else {
        const data = [
            req.session.dataSubHeader[0],
            req.session.dataSubHeader[1],
            req.session.dataSubHeader[2],
            req.session.dataSubHeader[3],
            req.session.dataSubHeader[4],
            req.session.dataSubHeader[5]
        ]
        res.render("lockAdmin", { data: data })
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

// MIDDLEWARE ANTI USUARIOS DE GITHUB
export const accessDeniedforGithub = async (req, res, next) => {
    if (req.session.emailUser.last_name === "Usuario de Github") {
        return res.status(403).send("Acceso denegado para Usuarios de Github");
    } else {
        next();
    }
}
