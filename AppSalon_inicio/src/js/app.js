let pagina = 1; // variable global. puedeo elegir con que pagina iniciar.


document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() { // funcion que se encarga de llamar otras funciones
    mostrarServicios();
    mostrarSeccion(); // resalta el div actual segun el div que se presiona
    cambiarSeccion(); // oculta o muestra una seccion segun el tab presionado
    paginaSiguiente();// Paginacion siguiente y anterior
    paginaAnterior();
}

function mostrarSeccion() {
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Resaltar tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Eliminar mostrar-seccion anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            // Agrega mostrar-seccion dodne dimos click

            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            // Eliminar la clase de actual en el tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');
            // Agregar clase actual en el nuevo tab
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');
        })
    });
}


async function mostrarServicios() { // genera codigo html de servicios
    // try catch, se usa cuando hay una parte critica de la aplicacion.
    try { //fetch api con async await
        const resultado = await fetch('./servicios.json');//a fetch hay que especificarle que tipo de respuesta
        const db = await resultado.json(); // le especifico a fetch que es un archivo json y guardo el archivo json enn db

        const { servicios } = db // de db extraigo servicios(archivo) y lo guardo en archivo var {destructuring}

        // generar html
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio; // destructuring del array y extraigo ID, NOMBRE, PRECIO -> variables creadas con la informacion.

            // ------ DOM scripting ------
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P'); // creo un parrafo por cada SERVICIO
            nombreServicio.textContent = nombre; // el nombre del servicio en html = la variable nombre de esta funcion que es extraida de la Data Base
            nombreServicio.classList.add('nombre-servicio'); // le coloco una clase de CSS

            // Generar precio de servicio
            const precioServicio = document.createElement('P'); // practicamente mismo codigo que con nombre
            precioServicio.textContent = `$ ${precio}`; // imprime $ y precio
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio, tipo como tarjetitas para cada servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id; // extraigo el id del servicio en idServicio

            // Selecciona un servicio para la cita (cambiar color etc)
            servicioDiv.onclick = seleccionarServicio; // al tocar el servicio, agarre el evento onclick. (event handler) -> al hacer click ejecuta funcion seleccionar servicio

            // Ingresar precio y nombre al DIV del servicio
            servicioDiv.appendChild(nombreServicio); // agrego el parrafo con nombre al div
            servicioDiv.appendChild(precioServicio); // lo mismo pero con el precio.

            // Pasar de consola a HTML
            document.querySelector('#servicios').appendChild(servicioDiv); // selecciono el div del html con este id e imprimo en html el div   
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV
    if (e.target.tagName === 'P') { // basicamente si toco en el parrafo, forzo a javascript a que vaya al elemento padre (div) que es el que necesito para extraer el id.
        elemento = e.target.parentElement; // al tocar en el p. la var elemento = al padre del p que es el div, etonces va de 10
    } else {
        elemento = e.target; // elemento = div
    }

    // agrego y saco la clase seleccionado a seleccionar servicio a conveniencia
    // al hacer click quita o agrega la clase seleccionado.
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado'); // que cambie de color al seleccionar elemento
    }

}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=> {
        pagina++; // cambia de pagina
        console.log(pagina);
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=> {
        pagina--; // cambia de pagina
        console.log(pagina);
    })
}