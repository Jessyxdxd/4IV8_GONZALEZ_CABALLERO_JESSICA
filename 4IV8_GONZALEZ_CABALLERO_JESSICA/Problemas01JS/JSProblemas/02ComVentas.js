function calcular() {

    let sueldo = document.getElementById("sueldo").value;
    let v1 = document.getElementById("venta1").value;
    let v2 = document.getElementById("venta2").value;
    let v3 = document.getElementById("venta3").value;

    let error = document.getElementById("error");
    let resultado = document.getElementById("resultado");

    error.innerHTML = "";
    resultado.innerHTML = "";

    // Expresión regular 
    let regex = /^[0-9]+(\.[0-9]+)?$/;

    // Validaciones
    if (sueldo === "" || v1 === "" || v2 === "" || v3 === "") {
        error.innerHTML = "Todos los campos son obligatorios";
        return;
    }

    if (!regex.test(sueldo) || !regex.test(v1) || !regex.test(v2) || !regex.test(v3)) {
        error.innerHTML = "Solo se permiten números válidos";
        return;
    }

    sueldo = parseFloat(sueldo);
    v1 = parseFloat(v1);
    v2 = parseFloat(v2);
    v3 = parseFloat(v3);

    if (sueldo <= 0 || v1 < 0 || v2 < 0 || v3 < 0) {
        error.innerHTML = "Los valores deben ser positivos";
        return;
    }

    // Cálculos
    let totalVentas = v1 + v2 + v3;
    let comision = totalVentas * 0.10;
    let total = sueldo + comision;

    resultado.innerHTML =
        "Total de ventas: $" + totalVentas.toFixed(2) + "<br>" +
        "Comisión (10%): $" + comision.toFixed(2) + "<br>" +
        "Total a recibir: $" + total.toFixed(2);
}