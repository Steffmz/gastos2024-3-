//variables para los selectores

const formulario = document.getElementById('agregar-gasto');
const listadog = document.getElementById('#gastos ul');

//creacion de  eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded',preguntarpresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


//crear la clase principal
class Presupuesto
{
    constructor(presupuesto)
    {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    
    }

    nuevoGasto(gasto){
        this.gastos =  [...this.gastos, gasto];
        this.calcularRestante()

    }

    calcularRestante(){
        
    }
}
//clase que maneja la interfaz de usuario
class UI
{
    insertarpresupuesto(cantidad){
        document.querySelector('#total').textContent = cantidad.presupuesto;
        document.querySelector('#restante').textContent  = cantidad.presupuesto;

    }
    ImprimirAlerta(mensaje,tipo){

        //crear el div
        const divmensaje  = document.createElement('div');
        divmensaje.classList.add('text-center','alert');

        //si es de tipo error se debe agregar a la clase
        if(tipo === 'error'){
            divmensaje.classList.add('alert-danger');
        }else{
            divmensaje.classList.add('alert-primary');
        }
        //mensaje de error
        divmensaje.textContent = mensaje;
        //inseertar en el DOM
        const contenidoPrincipal = document.querySelector('.contenido-gastos');
        contenidoPrincipal.insertBefore(divmensaje,formulario)

        //programar el tiempo que dura la alerta
        setTimeout(() => {
            document.querySelector('.contenido-principal .alert').remove();
        },3000);
        
 }

//insertar el gasto en la lista
agregarGastoListado(gasto){

}

}

//crear un objeeto de la clase ui
const ui = new UI();
let presupuesto;


function preguntarpresupuesto(){
    const valorpre  = prompt('ingrese un presupuesto');

    //validar lo  ingresado por el usuario
    if (valorpre === '' || isNaN(valorpre) || valorpre === null || valorpre <= 0) 
        {
            window.location.reload();
        }
        //presupuesto es valido
        presupuesto  = new Presupuesto(valorpre);

    console.log(valorpre);
    //mostrar en el html el valor del presupuesto ingresado
    ui.insertarpresupuesto(presupuesto);
}
//leer lo registrado en el formulario
function agregarGasto(e){
    e.preventDefault();

    //definir las variables del formulario
     const Nombre  = document.querySelector('#gasto').value;
     const Valor = Number(document.querySelector('#cantidad').value);

     //validar los campos del formulario
     if (Nombre === '' || Valor === ''){

        ui.ImprimirAlerta('Ambos campos son  obligatorios', 'error');
        //return;
     
     }else if(Valor < 0 || isNaN(Valor)){
        ui.ImprimirAlerta('El valor del gasto no puede ser negativo', 'error');
     }
}