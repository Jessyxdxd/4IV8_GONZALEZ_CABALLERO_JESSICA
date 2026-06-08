function calcular() {

    let anio = document.getElementById("anio").value;
    let error = document.getElementById("error");
    let resultado = document.getElementById("resultado");

    error.innerHTML = "";
    resultado.innerHTML = "";

    let regex = /^[0-9]{4}$/; // exactamente 4 dígitos

    // Validar vacío
    if (anio === "") {
        error.innerHTML = "El campo no puede estar vacío";
        return;
    }

    // Validar formato
    if (!regex.test(anio)) {
        error.innerHTML = "Ingresa un año válido (4 dígitos)";
        return;
    }

    anio = parseInt(anio);

    let actual = new Date().getFullYear();

    // Validar rango lógico
    if (anio > actual) {
        error.innerHTML = "El año no puede ser del futuro";
        return;
    }

    if (anio < 1900) {
        error.innerHTML = "Ingresa un año válido";
        return;
    }

    // Cálculo
    let edad = actual - anio;

    resultado.innerHTML = "Tu edad es: " + edad + " años";
}