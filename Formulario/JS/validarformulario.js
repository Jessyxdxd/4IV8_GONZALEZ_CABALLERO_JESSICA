
function validar(formulario){
    
    if(formulario[0].value.length < 3){
        alert("Por favor, ingresa al menos 3 caracteres en el campo nombre.");
        formulario[0].focus();
        return false;
    }

    var abcOK = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜabcdefghijklmnopqrstuvwxyzáéíóúü ";
    var checkString = formulario[0].value;
    var allValid = true;

    for(var i = 0; i < checkString.length; i++){
        var caracter = checkString.charAt(i);

        var valido = false;
        for(var j = 0; j < abcOK.length; j++){
            if(caracter === abcOK.charAt(j)){
                valido = true;
                break;
            }
        }

        if(!valido){
            allValid = false;
            break;
        }
    }

    if(!allValid){
        alert("Por favor, ingresa solo letras en el campo nombre.");
        formulario[0].focus();
        return false;
    }

 
    var edad = formulario[1].value;

    if(edad === "" || isNaN(edad)){
        alert("Por favor, ingresa una edad válida.");
        formulario[1].focus();
        return false;
    }

    if(edad < 1 || edad > 120){
        alert("La edad debe estar entre 1 y 120.");
        formulario[1].focus();
        return false;
    }

    
    var email = formulario[2].value;

    if(email === ""){
        alert("Por favor, ingresa tu correo electrónico.");
        formulario[2].focus();
        return false;
    }

    
    var arroba = email.indexOf("@");
    var punto = email.lastIndexOf(".");

    if(arroba < 1 || punto < arroba + 2 || punto + 2 >= email.length){
        alert("Por favor, ingresa un email válido.");
        formulario[2].focus();
        return false;
    }

  
    alert("Formulario enviado correctamente.");
    return true;
}