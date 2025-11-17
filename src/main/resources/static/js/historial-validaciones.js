// ============================================
// VALIDACIONES PARA HISTORIAL DE CONSULTAS
// ============================================

let consultas = [];
let consultasFiltradas = [];

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    cargarConsultas();
});

// === CARGAR CONSULTAS ===
async function cargarConsultas() {
    try {
        consultas = await apiCall('/consultas/paciente');
        consultasFiltradas = [...consultas];
        mostrarConsultas();
    } catch (error) {
        console.error('Error cargando consultas:', error);
        mostrarError('Error al cargar el historial de consultas');
    }
}

// === MOSTRAR CONSULTAS ===
function mostrarConsultas() {
    const lista = document.getElementById('listaConsultas');

    if (consultasFiltradas.length === 0) {
        lista.innerHTML = `
            <div class="sin-consultas">
                <div class="icono">📋</div>
                <h3>No se encontraron consultas</h3>
                <p>No tienes consultas médicas registradas.</p>
                <button class="btn btn-primary" onclick="window.location.href='solicitar-consulta.html'" style="margin-top: 15px;">
                    Solicitar Primera Consulta
                </button>
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
                <div>${fechaFormateada}</div>
                <div>${consulta.especialidadNombre}</div>
                <div>${acortarTexto(consulta.motivoConsulta, 50)}</div>
                <div><span class="estado-badge estado-${consulta.estado.toLowerCase()}">${obtenerTextoEstado(consulta.estado)}</span></div>
                <div><button class="btn-detalles" onclick="verDetalles(${consulta.id})">Ver</button></div>
                <div>${consulta.respuestaMedica ? '<button class="btn-detalles" onclick="descargarReceta(' + consulta.id + ')">Descargar</button>' : '---'}</div>
            </div>
        `;
    });

    lista.innerHTML = html;
}

// === FILTRAR CONSULTAS ===
function filtrarConsultas() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroFecha = document.getElementById('filtroFecha').value;

    consultasFiltradas = consultas.filter(consulta => {
        // Filtro por estado
        if (filtroEstado && consulta.estado !== filtroEstado) {
            return false;
        }

        // Filtro por fecha (mes y año)
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

    mostrarConsultas();
}

// === LIMPIAR FILTROS ===
function limpiarFiltros() {
    document.getElementById('filtroEstado').value = '';
    document.getElementById('filtroFecha').value = '';
    consultasFiltradas = [...consultas];
    mostrarConsultas();
}

// === VER DETALLES ===
async function verDetalles(idConsulta) {
    try {
        const consulta = await apiCall(`/consultas/${idConsulta}`);

        const modal = document.getElementById('modalDetalles');
        const contenido = document.getElementById('modalContenido');

        const fechaSolicitud = new Date(consulta.fechaSolicitud).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let html = `
            <div class="detalle-item">
                <h4>📅 Información General</h4>
                <p><strong>Fecha de solicitud:</strong> ${fechaSolicitud}</p>
                <p><strong>Estado:</strong> <span class="estado-badge estado-${consulta.estado.toLowerCase()}">${obtenerTextoEstado(consulta.estado)}</span></p>
                <p><strong>Especialidad:</strong> ${consulta.especialidadNombre}</p>
            </div>

            <div class="detalle-item">
                <h4>📝 Motivo de la Consulta</h4>
                <p>${consulta.motivoConsulta}</p>
            </div>
        `;

        if (consulta.antecedentes) {
            html += `
                <div class="detalle-item">
                    <h4>📋 Antecedentes Relacionados</h4>
                    <p>${consulta.antecedentes}</p>
                </div>
            `;
        }

        if (consulta.sintomas && consulta.sintomas.length > 0) {
            html += `
                <div class="detalle-item">
                    <h4>🔍 Síntomas Reportados</h4>
                    <p>${consulta.sintomas.join(', ')}</p>
                </div>
            `;
        }

        if (consulta.respuestaMedica) {
            html += `
                <div class="detalle-item respuesta-medica">
                    <h4>👨‍⚕️ Respuesta Médica</h4>
                    <p><strong>Diagnóstico:</strong> ${consulta.respuestaMedica.diagnostico}</p>
                    <p><strong>Recomendaciones:</strong> ${consulta.respuestaMedica.recomendaciones}</p>
                    <p><strong>Médico:</strong> ${consulta.respuestaMedica.medicoNombre}</p>
                    <p><strong>Fecha de respuesta:</strong> ${new Date(consulta.respuestaMedica.fechaRespuesta).toLocaleDateString('es-ES')}</p>
                    ${consulta.respuestaMedica.medicamentosRecetados ? `<p><strong>Medicamentos:</strong> ${consulta.respuestaMedica.medicamentosRecetados}</p>` : ''}
                    ${consulta.respuestaMedica.proximoControl ? `<p><strong>Próximo control:</strong> ${consulta.respuestaMedica.proximoControl}</p>` : ''}
                </div>
            `;
        } else {
            html += `
                <div class="detalle-item">
                    <h4>👨‍⚕️ Respuesta Médica</h4>
                    <p><em>Esta consulta aún no tiene respuesta médica.</em></p>
                </div>
            `;
        }

        contenido.innerHTML = html;
        modal.style.display = 'flex';

    } catch (error) {
        mostrarError('Error cargando detalles: ' + error.message);
    }
}

// === DESCARGAR RECETA ===
function descargarReceta(idConsulta) {
    mostrarExito('La funcionalidad de descarga de recetas estará disponible próximamente');
}

// === CERRAR MODAL ===
function cerrarModal() {
    document.getElementById('modalDetalles').style.display = 'none';
}

// === FUNCIONES AUXILIARES ===
function obtenerTextoEstado(estado) {
    const estados = {
        'PENDIENTE': 'Pendiente',
        'COMPLETADA': 'Completada',
        'CANCELADA': 'Cancelada'
    };
    return estados[estado] || estado;
}

function acortarTexto(texto, longitud) {
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
}

// Cerrar modal al hacer click fuera
window.onclick = function (event) {
    const modal = document.getElementById('modalDetalles');
    if (event.target === modal) {
        cerrarModal();
    }
}