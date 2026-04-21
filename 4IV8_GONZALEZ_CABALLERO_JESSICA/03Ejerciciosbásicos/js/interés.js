function validarn(e){
    var teclado = (document.all)?e.keyCode:e.which;
    if(teclado==8)return true;
    //creo mi expresión regular, que solo acepta numeros 
    var patron = /[0-9\d .]/;
    //comparo con una cadena de texto
    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}
