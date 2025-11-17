// ============================================
// VALIDACIONES PARA SOLICITUD DE CONSULTA
// ============================================

let datosConsulta = {};
let sintomasSeleccionados = [];

const sintomas = [
    "Fiebre", "Dolor de cabeza", "Tos", "Dolor de garganta",
    "Congestión nasal", "Dificultad para respirar", "Fatiga",
    "Dolor muscular", "Pérdida del olfato", "Pérdida del gusto",
    "Náuseas", "Vómitos", "Diarrea", "Dolor abdominal",
    "Dolor en el pecho", "Mareos", "Erupciones cutáneas"
];

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    cargarSintomas();
});

// === FUNCIÓN PARA CARGAR SÍNTOMAS ===
function cargarSintomas() {
    const container = document.getElementById('sintomasContainer');
    if (!container) {
        console.error('No se encontró el contenedor de síntomas');
        return;
    }

    container.innerHTML = '';

    sintomas.forEach(sintoma => {
        const btn = document.createElement('div');
        btn.className = 'sintoma-btn';
        btn.textContent = sintoma;
        btn.onclick = function () {
            this.classList.toggle('selected');

            if (this.classList.contains('selected')) {
                sintomasSeleccionados.push(sintoma);
            } else {
                sintomasSeleccionados = sintomasSeleccionados.filter(s => s !== sintoma);
            }
            console.log('Síntomas seleccionados:', sintomasSeleccionados);
        };
        container.appendChild(btn);
    });
}

// === IR A CONFIRMACIÓN (PASO 2) ===
function irAConfirmacion() {
    // Validar campos requeridos
    const especialidad = document.getElementById('especialidad').value;
    const motivo = document.getElementById('motivo').value.trim();

    if (!especialidad) {
        mostrarError('Por favor seleccione una especialidad');
        return;
    }

    if (!motivo) {
        mostrarError('Por favor describa el motivo de la consulta');
        return;
    }

    if (motivo.length < 10) {
        mostrarError('El motivo de la consulta debe tener al menos 10 caracteres');
        return;
    }

    // Validar síntomas
    if (sintomasSeleccionados.length === 0) {
        mostrarError('Por favor seleccione al menos un síntoma');
        return;
    }

    // Guardar datos
    datosConsulta = {
        especialidadId: parseInt(especialidad),
        motivoConsulta: motivo,
        antecedentes: document.getElementById('antecedentes').value,
        sintomas: [...sintomasSeleccionados],
        urgencia: 'NORMAL'
    };

    // Mostrar resumen
    mostrarResumen();

    // Cambiar a paso 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.querySelector('[data-step="1"]').classList.remove('active');
    document.querySelector('[data-step="2"]').classList.add('active');
}

// === MOSTRAR RESUMEN ===
function mostrarResumen() {
    const resumenHTML = `
        <p><strong>Especialidad:</strong> Medicina General</p>
        <p><strong>Motivo:</strong> ${datosConsulta.motivoConsulta}</p>
        <p><strong>Síntomas:</strong> ${datosConsulta.sintomas.join(', ')}</p>
        <p><strong>Antecedentes:</strong> ${datosConsulta.antecedentes || 'No especificados'}</p>
        <p><strong>Archivos adjuntos:</strong> ${document.getElementById('archivos').files.length > 0 ? document.getElementById('archivos').files.length + ' archivo(s)' : 'Ninguno'}</p>
        <p><strong>Fecha de envío:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
    `;

    document.getElementById('resumenCita').innerHTML = resumenHTML;
}

// === VOLVER A DATOS ===
function volverADatos() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.querySelector('[data-step="2"]').classList.remove('active');
    document.querySelector('[data-step="1"]').classList.add('active');
}

// === RESERVAR CITA ===
async function reservarCita() {
    if (!document.getElementById('confirmacion').checked) {
        mostrarError('Debe aceptar los términos del servicio');
        return;
    }

    try {
        const response = await apiCall('/consultas', {
            method: 'POST',
            body: datosConsulta
        });

        mostrarExito('✅ Consulta enviada correctamente');

        setTimeout(() => {
            window.location.href = 'dashboard-paciente.html';
        }, 2000);

    } catch (error) {
        mostrarError('Error al enviar la consulta: ' + error.message);
    }
}