// ============================================
// VALIDACIONES PARA RESPONDER CONSULTA
// ============================================

let consultaActual = null;

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    cargarDatosConsulta();
    configurarFechaMinima();
});

// === CARGAR DATOS DE LA CONSULTA ===
async function cargarDatosConsulta() {
    const urlParams = new URLSearchParams(window.location.search);
    const idConsulta = urlParams.get('id');

    if (!idConsulta) {
        mostrarError('No se especificó la consulta a responder');
        volverAlPanel();
        return;
    }

    try {
        consultaActual = await apiCall(`/consultas/${idConsulta}`);
        mostrarInformacionConsulta();
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
    
    // Calcular edad si está disponible la fecha de nacimiento
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    document.getElementById('infoEspecialidad').textContent = consultaActual.especialidadNombre;
    document.getElementById('infoArchivos').textContent = consultaActual.archivosAdjuntos ? 'Sí' : 'No hay archivos';
    document.getElementById('infoMotivo').textContent = consultaActual.motivoConsulta;
}

// === ENVIAR RESPUESTA ===
async function enviarRespuesta(event) {
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
        const respuestaDTO = {
            diagnostico: diagnostico,
            recomendaciones: recomendaciones,
            medicamentosRecetados: medicamentos || null,
            proximoControl: proximoControl || null,
            archivoReceta: document.getElementById('archivoReceta').files.length > 0
        };

        const response = await apiCall(`/consultas/${consultaActual.id}/responder`, {
            method: 'POST',
            body: respuestaDTO
        });

        mostrarExito('✅ Respuesta médica enviada correctamente');

        setTimeout(() => {
            window.location.href = 'panel-medico.html';
        }, 2000);

    } catch (error) {
        mostrarError('Error al enviar la respuesta: ' + error.message);
    }
}

// === VOLVER AL PANEL ===
function volverAlPanel() {
    window.location.href = 'panel-medico.html';
}

// === CONFIGURAR FORMULARIO ===
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formRespuesta');
    if (form) {
        form.addEventListener('submit', enviarRespuesta);
    }
});