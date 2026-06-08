const formUsuario = document.getElementById('form-usuario');
const inputId = document.getElementById('id-usuario'); 
const inputNombre = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha_nacimiento');
const inputNota = document.getElementById('nota');
const formTitulo = document.getElementById('form-titulo');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const mensajeCargar = document.getElementById('mensaje-carga');
const mensajeVacio = document.getElementById('mensaje-vacio');

const API_URL = 'http://localhost:3000/api/usuarios';

const swalEstilo = Swal.mixin({
    background: '#2A233D',
    color: '#F5EDF7',
    confirmButtonColor: '#EB92A6',
    cancelButtonColor: '#C09983',
    backdrop: 'rgba(31, 26, 46, 0.8)'
});

async function cargarUsuarios() {
    try {
        mensajeCargar.style.display = 'block';
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
        const result = await respuesta.json();
        renderizarTabla(result.data);
    } catch (error) {
        mostrarNotificacion('Error al cargar los usuarios', 'error');
    }
}

function renderizarTabla(usuarios) {
    mensajeCargar.style.display = 'none';
    if (!usuarios || usuarios.length === 0) {
        mensajeVacio.style.display = 'block';
        tablaUsuarios.style.display = 'none';
        return;
    }
    mensajeVacio.style.display = 'none';
    tablaUsuarios.style.display = 'table';
    tbodyUsuarios.innerHTML = ''; 
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        const fechaFormateada = usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '';
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${fechaFormateada}</td>
            <td>${usuario.nota}</td>
            <td>
                <button class="btn-editar" onclick="prepararEdicion(${usuario.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id}, '${usuario.nombre}')">Eliminar</button>
            </td>
        `;
        tbodyUsuarios.appendChild(tr);
    });
}

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const id = inputId.value; 
    const datosUsuario = { 
        nombre: inputNombre.value.trim(), 
        fecha_nacimiento: inputFecha.value, 
        nota: parseFloat(inputNota.value) 
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? 'PUT' : 'POST';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        });
        if (!respuesta.ok) throw new Error('Error en el servidor');
        
        formUsuario.reset(); 
        inputId.value = "";
        formTitulo.innerText = "Agregar Nuevo Usuario";
        btnGuardar.innerText = "Guardar";
        btnCancelar.style.display = "none";
        mostrarNotificacion(id ? '¡Usuario actualizado!' : '¡Usuario guardado!', 'exito');
        cargarUsuarios(); 
    } catch (error) {
        mostrarNotificacion('Error al procesar la solicitud', 'error');
    }
});

async function eliminarUsuario(id, nombre) {
    const resultado = await swalEstilo.fire({
        title: '¿Estás segura?',
        text: `Vas a eliminar a ${nombre}. Esta acción es irreversible.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            mostrarNotificacion('Usuario eliminado correctamente', 'exito');
            cargarUsuarios(); 
        } catch (error) {
            mostrarNotificacion('No se pudo eliminar al usuario', 'error');
        }
    }
}

function prepararEdicion(id) {
    const fila = Array.from(tbodyUsuarios.rows).find(row => row.cells[0].innerText == id);
    if (!fila) return;
    inputId.value = id; 
    inputNombre.value = fila.cells[1].innerText;
    inputFecha.value = fila.cells[2].innerText;
    inputNota.value = fila.cells[3].innerText;
    formTitulo.innerText = "Modificar Usuario";
    btnGuardar.innerText = "Actualizar Cambios";
    btnCancelar.style.display = "inline-block"; 
}

btnCancelar.addEventListener('click', () => {
    formUsuario.reset();
    inputId.value = "";
    formTitulo.innerText = "Agregar Nuevo Usuario";
    btnGuardar.innerText = "Guardar";
    btnCancelar.style.display = "none";
});

function mostrarNotificacion(mensaje, tipo) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#2A233D',
        color: '#F5EDF7',
        iconColor: '#EB92A6'
    });
    Toast.fire({
        icon: tipo === 'exito' ? 'success' : 'error',
        title: mensaje
    });
}

document.addEventListener('DOMContentLoaded', cargarUsuarios);