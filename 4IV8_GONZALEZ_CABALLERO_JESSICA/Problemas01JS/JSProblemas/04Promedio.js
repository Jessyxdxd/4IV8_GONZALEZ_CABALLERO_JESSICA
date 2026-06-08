function calcular() {

    let p1 = document.getElementById("p1").value;
    let p2 = document.getElementById("p2").value;
    let p3 = document.getElementById("p3").value;
    let examen = document.getElementById("examen").value;
    let trabajo = document.getElementById("trabajo").value;

    let error = document.getElementById("error");
    let resultado = document.getElementById("resultado");

    error.innerHTML = "";
    resultado.innerHTML = "";

    let regex = /^[0-9]+(\.[0-9]+)?$/;

    // Validar vacíos
    if (p1 === "" || p2 === "" || p3 === "" || examen === "" || trabajo === "") {
        error.innerHTML = "Todos los campos son obligatorios";
        return;
    }

    // Validar números
    if (!regex.test(p1) || !regex.test(p2) || !regex.test(p3) || !regex.test(examen) || !regex.test(trabajo)) {
        error.innerHTML = "Solo se permiten números válidos";
        return;
    }

    p1 = parseFloat(p1);
    p2 = parseFloat(p2);
    p3 = parseFloat(p3);
    examen = parseFloat(examen);
    trabajo = parseFloat(trabajo);

    // Validar rango (0 a 10)
    if (p1 < 0 || p1 > 10 || p2 < 0 || p2 > 10 || p3 < 0 || p3 > 10 || examen < 0 || examen > 10 || trabajo < 0 || trabajo > 10) {
        error.innerHTML = "Las calificaciones deben estar entre 0 y 10";
        return;
    }

    // Cálculos
    let promedio = (p1 + p2 + p3) / 3;
    let final = (promedio * 0.55) + (examen * 0.30) + (trabajo * 0.15);

    resultado.innerHTML =
        "Promedio parciales: " + promedio.toFixed(2) + "<br>" +
        "Calificación final: " + final.toFixed(2);
}