// ============================================
// VALIDACIONES PARA CLÍNICA VIRTUAL UNI
// ============================================

// Datos de ubicaciones
const ubicaciones = {
    "Lima": {
        "Lima": ["Lima", "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacamac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"],
        "Huaura": ["Huacho", "Ámbar", "Caleta de Carquín", "Checras", "Hualmay", "Huaura", "Leoncio Prado", "Paccho", "Santa Leonor", "Santa María", "Sayan", "Végueta"],
        "Barranca": ["Barranca", "Paramonga", "Pativilca", "Supe", "Supe Puerto"]
    },
    "Arequipa": {
        "Arequipa": ["Arequipa", "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Characato", "Chiguata", "Jacobo Hunter", "La Joya", "Mariano Melgar", "Miraflores", "Mollebaya", "Paucarpata", "Pocsi", "Polobaya", "Quequeña", "Sabandia", "Sachaca", "San Juan de Siguas", "San Juan de Tarucani", "Santa Isabel de Siguas", "Santa Rita de Siguas", "Socabaya", "Tiabaya", "Uchumayo", "Vitor", "Yanahuara", "Yarabamba", "Yura"],
        "Camaná": ["Camaná", "José María Quimper", "Mariano Nicolás Valcárcel", "Mariscal Cáceres", "Nicolás de Piérola"],
        "Islay": ["Mollendo", "Cocachacra", "Dean Valdivia", "Islay", "Mejía", "Punta de Bombón"]
    },
    "Cusco": {
        "Cusco": ["Cusco", "Ccorca", "Poroy", "San Jerónimo", "San Sebastian", "Santiago", "Saylla", "Wanchaq"],
        "Quispicanchi": ["Urcos", "Andahuaylillas", "Camanti", "Ccarhuayo", "Ccatca", "Cusipata", "Huaro", "Lucre", "Marcapata", "Ocongate", "Oropesa", "Quiquijana"]
    },
    "La Libertad": {
        "Trujillo": ["Trujillo", "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo", "Moche", "Poroto", "Salaverry", "Simbal", "Victor Larco Herrera"]
    },
    "Piura": {
        "Piura": ["Piura", "Castilla", "Catacaos", "Cura Mori", "El Tallan", "La Arena", "La Union", "Las Lomas", "Tambo Grande"]
    },
    "Lambayeque": {
        "Chiclayo": ["Chiclayo", "Chongoyape", "Eten", "Eten Puerto", "Jose Leonardo Ortiz", "La Victoria", "Lagunas", "Monsefu", "Nueva Arica", "Oyotun", "Picsi", "Pimentel", "Reque", "Santa Rosa", "Saña", "Tucume"]
    },
    "Junín": {
        "Huancayo": ["Huancayo", "Carhuacallanga", "Chacapampa", "Chicche", "Chilca", "Chongos Alto", "Chupuro", "Colca", "Cullhuas", "El Tambo", "Huacrapuquio", "Hualhuas", "Huancan", "Huasicancha", "Huayucachi", "Ingenio", "Pariahuanca", "Pilcomayo", "Pucara", "Quichuay", "Quilcas", "San Agustin", "San Jeronimo de Tunan", "San Pedro de Saño", "Santo Domingo de Acobamba", "Sapallanga", "Sicaya", "Viques"]
    },
    "Callao": {
        "Callao": ["Callao", "Bellavista", "Carmen de La Legua", "La Perla", "La Punta", "Ventanilla"]
    }
};

// === VALIDACIÓN LOGIN PACIENTE ===
async function validarLogin(event) {
    event.preventDefault();

    const documento = document.getElementById('documento').value.trim();
    const password = document.getElementById('password').value;

    if (!documento || !password) {
        mostrarError('Por favor complete todos los campos');
        return false;
    }

    try {
        const response = await apiCall('/auth/login-paciente', {
            method: 'POST',
            body: {
                email: documento + '@clinicauni.pe',
                password: password
            }
        });

        // Guardar token y datos del usuario
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response));

        mostrarExito('Iniciando sesión...');
        setTimeout(() => {
            window.location.href = 'dashboard-paciente.html';
        }, 1000);

    } catch (error) {
        mostrarError('Credenciales incorrectas o usuario no encontrado');
    }
}

// === VALIDACIÓN LOGIN MÉDICO ===
async function validarLoginMedico(event) {
    event.preventDefault();

    const cmp = document.getElementById('cmp').value.trim();
    const password = document.getElementById('passwordMedico').value;
    const politica = document.getElementById('politicaMedico');

    if (!politica.checked) {
        mostrarError('Debe aceptar la Política de Protección de Datos Personales');
        return false;
    }

    if (!cmp || !password) {
        mostrarError('Por favor complete todos los campos');
        return false;
    }

    try {
        const response = await apiCall('/auth/login-medico', {
            method: 'POST',
            body: {
                email: cmp + '@clinicauni.pe',
                password: password
            }
        });

        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response));

        mostrarExito('Iniciando sesión médico...');
        setTimeout(() => {
            window.location.href = 'panel-medico.html';
        }, 1000);

    } catch (error) {
        mostrarError('Credenciales incorrectas o médico no encontrado');
    }
}

// === VALIDACIÓN REGISTRO PASO 1 ===
function validarPaso1(event) {
    event.preventDefault();

    const numDoc = document.getElementById('numDoc').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apPaterno = document.getElementById('apPaterno').value.trim();
    const apMaterno = document.getElementById('apMaterno').value.trim();
    const fechaNac = document.getElementById('fechaNac').value;
    const celular = document.getElementById('celular').value.trim();
    const email = document.getElementById('email').value.trim();
    const departamento = document.getElementById('departamento').value;
    const provincia = document.getElementById('provincia').value;
    const distrito = document.getElementById('distrito').value;
    const politica = document.getElementById('politica-reg');

    // Validar política
    if (!politica.checked) {
        mostrarError('Debe aceptar la Política de Protección de Datos Personales');
        return false;
    }

    // Validar DNI (8 dígitos)
    if (numDoc.length !== 8 || !/^\d+$/.test(numDoc)) {
        mostrarError('El DNI debe tener 8 dígitos numéricos');
        return false;
    }

    // Validar nombres (solo letras y espacios)
    if (!/^[a-záéíóúñ\s]+$/i.test(nombres)) {
        mostrarError('Los nombres solo deben contener letras');
        return false;
    }

    // Validar apellidos
    if (!/^[a-záéíóúñ\s]+$/i.test(apPaterno) || !/^[a-záéíóúñ\s]+$/i.test(apMaterno)) {
        mostrarError('Los apellidos solo deben contener letras');
        return false;
    }

    // Validar fecha de nacimiento (mayor de edad)
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();

    if (edad < 18) {
        mostrarError('Debe ser mayor de 18 años para registrarse');
        return false;
    }

    // Validar celular (9 dígitos, empieza con 9)
    if (!/^9\d{8}$/.test(celular)) {
        mostrarError('El celular debe tener 9 dígitos y comenzar con 9');
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarError('Ingrese un correo electrónico válido');
        return false;
    }

    // Validar ubicación
    if (!departamento || !provincia || !distrito) {
        mostrarError('Debe seleccionar departamento, provincia y distrito');
        return false;
    }

    // Guardar datos en localStorage temporal
    const datosRegistro = {
        tipoDoc: document.querySelector('input[name="tipoDoc"]:checked').value,
        numDoc, nombres, apPaterno, apMaterno,
        fechaNac, sexo: document.getElementById('sexo').value,
        celular, email, departamento, provincia, distrito,
        direccion: document.getElementById('direccion').value
    };

    localStorage.setItem('registroPaso1', JSON.stringify(datosRegistro));

    // Ir al paso 2
    window.location.href = 'registro-paso2.html';

    return false;
}

// === VALIDACIÓN REGISTRO PASO 2 (CONTRASEÑA) ===
async function validarPaso2(event) {
    event.preventDefault();

    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;

    // Verificar que las contraseñas coincidan
    if (password1 !== password2) {
        mostrarError('Las contraseñas no coinciden');
        return false;
    }

    // Verificar requisitos (SIN CARÁCTER ESPECIAL)
    const requisitos = {
        length: password1.length >= 8,
        uppercase: /[A-Z]/.test(password1),
        lowercase: /[a-z]/.test(password1),
        number: /[0-9]/.test(password1)
    };

    const todosOk = Object.values(requisitos).every(v => v);

    if (!todosOk) {
        mostrarError('La contraseña no cumple con todos los requisitos');
        return false;
    }

    try {
        // Recuperar datos del paso 1
        const datosPaso1 = JSON.parse(localStorage.getItem('registroPaso1'));

        if (!datosPaso1) {
            mostrarError('Error: Debe completar primero el paso 1');
            window.location.href = 'registro-paso1.html';
            return false;
        }

        const response = await apiCall('/auth/registro-paciente', {
            method: 'POST',
            body: {
                ...datosPaso1,
                password: password1
            }
        });

        // Guardar token y limpiar datos temporales
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response));
        localStorage.removeItem('registroPaso1');

        mostrarExito('¡Registro exitoso!');
        setTimeout(() => {
            window.location.href = 'dashboard-paciente.html';
        }, 2000);

    } catch (error) {
        mostrarError('Error en el registro: ' + error.message);
    }
}

// === VALIDACIÓN EN TIEMPO REAL DE CONTRASEÑA ===
function validarPassword() {
    const password = document.getElementById('password1').value;

    // Requisitos (SIN CARÁCTER ESPECIAL)
    const requisitos = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

    // Actualizar clases
    document.getElementById('req-length').className = requisitos.length ? 'valid' : 'invalid';
    document.getElementById('req-uppercase').className = requisitos.uppercase ? 'valid' : 'invalid';
    document.getElementById('req-lowercase').className = requisitos.lowercase ? 'valid' : 'invalid';
    document.getElementById('req-number').className = requisitos.number ? 'valid' : 'invalid';
}

// === VALIDACIÓN DE COINCIDENCIA DE CONTRASEÑAS ===
function validarCoincidencia() {
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    const mensaje = document.getElementById('matchMessage');

    if (password2.length === 0) {
        mensaje.style.display = 'none';
        return;
    }

    mensaje.style.display = 'block';

    if (password1 === password2) {
        mensaje.textContent = '✓ Las contraseñas coinciden';
        mensaje.style.color = 'var(--success-green)';
    } else {
        mensaje.textContent = '✗ Las contraseñas no coinciden';
        mensaje.style.color = 'var(--error-red)';
    }
}

// === CARGA DE PROVINCIAS Y DISTRITOS ===
function cargarProvincias() {
    const departamento = document.getElementById('departamento').value;
    const provinciaSelect = document.getElementById('provincia');
    const distritoSelect = document.getElementById('distrito');

    // Limpiar selects
    provinciaSelect.innerHTML = '<option value="">Seleccionar...</option>';
    distritoSelect.innerHTML = '<option value="">Seleccionar...</option>';

    if (departamento && ubicaciones[departamento]) {
        // Cargar provincias
        Object.keys(ubicaciones[departamento]).forEach(provincia => {
            provinciaSelect.innerHTML += `<option value="${provincia}">${provincia}</option>`;
        });
    }
}

function cargarDistritos() {
    const departamento = document.getElementById('departamento').value;
    const provincia = document.getElementById('provincia').value;
    const distritoSelect = document.getElementById('distrito');

    // Limpiar distritos
    distritoSelect.innerHTML = '<option value="">Seleccionar...</option>';

    if (departamento && provincia && ubicaciones[departamento] && ubicaciones[departamento][provincia]) {
        // Cargar distritos
        ubicaciones[departamento][provincia].forEach(distrito => {
            distritoSelect.innerHTML += `<option value="${distrito}">${distrito}</option>`;
        });
    }
}

// === AUTO-LOAD ===
document.addEventListener('DOMContentLoaded', function () {
    // Si estamos en registro paso 2, validar que exista paso 1
    if (window.location.pathname.includes('registro-paso2')) {
        const datosPaso1 = localStorage.getItem('registroPaso1');
        if (!datosPaso1) {
            alert('Debe completar primero el paso 1');
            window.location.href = 'registro-paso1.html';
        }
    }

    // Verificar autenticación en páginas protegidas
    const paginasProtegidas = [
        'dashboard-paciente.html',
        'panel-medico.html',
        'solicitar-consulta.html',
        'historial-consultas.html',
        'mi-perfil.html',
        'admin.html'
    ];

    const paginaActual = window.location.pathname.split('/').pop();
    if (paginasProtegidas.includes(paginaActual)) {
        checkAuth();
    }
});