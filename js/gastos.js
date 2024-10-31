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
        this.calcularRestante();
    }

    eliminarGasto(nombre) {
        this.gastos = this.gastos.filter(gasto => gasto.nombre !== nombre);
        this.calcularRestante();
    }

    calcularRestante() {
        const totalGastado = this.gastos.reduce((total, gasto) => total + gasto.valor, 0);
        this.restante = this.presupuesto - totalGastado;
    }

    presupuestoInsuficiente() {
        return this.restante <= 0;
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
        if (contenidoPrincipal) {
            contenidoPrincipal.appendChild(divmensaje);
        }

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
            ${gasto.nombre} <span class="badge badge-primary badge-pill">$${gasto.valor}</span>
            <button class="btn btn-danger btn-sm borrar-gasto">Borrar</button>
        `;

        //agregar evento al botón de borrar
        li.querySelector('.borrar-gasto').onclick = () => {
            this.eliminarGastoDOM(gasto.nombre);
        };

        listadog.appendChild(li);
    }

    eliminarGastoDOM(nombre) {
        presupuesto.eliminarGasto(nombre); //elimina el gasto de la lista en el objeto Presupuesto
        this.actualizarRestante(presupuesto.restante); //actualiza el restante
        this.comprobarPresupuesto(presupuesto); //verifica el presupuesto

        //eliminar el gasto del DOM
        const gastos = listadog.querySelectorAll('li');
        gastos.forEach(gasto => {
            if (gasto.textContent.includes(nombre)) {
                gasto.remove();
            }
        });
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        if (presupuestoObj.presupuestoInsuficiente()) {
            this.ImprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
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
        window.location.reload();
    } else {
        presupuesto = new Presupuesto(valorpre);
        ui.insertarpresupuesto(presupuesto);
    }
}

//leer lo registrado en el formulario
function agregarGasto(e) {
    e.preventDefault();
    const Nombre = document.querySelector('#gasto').value;
    const Valor = Number(document.querySelector('#cantidad').value);

    if (Nombre === '' || Valor === '') {
        ui.ImprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (Valor <= 0 || isNaN(Valor)) {
        ui.ImprimirAlerta('El valor del gasto debe ser positivo', 'error');
    } else {
        const gasto = { nombre: Nombre, valor: Valor };
        presupuesto.nuevoGasto(gasto);

        ui.agregarGastoListado(gasto);
        ui.actualizarRestante(presupuesto.restante);
        ui.comprobarPresupuesto(presupuesto);

        ui.ImprimirAlerta('Gasto agregado correctamente', 'exito');
        formulario.reset();
    }
}
