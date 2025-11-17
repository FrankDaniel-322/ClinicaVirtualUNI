// ============================================
// VALIDACIONES PARA PANEL DE ADMINISTRACIÓN
// ============================================

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    configurarFechasPorDefecto();
    cargarEstadisticas();
    cargarTablasResumen();
});

// === CONFIGURAR FECHAS POR DEFECTO ===
function configurarFechasPorDefecto() {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    document.getElementById('filtroFechaInicio').value = primerDiaMes.toISOString().split('T')[0];
    document.getElementById('filtroFechaFin').value = hoy.toISOString().split('T')[0];
}

// === CARGAR ESTADÍSTICAS ===
async function cargarEstadisticas() {
    try {
        const estadisticas = await apiCall('/admin/estadisticas');

        document.getElementById('statUsuarios').textContent = estadisticas.totalUsuarios || 0;
        document.getElementById('statConsultas').textContent = estadisticas.totalConsultas || 0;
        document.getElementById('statMedicos').textContent = estadisticas.totalMedicos || 0;
        document.getElementById('statPendientes').textContent = estadisticas.consultasPendientes || 0;

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        // Datos de ejemplo para desarrollo
        document.getElementById('statUsuarios').textContent = '15';
        document.getElementById('statConsultas').textContent = '8';
        document.getElementById('statMedicos').textContent = '3';
        document.getElementById('statPendientes').textContent = '2';
    }
}

// === CARGAR TABLAS DE RESUMEN ===
function cargarTablasResumen() {
    // Tabla de síntomas más comunes (datos de ejemplo)
    const sintomasEjemplo = [
        { sintoma: 'Fiebre', frecuencia: 5 },
        { sintoma: 'Dolor de cabeza', frecuencia: 4 },
        { sintoma: 'Tos', frecuencia: 3 },
        { sintoma: 'Dolor de garganta', frecuencia: 2 }
    ];

    let htmlSintomas = '';
    sintomasEjemplo.forEach(item => {
        htmlSintomas += `
            <tr>
                <td>${item.sintoma}</td>
                <td><strong>${item.frecuencia}</strong></td>
            </tr>
        `;
    });
    document.getElementById('tablaSintomas').innerHTML = htmlSintomas;

    // Tabla de estados (datos de ejemplo)
    const estadosEjemplo = [
        { estado: 'Pendiente', cantidad: 2 },
        { estado: 'Completada', cantidad: 5 },
        { estado: 'Cancelada', cantidad: 1 }
    ];

    let htmlEstados = '';
    estadosEjemplo.forEach(item => {
        htmlEstados += `
            <tr>
                <td>${item.estado}</td>
                <td><strong>${item.cantidad}</strong></td>
            </tr>
        `;
    });
    document.getElementById('tablaEstados').innerHTML = htmlEstados;
}

// === ACTUALIZAR ESTADÍSTICAS ===
function actualizarEstadisticas() {
    mostrarExito('Filtros aplicados (en un sistema real se recargarían las estadísticas)');
}

// === ACCIONES DE ADMINISTRACIÓN ===
function exportarDatos() {
    mostrarExito('📊 Datos preparados para exportación.\nEn un sistema real, se descargaría un archivo JSON o CSV.');
}

function generarReporte() {
    const totalConsultas = document.getElementById('statConsultas').textContent;
    const pendientes = document.getElementById('statPendientes').textContent;
    const completadas = parseInt(totalConsultas) - parseInt(pendientes);

    const reporte = `
        📋 REPORTE DE CLÍNICA VIRTUAL UNI
        Fecha: ${new Date().toLocaleDateString('es-ES')}

        📊 ESTADÍSTICAS GENERALES:
        • Total de consultas: ${totalConsultas}
        • Consultas completadas: ${completadas}
        • Consultas pendientes: ${pendientes}
        • Tasa de completitud: ${((completadas / totalConsultas) * 100).toFixed(1)}%

        ⚡ ACCIONES RECOMENDADAS:
        ${pendientes > 0 ? `• Hay ${pendientes} consultas pendientes de respuesta` : '• Todas las consultas han sido respondidas'}
        • Revisar especialidades con mayor demanda
        • Evaluar tiempos de respuesta médica
    `;

    alert(reporte);
}

function gestionarUsuarios() {
    mostrarExito('👥 Módulo de Gestión de Usuarios\n\nEn un sistema completo, aquí se podrían:\n• Ver lista de todos los usuarios\n• Activar/desactivar cuentas\n• Restablecer contraseñas\n• Gestionar permisos');
}

function limpiarDatos() {
    if (confirm('⚠️ ¿ESTÁS SEGURO DE QUE DESEAS LIMPIAR TODOS LOS DATOS?\n\nEsta acción eliminaría todas las consultas y no se puede deshacer.')) {
        mostrarExito('🗑️ Esta funcionalidad estaría disponible en un sistema de producción con las debidas precauciones de seguridad.');
    }
}

// === LIMPIAR FILTROS ===
function limpiarFiltros() {
    configurarFechasPorDefecto();
    mostrarExito('Filtros limpiados');
}