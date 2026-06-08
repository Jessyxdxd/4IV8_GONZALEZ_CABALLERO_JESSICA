function calcular() {

    let hombres = document.getElementById("hombres").value;
    let mujeres = document.getElementById("mujeres").value;

    let error = document.getElementById("error");
    let resultado = document.getElementById("resultado");

    error.innerHTML = "";
    resultado.innerHTML = "";

    let regex = /^[0-9]+$/; // solo enteros

    // Validar vacíos
    if (hombres === "" || mujeres === "") {
        error.innerHTML = "Todos los campos son obligatorios";
        return;
    }

    // Validar números enteros
    if (!regex.test(hombres) || !regex.test(mujeres)) {
        error.innerHTML = "Solo se permiten números enteros";
        return;
    }

    hombres = parseInt(hombres);
    mujeres = parseInt(mujeres);

    let total = hombres + mujeres;

    if (total === 0) {
        error.innerHTML = "Debe haber al menos un estudiante";
        return;
    }

    // Cálculos
    let porcHombres = (hombres / total) * 100;
    let porcMujeres = (mujeres / total) * 100;

    resultado.innerHTML =
        "Total de estudiantes: " + total + "<br>" +
        "Hombres: " + porcHombres.toFixed(2) + "%<br>" +
        "Mujeres: " + porcMujeres.toFixed(2) + "%";
}