// ============================================
// VALIDACIONES PARA EDITAR RESPUESTA MÉDICA
// ============================================

let consultaActual = null;

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    cargarDatosConsulta();
    configurarFechaMinima();
});

// === CARGAR DATOS DE LA CONSULTA ===
async function cargarDatosConsulta() {
    const urlParams = new URLSearchParams(window.location.search);
    const idConsulta = urlParams.get('id');

    if (!idConsulta) {
        mostrarError('No se especificó la consulta a editar');
        volverAlPanel();
        return;
    }

    try {
        consultaActual = await apiCall(`/consultas/${idConsulta}`);
        mostrarInformacionConsulta();
        cargarRespuestaActual();
    } catch (error) {
        mostrarError('Error al cargar la consulta: ' + error.message);
        volverAlPanel();
    }
}

// === CONFIGURAR FECHA MÍNIMA ===
function configurarFechaMinima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('proximoControl').min = hoy;
}

// === MOSTRAR INFORMACIÓN DE LA CONSULTA ===
function mostrarInformacionConsulta() {
    document.getElementById('infoPaciente').textContent = consultaActual.pacienteNombre;

    const edad = consultaActual.pacienteEdad || 'No especificada';
    document.getElementById('infoEdadPaciente').textContent = edad + (edad !== 'No especificada' ? ' años' : '');

    document.getElementById('infoContacto').textContent = consultaActual.pacienteContacto || 'No especificado';
    document.getElementById('infoAntecedentes').textContent = consultaActual.antecedentes || 'No especificados';

    const fechaSolicitud = new Date(consultaActual.fechaSolicitud);
    document.getElementById('infoFechaSolicitud').textContent =
        fechaSolicitud.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    document.getElementById('infoEspecialidad').textContent = consultaActual.especialidadNombre;
    document.getElementById('infoArchivos').textContent = consultaActual.archivosAdjuntos ? 'Sí' : 'No hay archivos';
    document.getElementById('infoMotivo').textContent = consultaActual.motivoConsulta;
}

// === CARGAR RESPUESTA ACTUAL ===
function cargarRespuestaActual() {
    if (consultaActual.respuestaMedica) {
        document.getElementById('diagnostico').value = consultaActual.respuestaMedica.diagnostico || '';
        document.getElementById('recomendaciones').value = consultaActual.respuestaMedica.recomendaciones || '';
        document.getElementById('medicamentos').value = consultaActual.respuestaMedica.medicamentosRecetados || '';

        if (consultaActual.respuestaMedica.proximoControl) {
            document.getElementById('proximoControl').value = consultaActual.respuestaMedica.proximoControl.split('T')[0];
        }

        // Configurar urgencia
        if (consultaActual.urgencia) {
            document.querySelector(`input[name="urgencia"][value="${consultaActual.urgencia}"]`).checked = true;
        }
    }
}

// === GUARDAR CAMBIOS ===
async function guardarCambios(event) {
    event.preventDefault();

    const diagnostico = document.getElementById('diagnostico').value.trim();
    const recomendaciones = document.getElementById('recomendaciones').value.trim();
    const medicamentos = document.getElementById('medicamentos').value.trim();
    const proximoControl = document.getElementById('proximoControl').value;
    const urgencia = document.querySelector('input[name="urgencia"]:checked').value;

    // Validaciones
    if (!diagnostico || diagnostico.length < 10) {
        mostrarError('El diagnóstico debe tener al menos 10 caracteres');
        return;
    }

    if (!recomendaciones || recomendaciones.length < 10) {
        mostrarError('Las recomendaciones deben tener al menos 10 caracteres');
        return;
    }

    try {
        // En un sistema real, aquí se llamaría a un endpoint específico para editar
        mostrarExito('Los cambios han sido guardados correctamente (simulación)');

        setTimeout(() => {
            window.location.href = 'panel-medico.html';
        }, 2000);

    } catch (error) {
        mostrarError('Error al guardar los cambios: ' + error.message);
    }
}

// === VOLVER AL PANEL ===
function volverAlPanel() {
    window.location.href = 'panel-medico.html';
}

// === CONFIGURAR FORMULARIO ===
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formRespuesta');
    if (form) {
        form.addEventListener('submit', guardarCambios);
    }
});