// ============================================
// CONFIGURACIÓN DE LA API - CLÍNICA VIRTUAL UNI
// ============================================

const API_BASE_URL = 'http://localhost:8080/api';

// Headers comunes para las peticiones
function getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Manejo centralizado de errores
function handleApiError(error) {
    console.error('Error en la API:', error);

    if (error.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        window.location.href = 'login-paciente.html';
        return;
    }

    if (error.status === 403) {
        alert('No tiene permisos para realizar esta acción');
        return;
    }

    if (error.status === 404) {
        alert('Recurso no encontrado');
        return;
    }

    // Error genérico
    const errorMessage = error.message || 'Error de conexión con el servidor';
    throw new Error(errorMessage);
}

// Función genérica para llamadas a la API
async function apiCall(endpoint, options = {}) {
    try {
        const config = {
            headers: getAuthHeaders(),
            ...options
        };

        // Si tiene body, convertirlo a JSON
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw {
                status: response.status,
                message: errorText || 'Error en la petición'
            };
        }

        // Si la respuesta está vacía (como en DELETE)
        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {
        handleApiError(error);
    }
}

// Verificar autenticación al cargar páginas protegidas
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
        window.location.href = 'login-paciente.html';
        return false;
    }

    return true;
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

// Función para formatear fechas
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No especificado';

    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para calcular edad
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'N/A';

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    if (mes < nacimiento.getMonth() ||
        (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
        edad--;
    }

    return edad;
}