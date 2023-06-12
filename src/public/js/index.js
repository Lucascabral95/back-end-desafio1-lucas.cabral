// import { messagesModel } from "../../DAO/models/messages.model.js";
const socket = io();
// import MessagesManager from "../../DAO/MessagesDAO.js";
// const messages2 = new MessagesManager()


const div = document.getElementById("tabla-productos-socket");

socket.on("productos-actualizados", data => {

    const productosHTML = data.map(producto => `
    <tr>
        <th scope="row">${producto.id}</th>
        <td>${producto.title}</td>
        <td>${producto.description}</td>
        <td>${producto.code}</td>
        <td>${producto.price}</td>
        <td>${producto.stock}</td>
        <td>${producto.category}</td>
        <td>${producto.status}</td>
    </tr>
`).join('');

    div.innerHTML = `
    <div class="container">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Code</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                ${productosHTML}
            </tbody>
        </table>
    </div>
`;
})


const boton = document.getElementById("boton-eliminar");

boton.addEventListener("click", () => {
    const id = document.getElementById("id").value;
0
    socket.emit("delete-product", id);
});

// CHAT HANDLEBARS

function funcion() {
    let input = document.getElementById('miInput');
    let p = document.getElementById('miParrafo');
    const message = input.value;
  
    if (message === "") {
      return;
    } else {
            p.innerHTML += `${message}<br>`;
          input.value = "";
          socket.emit("prueba", message);
}
}

function enter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        funcion();
    }
}

