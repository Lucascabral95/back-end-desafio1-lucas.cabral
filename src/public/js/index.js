const socket = io();

// VISTA REALTIMEPRODUCTS.HANDLEBARS 

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

document.addEventListener('DOMContentLoaded', function () {
    let p = document.getElementById('miParrafo');
    p.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
});
// VISTA REALTIMEPRODUCTS.HANDLEBARS 

//---------------------------------------------------------------------------------------------

// FUNCION DE CHAT.HANDLEBARS QUE ES LA ENCARGADA DE DAR FUNCIONAMIENTO AL CHAT CONECTADO A MONGODB
function funcion() {
    let input = document.getElementById('miInput');
    let inputIdentificacion = document.getElementById('identificacion');
    let p = document.getElementById('miParrafo');
    const message = input.value;
    const nombreUsuario = inputIdentificacion.value
    const messageAndName = [message, nombreUsuario]

    const horaFull = new Date
    const hora = horaFull.getHours().toString().padStart(2, "0")
    const minuto = horaFull.getMinutes().toString().padStart(2, "0")
    const segundo = horaFull.getSeconds().toString().padStart(2, "0")
    const horaDefinitiva = `${hora}:${minuto}:${segundo}`

    const userSecret = nombreUsuario === "" ? "Client" : nombreUsuario

    if (message === "") {
        return;
    } else {
        p.innerHTML += `<div style="background-color: white; border-radius: 10px; margin-bottom: 10px">
        <p style="margin-left: 25px; margin-right: 25px"> ${userSecret} </p>
        <p style="margin-left: 25px; margin-right: 25px"> ${horaDefinitiva} - ${message}</p>
        </div> 
        `;
        input.value = "";
        socket.emit("prueba", messageAndName);

        p.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });


    }
}

function enter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        funcion();
    }
}
// FUNCION DE CHAT.HANDLEBARS QUE ES LA ENCARGADA DE DAR FUNCIONAMIENTO AL CHAT CONECTADO A MONGODB

//---------------------------------------------------------------------------------------------

function funcionMongo() {
    const id = document.getElementById('idMongo').value;
    
    fetch(`/home-mongodb/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'Success') {
          alert(data.message);
        } else {
          alert('Error al eliminar el producto.');
        }
      })
      .catch(error => {
        console.error(error);
        alert('Error al eliminar el producto.');
      });
  }

  function funcionAddToCart() {
    const valueProduct = document.getElementById("boton-add").value
    console.log(valueProduct);
  }
  