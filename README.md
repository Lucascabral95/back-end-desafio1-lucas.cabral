# back-end-desafio1-lucas.cabral
Proyecto final del Curso de Backend. Alumno: Lucas Cabral

¡Hola profe, espero que este bien! 

Datos inicio de sesion del admin: 
Email: adminCoder@coder.com
Contraseña: adminCod3r123

Acá le paso el proyecto final de backend con todos los requsitos solicitados, sumado a los todos los desafios entregables.
Le explico paso a paso todos lo aplicados: 

- Tengo una carpeta DAO donde dentro tengo: 1) un "DAO" para cada uno de los schemas para interactuar con ellos por medio de metodos. 2) Una carpeta "models" con mis 6 schemas creados: carts, messages, products, ticket, user, document. 2) DTO's para mostrar solo los valores que considero de cada schema.

- Tengo una carpeta "CONFIG" donde en un archivo tengo la Estrategia de Logueo de "GITHUB" de passport. Y tambien tengo un archivo "config.js" donde exporto todas las variables de entorno. Y un ".ENV" donde tengo el valor de todas las variables de entorno.

- Tengo una carpeta "DOCS" donde dentro aplico el Swagger para las colecciones de carts y products. Lo podes visualizar en "/api/docs"

- Tambien tengo una carpeta "MIDDLEWARES" donde dentro guardo todos los middlewares para proteger rutas privadas. Ademas, tengo un diccionario de errores en la carpeta "errors".

- Tambien, tengo una carpeta "PUBLIC" donde guardo el "styless.css", las imagenes, tanto las usadas para el proyecto, como las imagenes de perfil y de productos que suben todos mis clientes. Tambien tengo el "index.js" donde le doy funcionalidad a todas las functions onclicks y al socket.io usado para el chat ("/chat").

- Tambien, tengo una carpeta llamada "MOCKS" donde dentro exporto las funciones para renderizar la vista de los 100 productos generados gracias a @faker-js/faker. Dicha vista es posible visualizarla en "/mockingproducts"

- Tambien, tengo una carpeta "ROUTES" para separar los endpoint de manera apropiada. Dentro tengo 6 routes: 1) "cart.js" todos los endpoints relacionados a los carritos. 2) "payment.roytes.js": todos los endpoint relacionados al pago en Stripe. 3) "products.js": todos los endpoints relacinados a los productos. 4) "sessions.router.js": todos los endpoints relacionados a los logueos y deslogueos. 5) "users.router.js": todos los endpoints relacionados a los usuarios. 6) "views.routes.js": todos los endpoinst relacionados a las vistas de Handlebars.

- Tambien tengo una carpeta "CONTROLLERS" donde tengo toda la logica y renderizacion de todos los endpoints. Tengo controllers para las 6 vistas mencionadas anteriormente, se alimenta de los services de cada route.

- Tambien tengo una carpeta llamada "SERVICES" donde tengo toda la interaccion con las bases de datos para poder proveer cada Router. Estos datos son llevados a los controllers.

- Tambien tengo una carpeta "UTILS" donde exporto las funciones necesarias para poder hacer funcionar a Logger. 

- Tambien tengo una carpeta "VIEWS" donde evidentemente estan todas las vistas de Handlebars. 

- Tambien tengo una carpeta "TEST" donde tengo todo el testing. Se lo puede probar  en otra terminal con: "npm run test".

- Y despues tengo suelto APP.JS y un par mas de middlewares. 

FUNCIONES MAS IMPORTANTES DEL PROYECTO FINAL: 

1) Siendo el admin en "/API/USERS" podes visualizar en una tabla a todos los usuarios registrados y cambiarles el rol. Y abajo de todo tenes un boton rojo que te permite eliminar automaticamente a todos los usuarios con una inactividad de mas 12 horas (se lo deje en 12 horas para que vea que funciona), tambien les MANDA UN EMAIL avisandoles de la eliminacion de su cuenta.

2)  Los usuarios que completan un formulario con su dni y su domicilio en "/api/users/premium" tienen el privilegio de cambiarse a un rol "premium", que les da el beneficio de poder agregar productos a la base de datos. 

3) Los usuarios que crean productos, no los pueden agregar al carrito, pero si los pueden eliminar, solo ellos y el admin pueden hacerlo. Un producto NO puede ser eliminado por un usuario que no lo creo. 
Si el Admin elimina el producto de un usuario, automaticamente se le mandara un email avisandole que el admin elimino un producto que el agrego al ecommerce. 

4) En "/api/users/documents" un usuario puede subir fotos de perfil (se almacenara en /public/documents/profiles) y fotos de productos (se almacenara en /public/documents/products). A su vez, la ultima foto que perfil que subio sera la mostrada en la foto de usuario. 

5) Hice un sistema de reestablecimiento de contraseña en el que el usuario ingresa su email y automaticamente se le manda un email temporal de una hora en su email para que pueda cambiarla (POR FAVOR ABRIR EL LINK EN EL MISMO NAVEGADOR EN EL QUE SE ESTA NAVEGANDO, ES POR UNA CUESTION DE JWT).

6) Al realizar una compra en Stripe automaticamente se te crea un ticket de compra con todo con un 1) _id: autogenerado, 2) amount: monto total pagado, 3) Code: codigo generado al azar, 4) Purchase_datatime: hora de la compra, 5) Email del comprador. Y en ese historial de compras podes visualizar todos los tickets generados hasta el momento. 

7) Podes ingresar tanto creandote un usuario, como logueandote por Github.

8) En "/chat" podes ir a un chat exclusivo del admin. En "/apidocs" podes visualizar el swagger. En "/mockingproducts" podes ver 100 productos generados con @faker.  

¡¡¡IMPORTANTE!!! Para probar las funcionalidades del admin ingrese con estos datos:
EMAIL DEL ADMIN: adminCoder@coder.com
CONTRASEÑA DEL ADMIN: adminCod3r123

Link del deploy de Railway: https://back-end-desafio1-lucascabral-production.up.railway.app/api/session/login 

Link del repositorio de Github: https://github.com/Lucascabral95/back-end-desafio1-lucas.cabral

¡Fue un placer enorme haber coincidido en cursada con usted profe! 

¡Saludos!
Atte; Lucas Cabral 
