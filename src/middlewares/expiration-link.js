export const compraHecha = async (req, res, next) => {
    if (req.session.compraHecha) {
        next()
    } else {
        res.redirect("/home-mongodb")
    }
}