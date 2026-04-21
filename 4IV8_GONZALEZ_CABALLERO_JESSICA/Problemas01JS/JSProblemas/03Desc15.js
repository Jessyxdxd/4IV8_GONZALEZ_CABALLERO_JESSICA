function calcular() {

    let compra = document.getElementById("compra").value;
    let error = document.getElementById("error");
    let resultado = document.getElementById("resultado");

    error.innerHTML = "";
    resultado.innerHTML = "";

    // Expresión regular 
    let regex = /^[0-9]+(\.[0-9]+)?$/;

    // Validaciones
    if (compra === "") {
        error.innerHTML = "El campo no puede estar vacío";
        return;
    }

    if (!regex.test(compra)) {
        error.innerHTML = "Solo se permiten números válidos";
        return;
    }

    compra = parseFloat(compra);

    if (compra <= 0) {
        error.innerHTML = "El monto debe ser mayor a 0";
        return;
    }

    // Cálculos
    let descuento = compra * 0.15;
    let total = compra - descuento;

    resultado.innerHTML =
        "Total de compra: $" + compra.toFixed(2) + "<br>" +
        "Descuento (15%): $" + descuento.toFixed(2) + "<br>" +
        "Total a pagar: $" + total.toFixed(2);
}