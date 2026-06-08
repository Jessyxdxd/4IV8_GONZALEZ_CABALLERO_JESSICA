// ============================================================
// PRÁCTICA 3 - PNT: Frontend para Sistema de Compras
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');
const URL_BACKEND = 'http://localhost:3000';

async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = `${URL_BACKEND}${url}`;
    apiCodigo.className = 'badge badge-neutral';

    try {
        const respuesta = await fetch(`${URL_BACKEND}${url}`, opciones); 
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

const swalEstilo = Swal.mixin({
    background: '#2A233D',
    color: '#F5EDF7',
    confirmButtonColor: '#EB92A6',
    cancelButtonColor: '#C09983',
    customClass: {
        popup: 'borde-magico' 
    }
});


function mostrarNotificacion(mensaje, tipo) {
    
    let iconoSwal = 'success'; 
    let tituloSwal = '¡Logrado!';

    if (tipo === 'error') {
        iconoSwal = 'error';
        tituloSwal = 'Hubo un problema';
    } else if (tipo === 'advertencia' || tipo === 'warning') {
        iconoSwal = 'warning';
        tituloSwal = 'Atención';
    }

    swalEstilo.fire({
        title: tituloSwal,
        text: mensaje,
        icon: iconoSwal,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}


function archivoABase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.readAsDataURL(archivo);
        lector.onload = () => resolve(lector.result.split(',')[1]);
        lector.onerror = error => reject(error);
    });
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

const formUsuario = document.getElementById('form-usuario');
const inputUsuarioId = document.getElementById('usuario-id');
const inputUsuarioNombre = document.getElementById('usuario-nombre');
const inputUsuarioEmail = document.getElementById('usuario-email');
const formTituloUsuario = document.getElementById('form-titulo-usuario');
const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
const btnCancelarUsuario = document.getElementById('btn-cancelar-usuario');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const cargaUsuarios = document.getElementById('carga-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const errorUsuarioNombre = document.getElementById('error-usuario-nombre');
const errorUsuarioEmail = document.getElementById('error-usuario-email');

async function cargarUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        cargaUsuarios.style.display = 'none';

        if (resp.data.length === 0) {
            tablaUsuarios.style.display = 'none';
            cargaUsuarios.textContent = 'No hay usuarios registrados.';
            cargaUsuarios.style.display = 'block';
        } else {
            tablaUsuarios.style.display = 'table';
            tbodyUsuarios.innerHTML = '';
            resp.data.forEach(u => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${u.id}</td>
                    <td>${escapeHtml(u.nombre)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>
                        <button class="btn-ver" onclick="verComprasUsuario(${u.id})">Compras</button>
                        <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarUsuario(${u.id}, '${escapeHtml(u.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyUsuarios.appendChild(fila);
            });
        }
        contadorUsuarios.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error');
    }
}

function validarFormUsuario() {
    let ok = true;
    const nombre = inputUsuarioNombre.value.trim();
    const email = inputUsuarioEmail.value.trim();

    if (!nombre || nombre.length < 2) {
        errorUsuarioNombre.textContent = 'Mínimo 2 caracteres';
        inputUsuarioNombre.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioNombre.textContent = '';
        inputUsuarioNombre.classList.remove('input-error');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorUsuarioEmail.textContent = 'Email no válido';
        inputUsuarioEmail.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioEmail.textContent = '';
        inputUsuarioEmail.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormUsuario() {
    formUsuario.reset();
    inputUsuarioId.value = '';
    formTituloUsuario.textContent = 'Agregar Usuario';
    btnGuardarUsuario.textContent = 'Guardar';
    btnCancelarUsuario.style.display = 'none';
    errorUsuarioNombre.textContent = '';
    errorUsuarioEmail.textContent = '';
    inputUsuarioNombre.classList.remove('input-error');
    inputUsuarioEmail.classList.remove('input-error');
}

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormUsuario()) return;

    const datos = {
        nombre: inputUsuarioNombre.value.trim(),
        email: inputUsuarioEmail.value.trim()
    };
    const id = inputUsuarioId.value;

    try {
        if (id) {
            await fetchAPI(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario actualizado', 'success');
        } else {
            await fetchAPI('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario creado', 'success');
        }
        limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/usuarios/${id}`);
        inputUsuarioId.value = resp.data.id;
        inputUsuarioNombre.value = resp.data.nombre;
        inputUsuarioEmail.value = resp.data.email;
        formTituloUsuario.textContent = 'Editar Usuario';
        btnGuardarUsuario.textContent = 'Actualizar';
        btnCancelarUsuario.style.display = 'inline-block';
        cambiarSeccion('usuarios');
        formUsuario.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarUsuario(id, nombre) {
    swalEstilo.fire({
        title: '¿Eliminar usuario?',
        text: `¿Estás segura de eliminar a "${nombre}" y todas sus compras?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        toast: false,
        position: 'center'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarUsuario(id);
        }
    });
}

async function eliminarUsuario(id) {
    try {
        await fetchAPI(`/api/usuarios/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Usuario eliminado', 'success');
        if (inputUsuarioId.value === String(id)) limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios();
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

async function verComprasUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/compras/usuario/${id}`);
        const { usuario, compras, total_compras, total_gastado } = resp.data;


        let listaComprasHTML = '<ul style="text-align: left; list-style: none; padding: 0;">';
        compras.forEach(c => {
            listaComprasHTML += `<li style="margin-bottom: 5px;">🔮 <b>${c.producto}</b> x${c.cantidad} = <span style="color: #EB92A6;">$${parseFloat(c.total).toFixed(2)}</span></li>`;
        });
        listaComprasHTML += '</ul>';

        swalEstilo.fire({
            title: `Historial de ${escapeHtml(usuario.nombre)}`,
            html: `
                <div style="margin-bottom: 15px;">
                    <p><b>Compras registradas:</b> ${total_compras}</p>
                    <p><b>Total gastado:</b> <span style="color: #FFF6C1; font-size: 1.2em;">$${total_gastado}</span></p>
                </div>
                <hr style="border-color: #3d3556; margin: 15px 0;">
                ${compras.length > 0 ? listaComprasHTML : '<p>No registra compras aún.</p>'}
            `,
            icon: 'info',
            toast: false,
            position: 'center',
            confirmButtonText: 'Entendido'
        });

    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarUsuario.addEventListener('click', limpiarFormUsuario);


// ============================================================
// 3. MÓDULO DE PRODUCTOS
// ============================================================
const formProducto = document.getElementById('form-producto');
const inputProductoId = document.getElementById('producto-id');
const inputProductoNombre = document.getElementById('producto-nombre');
const inputProductoPrecio = document.getElementById('producto-precio');
const formTituloProducto = document.getElementById('form-titulo-producto');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');
const tbodyProductos = document.getElementById('tbody-productos');
const tablaProductos = document.getElementById('tabla-productos');
const cargaProductos = document.getElementById('carga-productos');
const contadorProductos = document.getElementById('contador-productos');
const errorProductoNombre = document.getElementById('error-producto-nombre');
const errorProductoPrecio = document.getElementById('error-producto-precio');

async function cargarProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        cargaProductos.style.display = 'none';

        if (resp.data.length === 0) {
            tablaProductos.style.display = 'none';
            cargaProductos.textContent = 'No hay productos registrados.';
            cargaProductos.style.display = 'block';
        } else {
            tablaProductos.style.display = 'table';
            tbodyProductos.innerHTML = '';
            resp.data.forEach(p => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${escapeHtml(p.nombre)}</td>
                    <td>$${parseFloat(p.precio).toFixed(2)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarProducto(${p.id}, '${escapeHtml(p.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyProductos.appendChild(fila);
            });
        }
        contadorProductos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar productos: ' + error.message, 'error');
    }
}

function validarFormProducto() {
    let ok = true;
    const nombre = inputProductoNombre.value.trim();
    const precio = inputProductoPrecio.value;

    if (!nombre || nombre.length < 2) {
        errorProductoNombre.textContent = 'Mínimo 2 caracteres';
        inputProductoNombre.classList.add('input-error');
        ok = false;
    } else {
        errorProductoNombre.textContent = '';
        inputProductoNombre.classList.remove('input-error');
    }

    if (!precio || parseFloat(precio) <= 0) {
        errorProductoPrecio.textContent = 'Precio debe ser mayor que 0';
        inputProductoPrecio.classList.add('input-error');
        ok = false;
    } else {
        errorProductoPrecio.textContent = '';
        inputProductoPrecio.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormProducto() {
    formProducto.reset();
    inputProductoId.value = '';
    formTituloProducto.textContent = 'Agregar Producto';
    btnGuardarProducto.textContent = 'Guardar';
    btnCancelarProducto.style.display = 'none';
    errorProductoNombre.textContent = '';
    errorProductoPrecio.textContent = '';
    inputProductoNombre.classList.remove('input-error');
    inputProductoPrecio.classList.remove('input-error');
}

formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormProducto()) return;

    const datos = {
        nombre: inputProductoNombre.value.trim(),
        precio: parseFloat(inputProductoPrecio.value)
    };
    const id = inputProductoId.value;

    try {
        if (id) {
            await fetchAPI(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto actualizado', 'success');
        } else {
            await fetchAPI('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto creado', 'success');
        }
        limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarProducto(id) {
    try {
        const resp = await fetchAPI(`/api/productos/${id}`);
        inputProductoId.value = resp.data.id;
        inputProductoNombre.value = resp.data.nombre;
        inputProductoPrecio.value = resp.data.precio;
        formTituloProducto.textContent = 'Editar Producto';
        btnGuardarProducto.textContent = 'Actualizar';
        btnCancelarProducto.style.display = 'inline-block';
        cambiarSeccion('productos');
        formProducto.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarProducto(id, nombre) {
    swalEstilo.fire({
        title: '¿Eliminar producto?',
        text: `¿Deseas eliminar "${nombre}"? Si tiene compras asociadas, la base de datos no lo permitirá.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        toast: false,
        position: 'center'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarProducto(id);
        }
    });
}

async function eliminarProducto(id) {
    try {
        await fetchAPI(`/api/productos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Producto eliminado', 'exito');
        if (inputProductoId.value === String(id)) limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarProducto.addEventListener('click', limpiarFormProducto);


// ============================================================
// 4. MÓDULO DE COMPRAS
// ============================================================
const formCompra = document.getElementById('form-compra');
const selectUsuario = document.getElementById('compra-usuario');
const selectProducto = document.getElementById('compra-producto');
const inputCantidad = document.getElementById('compra-cantidad');
const tbodyCompras = document.getElementById('tbody-compras');
const tablaCompras = document.getElementById('tabla-compras');
const cargaCompras = document.getElementById('carga-compras');
const contadorCompras = document.getElementById('contador-compras');
const errorCompraUsuario = document.getElementById('error-compra-usuario');
const errorCompraProducto = document.getElementById('error-compra-producto');
const errorCompraCantidad = document.getElementById('error-compra-cantidad');

async function cargarSelectUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        selectUsuario.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
        resp.data.forEach(u => {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.nombre} (${u.email})`;
            selectUsuario.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select usuarios:', error);
    }
}

async function cargarSelectProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        selectProducto.innerHTML = '<option value="">-- Seleccionar producto --</option>';
        resp.data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nombre} — $${parseFloat(p.precio).toFixed(2)}`;
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select productos:', error);
    }
}

async function cargarCompras() {
    try {
        const resp = await fetchAPI('/api/compras');
        cargaCompras.style.display = 'none';

        if (resp.data.length === 0) {
            tablaCompras.style.display = 'none';
            cargaCompras.textContent = 'No hay compras registradas.';
            cargaCompras.style.display = 'block';
        } else {
            tablaCompras.style.display = 'table';
            tbodyCompras.innerHTML = '';
            resp.data.forEach(c => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${c.id}</td>
                    <td>${escapeHtml(c.usuario_nombre)}</td>
                    <td>${escapeHtml(c.producto_nombre)}</td>
                    <td>$${parseFloat(c.producto_precio).toFixed(2)}</td>
                    <td>${c.cantidad}</td>
                    <td><b>$${parseFloat(c.total).toFixed(2)}</b></td>
                    <td>${formatearFechaHora(c.fecha_compra)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarCompra(${c.id})">Eliminar</button>
                    </td>
                `;
                tbodyCompras.appendChild(fila);
            });
        }
        contadorCompras.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar compras: ' + error.message, 'error');
    }
}

function validarFormCompra() {
    let ok = true;

    if (!selectUsuario.value) {
        errorCompraUsuario.textContent = 'Selecciona un usuario';
        selectUsuario.classList.add('input-error');
        ok = false;
    } else {
        errorCompraUsuario.textContent = '';
        selectUsuario.classList.remove('input-error');
    }

    if (!selectProducto.value) {
        errorCompraProducto.textContent = 'Selecciona un producto';
        selectProducto.classList.add('input-error');
        ok = false;
    } else {
        errorCompraProducto.textContent = '';
        selectProducto.classList.remove('input-error');
    }

    const cant = parseInt(inputCantidad.value);
    if (!cant || cant < 1) {
        errorCompraCantidad.textContent = 'Mínimo 1';
        inputCantidad.classList.add('input-error');
        ok = false;
    } else {
        errorCompraCantidad.textContent = '';
        inputCantidad.classList.remove('input-error');
    }

    return ok;
}

formCompra.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormCompra()) return;

    try {
        const resp = await fetchAPI('/api/compras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: parseInt(selectUsuario.value),
                producto_id: parseInt(selectProducto.value),
                cantidad: parseInt(inputCantidad.value)
            })
        });

        mostrarNotificacion(
            `Compra registrada: ${resp.data.usuario} compró ${resp.data.cantidad}x ${resp.data.producto} ($${resp.data.total})`,
            'exito'
        );
        formCompra.reset();
        inputCantidad.value = '1';
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarCompra(id) {
    swalEstilo.fire({
        title: '¿Anular compra?',
        text: "¿Seguro de que deseas eliminar este registro de compra?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Conservar',
        toast: false,
        position: 'center'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarCompra(id);
        }
    });
}

async function eliminarCompra(id) {
    try {
        await fetchAPI(`/api/compras/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Compra eliminada', 'exito');
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}


// ============================================================
// 4B. MÓDULO MADOKA MAGICA (CRUD COMPLETO CON IMÁGENES BLOB)
// ============================================================
const formChica = document.getElementById('form-chica');
const inputChicaId = document.getElementById('chica-id');
const inputChicaNombre = document.getElementById('chica-nombre');
const inputChicaDeseo = document.getElementById('chica-deseo');
const inputChicaArma = document.getElementById('chica-arma');
const formTituloChica = document.getElementById('form-titulo-chica');
const btnGuardarChica = document.getElementById('btn-guardar-chica');
const btnCancelarChica = document.getElementById('btn-cancelar-chica');

const formBruja = document.getElementById('form-bruja');
const inputBrujaId = document.getElementById('bruja-id');
const inputBrujaNombre = document.getElementById('bruja-nombre');
const inputBrujaNaturaleza = document.getElementById('bruja-naturaleza');
const selectChicaRival = document.getElementById('bruja-chica-id');
const formTituloBruja = document.getElementById('form-titulo-bruja');
const btnGuardarBruja = document.getElementById('btn-guardar-bruja');
const btnCancelarBruja = document.getElementById('btn-cancelar-bruja');

const tbodyChicas = document.getElementById('tbody-chicas');
const tbodyBrujas = document.getElementById('tbody-brujas');

// --- OPERACIONES CHICAS MÁGICAS ---

async function cargarChicasMagicas() {
    try {
        const resp = await fetchAPI('/api/personajes/chicas');
        tbodyChicas.innerHTML = '';
        
        // Limpiamos y dejamos el select de brujas listo para mapear las rivales
        selectChicaRival.innerHTML = '<option value="">-- Ninguna (Libre) --</option>';

        resp.data.forEach(c => {
            const imgStr = c.foto ? `data:image/png;base64,${c.foto}` : 'https://placehold.co/50';
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${c.id}</td>
                <td><img src="${imgStr}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;"></td>
                <td>${escapeHtml(c.nombre)}</td>
                <td>${escapeHtml(c.deseo)}</td>
                <td>${escapeHtml(c.arma)}</td>
                <td>
                    <button class="btn-editar" onclick="editarChica(${c.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarChica(${c.id})">Eliminar</button>
                </td>
            `;
            tbodyChicas.appendChild(fila);

            // Rellenar select dinámico de brujas
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.nombre;
            selectChicaRival.appendChild(opt);
        });
        document.getElementById('contador-chicas').textContent = resp.count;
    } catch (error) {
        console.error('Error al cargar Chicas Mágicas:', error);
    }
}

function limpiarFormChica() {
    formChica.reset();
    inputChicaId.value = '';
    formTituloChica.textContent = 'Registrar Chica Mágica';
    btnGuardarChica.textContent = 'Pactar Contrato';
    btnCancelarChica.style.display = 'none';
}

formChica.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = inputChicaId.value;
    const inputFoto = document.getElementById('chica-foto');
    let fotoBase64 = null;

    if (inputFoto.files[0]) {
        fotoBase64 = await archivoABase64(inputFoto.files[0]);
    }

    const datos = {
        nombre: inputChicaNombre.value.trim(),
        deseo: inputChicaDeseo.value.trim(),
        arma: inputChicaArma.value.trim(),
        foto: fotoBase64
    };

    try {
        if (id) {
            // Modo Edición (PUT)
            await fetchAPI(`/api/personajes/chicas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Contrato de Chica Mágica actualizado', 'exito');
        } else {
            // Modo Creación (POST)
            await fetchAPI('/api/personajes/chicas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Nuevo contrato pactado con Kyubey', 'exito');
        }
        limpiarFormChica();
        cargarChicasMagicas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarChica(id) {
    try {
        const resp = await fetchAPI(`/api/personajes/chicas/${id}`);
        inputChicaId.value = resp.data.id;
        inputChicaNombre.value = resp.data.nombre;
        inputChicaDeseo.value = resp.data.deseo;
        inputChicaArma.value = resp.data.arma;
        
        formTituloChica.textContent = 'Editar Contrato de Chica Mágica';
        btnGuardarChica.textContent = 'Actualizar Contrato';
        btnCancelarChica.style.display = 'inline-block';
        
        formChica.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

async function eliminarChica(id) {
    swalEstilo.fire({
        title: '¿Segura de romper el contrato?',
        text: "Esta Chica Mágica será borrada permanentemente del registro.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Conservar',
        toast: false, // Las confirmaciones quedan mejor en el centro
        position: 'center'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetchAPI(`/api/personajes/chicas/${id}`, { method: 'DELETE' });
                mostrarNotificacion('Chica Mágica eliminada con éxito', 'exito');
                if (inputChicaId.value === String(id)) limpiarFormChica();
                cargarChicasMagicas();
                cargarBrujas();
            } catch (error) {
                mostrarNotificacion(error.message, 'error');
            }
        }
    });
}

btnCancelarChica.addEventListener('click', limpiarFormChica);


// --- OPERACIONES BRUJAS ---

async function cargarBrujas() {
    try {
        const resp = await fetchAPI('/api/personajes/brujas');
        tbodyBrujas.innerHTML = '';
        resp.data.forEach(b => {
            const imgStr = b.foto ? `data:image/png;base64,${b.foto}` : 'https://placehold.co/50';
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${b.id}</td>
                <td><img src="${imgStr}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;"></td>
                <td>${escapeHtml(b.nombre_bruja)}</td>
                <td>${escapeHtml(b.naturaleza)}</td>
                <td><span class="badge badge-neutral">${escapeHtml(b.rival_nombre)}</span></td>
                <td>
                    <button class="btn-editar" onclick="editarBruja(${b.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarBruja(${b.id})">Eliminar</button>
                </td>
            `;
            tbodyBrujas.appendChild(fila);
        });
        document.getElementById('contador-brujas').textContent = resp.count;
    } catch (error) {
        console.error('Error al cargar Brujas:', error);
    }
}

function limpiarFormBruja() {
    formBruja.reset();
    inputBrujaId.value = '';
    formTituloBruja.textContent = 'Registrar Bruja / Laberinto';
    btnGuardarBruja.textContent = 'Invocar Bruja';
    btnCancelarBruja.style.display = 'none';
}

formBruja.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = inputBrujaId.value;
    const inputFoto = document.getElementById('bruja-foto');
    let fotoBase64 = null;

    if (inputFoto.files[0]) {
        fotoBase64 = await archivoABase64(inputFoto.files[0]);
    }

    const datos = {
        nombre_bruja: inputBrujaNombre.value.trim(),
        naturaleza: inputBrujaNaturaleza.value.trim(),
        chica_id: selectChicaRival.value || null,
        foto: fotoBase64
    };

    try {
        if (id) {
            await fetchAPI(`/api/personajes/brujas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Datos de la Bruja modificados', 'exito');
        } else {
            await fetchAPI('/api/personajes/brujas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Bruja nacida del sufrimiento e invocada', 'exito');
        }
        limpiarFormBruja();
        cargarBrujas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarBruja(id) {
    try {
        const resp = await fetchAPI(`/api/personajes/brujas/${id}`);
        inputBrujaId.value = resp.data.id;
        inputBrujaNombre.value = resp.data.nombre_bruja;
        inputBrujaNaturaleza.value = resp.data.naturaleza;
        selectChicaRival.value = resp.data.chica_id || '';
        
        formTituloBruja.textContent = 'Editar Datos de la Bruja';
        btnGuardarBruja.textContent = 'Actualizar Bruja';
        btnCancelarBruja.style.display = 'inline-block';
        
        formBruja.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

async function eliminarBruja(id) {
    swalEstilo.fire({
        title: '¿Purificar gema?',
        text: "¿Deseas destruir esta Bruja y purificar su Semilla del Sufrimiento?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, destruir',
        cancelButtonText: 'Dejar libre',
        toast: false,
        position: 'center'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetchAPI(`/api/personajes/brujas/${id}`, { method: 'DELETE' });
                mostrarNotificacion('Bruja eliminada del laberinto', 'exito');
                if (inputBrujaId.value === String(id)) limpiarFormBruja();
                cargarBrujas();
            } catch (error) {
                mostrarNotificacion(error.message, 'error');
            }
        }
    });
}

btnCancelarBruja.addEventListener('click', limpiarFormBruja);


// ============================================================
// 5. NAVEGACIÓN POR PESTAÑAS (SPA)
// ============================================================
function cambiarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.getAttribute('onclick').includes(`'${seccion}'`));
    if (tabActiva) tabActiva.classList.add('active');

    if (seccion === 'compras') {
        cargarSelectUsuarios();
        cargarSelectProductos();
        cargarCompras();
    }
    if (seccion === 'madoka') {
        cargarChicasMagicas();
        cargarBrujas();
    }
}

// ============================================================
// 6. INICIALIZACIÓN GENERAL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    cargarCompras();
    cargarSelectUsuarios();
    cargarSelectProductos();
    cargarChicasMagicas();
    cargarBrujas();
});