//variables para los selectores
const formulario = document.getElementById('agregar-gasto');
const listadog = document.querySelector('#gastos ul');

//creación de eventos
eventListener();
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarpresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//clase principal de Presupuesto
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante(); //actaliza el restante cada vez que se agrega un nuevo gasto
    }

    calcularRestante() {
        const totalGastado = this.gastos.reduce((total, gasto) => total + gasto.valor, 0);
        this.restante = this.presupuesto - totalGastado;
    }

    presupuestoInsuficiente() {
        return this.restante <= 0; //verifica si el presupuesto se ha acabado
    }
}

//clase que maneja la interfaz de usuario
class UI {
    insertarpresupuesto(cantidad) {
        document.querySelector('#total').textContent = cantidad.presupuesto;
        document.querySelector('#restante').textContent = cantidad.restante;
    }

    ImprimirAlerta(mensaje, tipo) {
        const divmensaje = document.createElement('div');
        divmensaje.classList.add('text-center', 'alert');
        divmensaje.classList.add(tipo === 'error' ? 'alert-danger' : 'alert-primary');
        divmensaje.textContent = mensaje;
  
        const contenidoPrincipal = document.querySelector('.contenido-principal');
    
        //verificar si contenidoPrincipal existe
        if (contenidoPrincipal) {
            //agrega el mensaje al final del contenido principal
            contenidoPrincipal.appendChild(divmensaje);
        }
    
        //limpia la alerta después de 3 segundos
        setTimeout(() => {
            const alertElement = contenidoPrincipal.querySelector('.alert');
            if (alertElement) {
                alertElement.remove();
            }
        }, 3000);
    }
    

    agregarGastoListado(gasto) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${gasto.nombre}
            <span class="badge badge-primary badge-pill">$${gasto.valor}</span>
        `;

        //agregar al listado en el HTML
        listadog.appendChild(li);
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const restanteDiv = document.querySelector('.restante');
        
        //verifica si el presupuesto noes insuficiente
        if (presupuestoObj.presupuestoInsuficiente()) {
            this.ImprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true; //desactiva el botón
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false; //activa el botón
        }
    }
}

//crear un objeto de la clase UI
const ui = new UI();
let presupuesto;

//preguntar un presupuesto al usuario
function preguntarpresupuesto() {
    const valorpre = prompt('Ingrese un presupuesto');

    if (valorpre === '' || isNaN(valorpre) || valorpre === null || valorpre <= 0) {
        window.location.reload(); //recarga la página si el valor no es válido
    } else {
        presupuesto = new Presupuesto(valorpre);
        ui.insertarpresupuesto(presupuesto);
    }
}

// Leer lo registrado en el formulario
function agregarGasto(e) {
    e.preventDefault();
    const Nombre = document.querySelector('#gasto').value; //obtener el nombre del gasto
    const Valor = Number(document.querySelector('#cantidad').value); //obtener el valor del gasto

    if (Nombre === '' || Valor === '') {
        ui.ImprimirAlerta('Ambos campos son obligatorios', 'error'); //verifica que ambos campos estén llenos
    } else if (Valor <= 0 || isNaN(Valor)) {
        ui.ImprimirAlerta('El valor del gasto debe ser positivo', 'error'); //verifica que el valor sea positivo
    } else {
        const gasto = { nombre: Nombre, valor: Valor }; //crear un objetogasto
        
        presupuesto.nuevoGasto(gasto); //agregar el gasto al presupuesto

        ui.agregarGastoListado(gasto); //agega el gasto a la lista en UI
        ui.actualizarRestante(presupuesto.restante); //actualizar el presupuesto restante
        ui.comprobarPresupuesto(presupuesto); //si el presupuesto está agotado

        ui.ImprimirAlerta('Gasto agregado correctamente', 'exito');
        formulario.reset(); //reinicia el formulario
    }
}
