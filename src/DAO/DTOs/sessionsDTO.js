export default class UserDTO {
    constructor({ first_name, last_name, email, age, password, role }) {
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.age = age
        this.password = password
        this.role = role
    }
}