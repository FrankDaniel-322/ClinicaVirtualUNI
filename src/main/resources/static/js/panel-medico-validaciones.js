// ============================================
// VALIDACIONES PARA PANEL MÉDICO
// ============================================

let consultasPendientes = [];
let consultasFiltradas = [];
let consultasHistorial = [];
let consultasHistorialFiltradas = [];

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    cargarDatosMedico();
    cargarConsultasPendientes();
    cargarEstadisticas();
});

// === CARGAR DATOS MÉDICO ===
async function cargarDatosMedico() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.nombreCompleto) {
            document.getElementById('medicoNombre').textContent = userData.nombreCompleto;
        }

        // Cargar perfil completo del médico
        const perfil = await apiCall('/medicos/perfil');
        document.getElementById('medicoEspecialidad').textContent = perfil.especialidad || 'Medicina General';

    } catch (error) {
        console.error('Error cargando datos del médico:', error);
    }
}

// === CARGAR CONSULTAS PENDIENTES ===
async function cargarConsultasPendientes() {
    try {
        consultasPendientes = await apiCall('/consultas/medico/pendientes');
        consultasFiltradas = [...consultasPendientes];
        mostrarConsultasPendientes();
    } catch (error) {
        console.error('Error cargando consultas pendientes:', error);
        mostrarError('Error al cargar las consultas pendientes');
    }
}

// === CARGAR HISTORIAL ===
async function cargarHistorialConsultas() {
    try {
        consultasHistorial = await apiCall('/medicos/historial');
        consultasHistorialFiltradas = [...consultasHistorial];
        mostrarHistorialConsultas();
    } catch (error) {
        console.error('Error cargando historial:', error);
        mostrarError('Error al cargar el historial');
    }
}

// === MOSTRAR CONSULTAS PENDIENTES ===
function mostrarConsultasPendientes() {
    const lista = document.getElementById('listaConsultasPendientes');

    if (consultasFiltradas.length === 0) {
        lista.innerHTML = `
            <div class="sin-consultas">
                <div class="icono">🎉</div>
                <h3>¡No hay consultas pendientes!</h3>
                <p>Todas las consultas han sido respondidas.</p>
            </div>
        `;
        return;
    }

    let html = '';

    consultasFiltradas.forEach(consulta => {
        const fecha = new Date(consulta.fechaSolicitud);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');

        html += `
            <div class="consulta-row">
                <div><strong>${fechaFormateada}</strong></div>
                <div>${consulta.pacienteNombre}</div>
                <div>${acortarTexto(consulta.motivoConsulta, 40)}</div>
                <div>${consulta.especialidadNombre}</div>
                <div>
                    <span class="estado-badge estado-${consulta.urgencia.toLowerCase()}">
                        ${consulta.urgencia === 'URGENTE' ? 'Urgente' : 'Normal'}
                    </span>
                </div>
                <div>
                    <button class="btn-responder" onclick="responderConsulta(${consulta.id})">
                        Responder
                    </button>
                </div>
            </div>
        `;
    });

    lista.innerHTML = html;
}

// === MOSTRAR HISTORIAL ===
function mostrarHistorialConsultas() {
    const lista = document.getElementById('listaConsultasHistorial');

    if (consultasHistorialFiltradas.length === 0) {
        lista.innerHTML = `
            <div class="sin-consultas">
                <div class="icono">📊</div>
                <h3>No hay consultas en tu historial</h3>
                <p>Las consultas que respondas aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    let html = '';

    consultasHistorialFiltradas.forEach(consulta => {
        const fecha = new Date(consulta.fechaSolicitud);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');

        html += `
            <div class="consulta-row">
                <div><strong>${fechaFormateada}</strong></div>
                <div>${consulta.pacienteNombre}</div>
                <div>${acortarTexto(consulta.motivoConsulta, 40)}</div>
                <div>${consulta.especialidadNombre}</div>
                <div>
                    <span class="estado-badge estado-${consulta.urgencia.toLowerCase()}">
                        ${consulta.urgencia === 'URGENTE' ? 'Urgente' : 'Normal'}
                    </span>
                </div>
                <div>
                    <button class="btn-editar" onclick="editarRespuesta(${consulta.id})">
                        Editar
                    </button>
                </div>
            </div>
        `;
    });

    lista.innerHTML = html;
}

// === FILTRAR CONSULTAS ===
function filtrarConsultas() {
    const filtroUrgencia = document.getElementById('filtroUrgencia').value;

    consultasFiltradas = consultasPendientes.filter(consulta => {
        if (filtroUrgencia && consulta.urgencia !== filtroUrgencia) {
            return false;
        }
        return true;
    });

    mostrarConsultasPendientes();
}

// === FILTRAR HISTORIAL ===
function filtrarHistorial() {
    const filtroFecha = document.getElementById('filtroFechaHistorial').value;

    consultasHistorialFiltradas = consultasHistorial.filter(consulta => {
        if (filtroFecha) {
            const fechaConsulta = new Date(consulta.fechaSolicitud);
            const fechaFiltro = new Date(filtroFecha + '-01');

            if (fechaConsulta.getFullYear() !== fechaFiltro.getFullYear() ||
                fechaConsulta.getMonth() !== fechaFiltro.getMonth()) {
                return false;
            }
        }
        return true;
    });

    mostrarHistorialConsultas();
}

// === LIMPIAR FILTROS ===
function limpiarFiltros() {
    document.getElementById('filtroUrgencia').value = '';
    consultasFiltradas = [...consultasPendientes];
    mostrarConsultasPendientes();
}

function limpiarFiltrosHistorial() {
    document.getElementById('filtroFechaHistorial').value = '';
    consultasHistorialFiltradas = [...consultasHistorial];
    mostrarHistorialConsultas();
}

// === CAMBIAR PESTAÑA ===
function cambiarTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`.tab[onclick="cambiarTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'historial') {
        cargarHistorialConsultas();
    }
}

// === RESPONDER CONSULTA ===
function responderConsulta(idConsulta) {
    window.location.href = `responder-consulta.html?id=${idConsulta}`;
}

// === EDITAR RESPUESTA ===
function editarRespuesta(idConsulta) {
    window.location.href = `editar-respuesta.html?id=${idConsulta}`;
}

// === CARGAR ESTADÍSTICAS ===
async function cargarEstadisticas() {
    try {
        const estadisticas = await apiCall('/medicos/estadisticas');

        document.getElementById('statPendientes').textContent = consultasPendientes.length;
        document.getElementById('statRespondidas').textContent = estadisticas.consultasCompletadas || 0;
        document.getElementById('statTotal').textContent = estadisticas.totalConsultas || 0;
        document.getElementById('statUrgentes').textContent = estadisticas.consultasUrgentes || 0;

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// === CERRAR SESIÓN ===
function cerrarSesionMedico() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
}

// === FUNCIÓN AUXILIAR ===
function acortarTexto(texto, longitud) {
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
}