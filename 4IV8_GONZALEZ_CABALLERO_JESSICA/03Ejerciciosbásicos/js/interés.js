function validarn(e){
    var teclado = (document.all)?e.keyCode:e.which;
    if(teclado==8)return true;
    //creo mi expresión regular, que solo acepta numeros 
    var patron = /[0-9\d .]/;
    //comparo con una cadena de texto
    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}
function interes(){
    var valor = document.getElementById('cantidadi').value;
    var interes = parseFloat(valor);
    //10% anual
    var subtotal = interes * 0.10;
    var total = subtotal + interes;
    document.getElementById('sueldoi').value = "$ " + total;
} 
function borrar(){
    document.getElementById('sueldoi').value = " ";
    document.getElementById('cantidadi').value = " ";
}