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

function terminarCompra(value) {
  fetch(`/cart/${value}/purchase`, {
    method: "POST"
  })
    .then(response => {
      console.log("Primera petición POST completada");
      return fetch(`/cart/${value}/buy`, {
        method: "POST"
      });
    })
    .then(response => {
      console.log("Segunda petición POST completada");
      window.location.href = "/completed/purchase";
    })
    .catch(error => {
      console.error("Error en alguna de las peticiones:", error);
    });
}

function funcionAddToCart(value1, value2, value3, value4) {

  if (value3 !== value4) {
    fetch(`/api/cartsdb/${value2}/products/${value1}`, {
      method: "POST"
    })
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `¡Producto agregado al carrito exitosamente!`
    });
    console.log(value3, value4);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `No se puede agregar al carrito productos que vos mismo agregaste`
    });
    console.log(value3, value4);
  }
}

function notAddToCart() {
  alert("Teniedo un rol de 'Admin' no podes agregar productos al carrito")
}

function changePass() {
  const value1 = document.getElementById("emailPass1").value;
  const value2 = document.getElementById("emailPass2").value;

  if (value1 === value2) {
    fetch(`/email?email=${value1}`)
      .then(response => {
        if (response.ok) {
          alert(`¡Cambio de contraseña exitoso!`);
        } else {
          alert("¡Error en la solicitud!");
        }
      })
      .catch(error => {
        console.error("Error en la solicitud:", error);
      });
  } else if (value1 === "" || value2 === "") {
    alert(`Ambos campos son obligatorios.`);
  } else {
    alert("¡Error! Ambas contraseñas deben coincidir.");
  }
}

function recoverPassword() {
  const valueeEmail = document.getElementById("valueEmail").value;

  fetch(`/email?email=${valueeEmail}`, {
    method: "GET"
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Se ha enviado un correo de recuperación de contraseña a: ${valueeEmail}.`,
        });
        setTimeout(() => {
          window.location.href = '/generateLink';
        }, 3500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo recuperar la contraseña. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.',
      });
    });
}

function changeNo() {
  Swal.fire({
    icon: 'warning',
    title: '(?)',
    text: 'No te cambiaste de rol.',
  });
}

function changeYes(email) {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `¡Exito al cambiarte de rol!`,
  });
  fetch(`/api/users/premium/${email}`, {
    method: "POST"
  })
    .then( response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
      throw error
    })
}

// ELIMINAR PRODUCTO DEL CATALOGO SEGUND SU _ID
function deleteProductById(owner, idProduct, emailUser) {

  if (owner === emailUser || emailUser === "adminCoder@coder.com") {
    fetch(`/home-mongodb/${idProduct}/${owner}`,
      { method: 'DELETE' })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Producto con ID: ${idProduct} eliminado con exito ✅. `
        });
        window.location.href = '/home-mongodb';
        console.log(owner, idProduct, emailUser);
      })
      .catch(error => {
        alert(`Error al eliminar el producto.`)
        console.log(error);
      })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `No tenes permitido eliminar este producto. Solo el Admin y el usuario que lo creo puede eliminarlo.`
    });
    console.log(owner, idProduct, emailUser);
  }
}

function cargarFoto() {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `¡Éxito al cargar foto de perfil!`,
  });
}

function cargarFotoProducto() {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `¡Éxito al cargar foto del producto!`,
  });
}

function enviarDatos() {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `¡Éxito al agregar datos personales!`,
  });
}

function eliminar(event, email) {
  event.preventDefault

  fetch(`/api/users/${email}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `¡Éxito al elimiar el usuario ${email} !`,
        });
        setTimeout(() => {
          window.location.href = "/api/users";
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `¡Error al eliminar el usuario!`,
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// ACTUALIZAR ROL DE USUARIO
function updateRole(event) {
  event.preventDefault();
  const email = document.getElementById("emailRole").value;
  const role = document.getElementById("roleRole").value;

  const requestBody = {
    role: role
  };
  fetch(`/api/users/${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `¡Éxito al actualizar el rol de ${email} !`,
        });
        setTimeout(() => {
          window.location.href = "/api/users";
        }, 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `¡El usuario: ${email} no existe en la Base de Datos!`,
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `¡Error al actualizar el rol del usuario!`,
      });
    });
}

// ACTUALIZAR ROL DE USUARIO MEDIANTE TABLE
function updateRoleTable(event, email) {
  event.preventDefault()
  const rol = document.getElementById(email).value
  const requestBody = {
    role: rol
  };
  fetch(`/api/users/${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `¡Éxito al actualizar el rol de ${email} !`,
        });
        setTimeout(() => {
          window.location.href = "/api/users";
        }, 1500);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `¡Éxito al actualizar el rol de ${email} !`,
        });
        setTimeout(() => {
          window.location.href = "/api/users";
        }, 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `¡El usuario: ${email} no existe en la Base de Datos!`,
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `¡Error al actualizar el rol del usuario!`,
      });
    });
}

// funcion que elimina a todos los usuarios con una inactiviad de 48 horas o superior
function eliminarUsuarios() {
  fetch(`/api/users/delete`, {
    method: "GET"
  })
    .then((res) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `¡Éxito al eliminar a todos los usuarios con una actividad de 48 horas o mayor!`,
      })
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `¡Error al eliminar usuarios con dicha inactividad!`,
      });
    })
}

// AUMENTAR CANTIDAD DEL PRODUCTO EN EL CARRITO
function aumentarCantidad(value1, value2) {

  fetch(`/api/cartsdb/${value1}/products/${value2}`, {
    method: "POST"
  })
    .then(res => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: '¡Cantidad del producto aumentada exitosamente!',
      });
      setTimeout(() => {
        window.location.href = `/carts/${value1}/purchase`;
      }, 500);
    })
    .catch(error => {
      console.log(error);
    });
}

// FUNCION PARA ELIMINAR UN PRODUCTO DEL CARRITO DE COMPRAS
function eliminarDelCart(value1, value2) {
  fetch(`/api/cartsdb/${value1}/products/${value2}`, {
    method: "DELETE"
  })
    .then((res) => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: '¡Exito al eliminar el producto del carrito!',
      });
      setTimeout(() => {
        window.location.href = `/carts/${value1}/purchase`;
      }, 500);
    })
    .catch((error) => {
      console.log(error)
      throw error
    })
}

// DISMINUIR CANTIDAD DEL PRODUCTO EN EL CARRITO
function disminuirCantidad(value1, value2) {

  fetch(`/api/cartsdb/${value1}/products/${value2}/discont`, {
    method: "POST"
  })
    .then(res => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: '¡Cantidad del producto disminuida exitosamente!',
      });
      setTimeout(() => {
        window.location.href = `/carts/${value1}/purchase`;
      }, 500);
    })
    .catch(error => {
      console.log(error);
    });
}
