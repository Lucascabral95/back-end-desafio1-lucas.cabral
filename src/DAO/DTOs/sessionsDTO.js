export default class SessionsDTO {

    constructor({ first_name, last_name, email, age, dni, domicilio, role, cart, document, last_connection }) {
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.age = age
        this.dni = dni 
        this.domicilio = domicilio 
        this.role = role
        this.cart = cart
        this.document = document
        this.last_connection = last_connection
    }
}
// export default class SessionsDTO {

//     constructor({ first_name, last_name, email, age, role, cart, document, last_connection }) {
//         this.first_name = first_name
//         this.last_name = last_name
//         this.email = email
//         this.age = age
//         this.role = role
//         this.cart = cart
//         this.document = document
//         this.last_connection = last_connection
//     }
// }