 function calcularInteres() {
            var capital = document.getElementById("capital").value;

            // Validación
            if (capital === "" || isNaN(capital)) {
                alert("Por favor ingresa un número válido.");
                return false;
            }

            capital = parseFloat(capital);

            // Cálculo del 2%
            var ganancia = capital * 0.02;
            var total = capital + ganancia;

            // Mostrar resultado
            document.getElementById("resultado").innerHTML =
                "Ganancia en 1 mes: $" + ganancia.toFixed(2) + "<br>Total: $" + total.toFixed(2);

            return false;
        }