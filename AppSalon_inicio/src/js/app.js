let pagina = 1; // variable global. puedeo elegir con que pagina iniciar.

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() { // funcion que se encarga de llamar otras funciones
    mostrarServicios();
    mostrarSeccion(); // resalta el div actual segun el div que se presiona
    cambiarSeccion(); // oculta o muestra una seccion segun el tab presionado
    paginaSiguiente();// Paginacion siguiente y anterior
    paginaAnterior();
    botonesPaginador(); // comprueba la pagina actual para ocutar o mostrar la paginacion
    mostrarResumen(); // Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    nombreCita(); // almacena el nombre de la cita en el obj
    fechaCita();// almacena la fecha de la cita en el objeto
    desabilitarFechaAnterior();// desabilita dias anteriores al actual
    horaCita(); // Almacena la hora de la cita en el obj
}

function mostrarSeccion() {

    // Eliminar mostrar-seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual')
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    // Eliminar la clase de actual en el tab anterior

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

            mostrarSeccion();

            botonesPaginador(); // asi cambia tambien los botones si cambiamos desde tabs

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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id); // elimina servicio al tocarlo
    } else {
        elemento.classList.add('seleccionado'); // que cambie de color al seleccionar elemento

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent, // extrae el primer hijo del div que jusuto es el nombre
            precio: elemento.firstElementChild.nextElementSibling.textContent // el siguiente elemento al primero
        }

        agregarServicio(servicioObj); // lo agrega al volver a tocar
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); // que traiga todos los idd distintos

    console.log(cita)

}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; // copiar a rray u obj en cita.servicios
    console.log(cita)
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++; // cambia de pagina
        botonesPaginador(); // importante sinon no funca
        console.log(pagina);
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--; // cambia de pagina
        botonesPaginador();
        console.log(pagina);
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página

}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validacion de objeto
    if (Object.values(cita).includes('')) { // El objeto esta vacio
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre.'

        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen div
        resumenDiv.appendChild(noServicios); //imprime en html Faltan datos...
        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';

    // Mostrar nombreCita
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`; // innerHTML trata la cadena de texto como coddigo HTML
    // Mostrar fechaCita
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    // Mostrar horaCita
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0; // el precio total a pagar

    // Iterar sobre el array de servicios
    servicios.forEach(servicio => {
        
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P'); // nombre de servicio
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P'); // nombre de servicio
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio')

        const totalServicio = precio.split('$'); // separo por $
        cantidad += parseInt(totalServicio[1].trim()); // va sumando el precio total
        
        // Colocar texto y precio en div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita); // imprimo en html
    resumenDiv.appendChild(fechaCita); // imprimo en html
    resumenDiv.appendChild(horaCita); // imprimo en html

    resumenDiv.appendChild(serviciosCita);

    const canitdadPagar = document.createElement('P');
    canitdadPagar.classList.add('total')
    canitdadPagar.innerHTML = `<span>Total a pagar: </span> $ ${cantidad}`
    resumenDiv.appendChild(canitdadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); // que no cuente los espacios en blanco al inicio y final


        // Validacion de que nombreTexto deba tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) { // si inseta letras
            mostrarAlerta('Nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove(); // borra la alerta una vez que se escribieron mas de 3 caracs
            }
            cita.nombre = nombreTexto;
        }

    });
}

function mostrarAlerta(mensaje, tipo) {
    // Si hay alerta previa entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return; // detiene ejecucion del codigo
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insetar en HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta); // imprime en html
    console.log(alerta);

    // Eliminar alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove(); //boro ddel html

    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay(); // retorna numero del ddia del 0 al 6 (dom a sab)
        //dia.setMinutes(dia.getMinutes() + dia.getTimezoneOffset()); // para que no haya problemas por zona horaria
        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }

        // va en array para agregar mas ddidas [0,2,3] asi
        if ([1].includes(dia)) { // si se selecciona domingo (dia que no se trabaja), muestre mensaje de alerta
            e.preventDefault();
            fechaInput.value = ''; // resetea el valor dde la fecha si se ingrea uno incorrecto
            mostrarAlerta('Los lunes no tomamos turnos', 'error'); // reutilizo la funcion ya creadadd
        } else { // dia valido
            cita.fecha = fechaInput.value; // agrega la fecha validada al objeto CITA.
        }
        console.log(dia)
        //console.log(dia.toLocaleDateString('es-ES', opciones)); // convierte la fecha a le espanol
    })
}

function desabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaActual = new Date(); // fechaActual tiene la informacion del dia actual
    // new ddate incluye sus propios metodos .getDate .getMonth etc
    const year = fechaActual.getFullYear(); // traigo el anio
    const mes = fechaActual.getMonth() + 1; //porque js cuenta los meses desde 0
    const dia = fechaActual.getDay() + 1; // porque la idea es no reservar en el dia que se entra a la app

    // Formato deseado: AAAA-MM-DD para modificar el min en HTML
    const fechaDesabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
    // termario se llama, este codigo es porque sino en mesese y dias de dos digitos falla la logica
    inputFecha.min = fechaDesabilitar; // añade al html en fecha el atributo MIN con la fecha actual
}

function horaCita() { // guardo hora y agrego hora min y hora max
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':'); // split divide cadena de texto. divido horas de mins
        // en hora sol oetan guardad la hora
        if (hora[0] < 10 || hora[0] > 18) { // si las horas son <10 o >18 no aceptaremos citas en esa franja de horarios
            mostrarAlerta('Seleccione horarios entre las 10 y 18 por favor', 'error');
            setTimeout(() => {
                inputHora.value = ''; // reinicia cuandddo se pone mal el horario
            }, 3000);

        } else { // hora valida
            cita.hora = horaCita; // guardo la hora completa
        }
    })
}