// Problema 1
function problema1() {
    let input = document.getElementById("p1-input").value.trim();

    if (input === "") {
        document.getElementById("p1-output").textContent = "Error: Ingresa texto";
        return;
    }

    let palabras = input.split(" ");
    let resultado = palabras.reverse().join(" ");

    document.getElementById("p1-output").textContent = resultado;
}

// Problema 2
function problema2() {
    let x = [];
    let y = [];

    for (let i = 1; i <= 5; i++) {
        let xi = parseFloat(document.getElementById("p2-x" + i).value);
        let yi = parseFloat(document.getElementById("p2-y" + i).value);

        if (isNaN(xi) || isNaN(yi)) {
            document.getElementById("p2-output").textContent = "Error: llena todos los campos";
            return;
        }

        x.push(xi);
        y.push(yi);
    }

    x.sort((a, b) => a - b);
    y.sort((a, b) => b - a);

    let producto = 0;
    for (let i = 0; i < x.length; i++) {
        producto += x[i] * y[i];
    }

    document.getElementById("p2-output").textContent = "Resultado: " + producto;
}

// Problema 3
function problema3() {
    let input = document.getElementById("p3-input").value.trim();

    if (input === "") {
        document.getElementById("p3-output").textContent = "Error: Ingresa datos";
        return;
    }

    let palabras = input.split(",");

    let maxPalabra = "";
    let max = 0;

    for (let palabra of palabras) {

        if (!/^[A-Z]+$/.test(palabra)) {
            document.getElementById("p3-output").textContent = "Error: solo mayúsculas sin espacios";
            return;
        }

        let unicos = new Set(palabra.split(""));

        if (unicos.size > max) {
            max = unicos.size;
            maxPalabra = palabra;
        }
    }

    document.getElementById("p3-output").textContent =
        maxPalabra + " con " + max + " caracteres únicos";
}