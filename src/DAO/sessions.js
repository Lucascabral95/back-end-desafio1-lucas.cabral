import { __dirname } from "../multer.js"
import { userModel } from "./models/user.js"
import moment from "moment"
import { sendMail } from "../services/nodemailer.js"

export const getAll = async () => {
    let result
    try {
        result = await userModel.find()
    } catch (error) {
        console.log(error);
    }
    return result
}

export const getByEmail = async (email) => {
    let result
    try {
        result = await userModel.findOne({ email })
        return result
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createUser = async (user) => {
    let result
    try {
        result = await userModel.create(user)
    } catch (error) {
        console.log(error);
    }
    return result
}

export const deleteUser = async (email) => {
    let result
    try {
        result = await userModel.deleteOne({ email })
        return result
    } catch (error) {
        console.log(error)
    }
}

export const updateRoleByEmail = async (email, newRole) => {
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return null;
        }
        user.role = newRole;
        await user.save();

        return user;
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        throw error;
    }
};


// FUNCION QUE ELIMINAR USUARIOS CON MAS DE 48 HORAS DE INACTIVIDAD (CUENTA DESDE LA ULTIMA VEZ QUE SE LOGUEO O DESLOGUEO)
export const filterAndDeleteUsers = async () => {
    const users = await userModel.find();
    const currentTime = moment();

    const usersToDelete = users.filter((u) => {
        if (u.email !== "adminCoder@coder.com" && u.email !== "papa@papa") {
            if (u.last_connection) {
                const fechaUltimaConexion = moment(u.last_connection, 'MMMM Do YYYY, h:mm:ss a');
                const diferenciaEnSegundos = currentTime.diff(fechaUltimaConexion, 'seconds');
                // return diferenciaEnSegundos > 60; // BORRA A TODOS EN 60 SEGUNDOS
                return diferenciaEnSegundos > 43200; // BORRA A TODOS LOS USUARIOS CON UNA INACTIVIDAD DE 12 HORAS (¡¡PROFE!! SE LO DEJO ASI PARA QUE VEA QUE FUNCIONA)
            }
            return true;
        }
        return false;
    });

    if (usersToDelete.length > 0) {
        const deletedUsers = await userModel.deleteMany({ _id: { $in: usersToDelete.map((u) => u._id) } });
        const usuariosEliminados = usersToDelete.map(u => u.email);

        for (const email of usuariosEliminados) {
            const option = {
                from: "Proyecto de Backend <lucasgamerpolar10@gmail.com>",
                to: email,
                subject: "Cuenta eliminada por inactividad",
                html: `
              <div>
                <p style="font-size: 22px">Estimado usuario ${email}: su cuenta fue eliminada por un periodo de inactividad de 1 minuto. </p>
                 
                <p style="font-size: 22px">Disculpe las molestias.</p>
              </div>
            `,
                attachments: []
            };

            const result = await sendMail(option);
            console.log(`Correo enviado a ${email}: ${result}`);
        }
        console.log("Todos los usuarios que fueron eliminados:", usuariosEliminados);
        return deletedUsers.deletedCount;
    }
    return 0
}


