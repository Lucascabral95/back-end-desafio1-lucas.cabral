import config from "../src/config/config.js";
import chai from "chai";
import supertest from "supertest";
import session from "supertest-session"

const PORT = config.port
const expect = chai.expect
const requester = supertest(`http://localhost:${PORT}`)
const testSession = session(`http://localhost:${PORT}`)


describe("Testing de productos", () => {

    it("El endpoint GET /api/productsdb debe mostrar todos los elementos de la Base de Datos", async () => {
        const response = await requester.get("/api/productsdb");

        expect(response.status).to.be.eql(200); // para verificar si obtengo un status(200)
        expect(response.type).to.equal("application/json"); // para verificar que se recibe un JSON
        expect(response.body.payload.docs.length).to.be.greaterThan(0); // para asegurar que la respuesta tenga al menos un producto
        response.body.payload.docs.forEach((product) => {  // para verificar que recibo todos estos campos
            expect(product).to.have.property("_id");
            expect(product).to.have.property("title");
            expect(product).to.have.property("description");
            expect(product).to.have.property("code");
            expect(product).to.have.property("price");
            expect(product).to.have.property("stock");
            expect(product).to.have.property("category");
            expect(product).to.have.property("__v");
        });
    })

    it("La peticion POST /home-mongodb debe agregar un producto con los respectivos campos obligatorios", async () => {
        const mockProduct = {
            title: "iPhone 15",
            description: "Nuevo modelo de iPhone",
            code: "A0100",
            price: 5000000,
            stock: 100,
            category: "Electronica",
            owner: "premium"
        };

        const response = await requester.post("/home-mongodb").send(mockProduct);
        expect(response.status).to.equal(200); //verificar si me da un status 200 
        expect(response.type).to.equal("application/json"); // para verificar que se recibe un JSON
        expect(response.body.message).to.equal("Producto agragado exitosamente."); // verificar que me arroje este mensaje de exito
    });

    it("La peticion DELETE /home-mongodb/:pid debe eliminar un producto segun su _id", async () => {
        const pid = "651256a3cd43bf046cfdd672" // _id del producto a eliminar
        const response = await requester.delete(`/api/productsdb/${pid}`) // aca debes ingresar el _id de un producto de la Base de Datos

        expect(response.status).to.equal(200); //verificar si me da un status 200 
        expect(response.body.message).to.equal("Exito al eliminar el producto de la Base de Datos."); // verificar que me arroje este mensaje de exito
    })
})

describe("Testing de carritos", () => {
    it("El endpoint GET debe buscar todos los carritos de compra de la Base de Datos", async () => {
        const response = await requester.get("/api/cartsdb")

        expect(response.status).to.be.eql(200); // para verificar si obtengo un status(200)
        expect(response.type).to.equal("application/json"); // para verificar que se recibe un JSON
        expect(response.body.length).to.be.greaterThan(0); // para asegurar que la respuesta tenga al menos un producto
    })

    it("La peticion POST debe crear un carrito nuevo en la Base de Datos con un _ID autogenerado de MongoDB", async () => {
        const response = await requester.post("/api/cartsdb")

        expect(response.status).to.be.eql(200) // para verificar si obtengo un status(200)
        expect(response.body.message).to.be.equal("Exito al crear un nuevo carrito") // para verificar que recibo este mensaje de exito
    })

    it("La peticion DELETE debe eliminar todos los productos de un carrito segun su _id", async () => { //debe ingresar el _id de un carrito que contenga productos
        const idCarritoAEliminar = "64973b68ddb9692d6b2709fd" // ingresar el _id del carrito a vaciar
        const response = await requester.delete(`/api/cartsdb/${idCarritoAEliminar}`)

        expect(response.status).to.be.eql(200) // para verificar si obtengo un status(200)
        expect(response.body.message).to.be.equal("Éxito al eliminar todos los productos del carrito.") // para verificar que recibo este mensaje de exito
    })
})

describe("Testing de Login y Register", () => {
    let cookie;

    it("Debe registrar correctamente a un usuario", async () => {
        const mockUser = {
            first_name: "super",
            last_name: "test",
            email: "supertest@supertest",
            age: 30,
            password: "1234"
        }
        const response = await requester.post("/api/session/register").send(mockUser)

        expect(response.statusCode).to.be.equal(200) // verifico que la peticion me de status(200) en señal de exito
    })

    const mockUser = {
        email: "lio@lio",
        password: "lio"
    }

    it("Debe loguear correctamente a un usuario y obtener una cookie", async function () {
        const result = await testSession.post("/api/session/login").send({
            email: mockUser.email,
            password: mockUser.password
        });

        expect(result.headers).to.have.property("set-cookie");
        const cookieHeader = result.headers["set-cookie"][0];
        const cookieParts = cookieHeader.split(";")[0].split("=");
        cookie = {
            name: cookieParts[0],
            value: cookieParts[1]
        };

        expect(cookie.name).to.equal("authToken"); // verifico de llamar a la cookie "authToken" que cree
        expect(cookie.value).to.be.ok;  // verifico que la cookie.value exista y no se falsy
    });

    it("Debe enviar el token Bearer para poder ingresar a la pagina Current del usuario logueado y asegurar que el email sea el mismo con el que se logueo el usuario", async function () {
        const response = await testSession.get("/api/session/current").set("Authorization", `Bearer ${cookie.value}`);

        const cookieEmail = response.headers["set-cookie"][0]
        const setCookieEmail = cookieEmail.split(";")[0].split("=") // esto es para buscar en cookies el email con el que se ingreso
        const setSetCookieEmail = setCookieEmail[1].replace("%40", "@")  // el "%40" se usa para referirse al @, con esto, le renombro el @ que le corresponde a la cookie

        expect(response.status).to.be.eql(200); // debe dar un status success de 200 en caso de que todo salga bien 
        expect(setSetCookieEmail).to.be.eql(mockUser.email) // este email sacado de una cookie deben coincidr con el email con el que ingreso el usuario.
    });
})