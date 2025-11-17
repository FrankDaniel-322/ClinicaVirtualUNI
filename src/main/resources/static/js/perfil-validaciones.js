// ============================================
// VALIDACIONES PARA PERFIL DE PACIENTE
// ============================================

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function () {
    if (!checkAuth()) return;
    cargarPerfil();
});

// === CARGAR PERFIL ===
async function cargarPerfil() {
    try {
        const perfil = await apiCall('/pacientes/perfil');
        mostrarDatosPerfil(perfil);
    } catch (error) {
        console.error('Error cargando perfil:', error);
        mostrarError('Error al cargar el perfil');
    }
}

// === MOSTRAR DATOS DEL PERFIL ===
function mostrarDatosPerfil(perfil) {
    // Información Personal
    document.getElementById('nombreCompleto').textContent =
        `${perfil.nombres} ${perfil.apellidoPaterno} ${perfil.apellidoMaterno}`;

    document.getElementById('correoUsuario').textContent = perfil.email;
    document.getElementById('infoTipoDoc').textContent = perfil.tipoDocumento || 'DNI';
    document.getElementById('infoNumDoc').textContent = perfil.numeroDocumento;
    document.getElementById('infoFechaNac').textContent = formatearFecha(perfil.fechaNacimiento);
    document.getElementById('infoEdad').textContent = calcularEdad(perfil.fechaNacimiento) + ' años';
    document.getElementById('infoSexo').textContent = perfil.sexo === 'M' ? 'Masculino' : 'Femenino';
    document.getElementById('infoCelular').textContent = perfil.celular;

    // Información de Contacto
    document.getElementById('infoEmail').textContent = perfil.email;
    document.getElementById('infoDepartamento').textContent = perfil.departamento || 'No especificado';
    document.getElementById('infoProvincia').textContent = perfil.provincia || 'No especificado';
    document.getElementById('infoDistrito').textContent = perfil.distrito || 'No especificado';
    document.getElementById('infoDireccion').textContent = perfil.direccion || 'No especificado';

    // Información Médica
    document.getElementById('infoTipoSangre').textContent = perfil.tipoSangre || 'No especificado';
    document.getElementById('infoAlergias').textContent = perfil.alergias || 'No especificadas';
    document.getElementById('infoEnfermedades').textContent = perfil.enfermedadesCronicas || 'No especificadas';
    document.getElementById('infoMedicamentos').textContent = perfil.medicamentosActuales || 'No especificados';
    document.getElementById('infoAntecedentes').textContent = perfil.antecedentes || 'No especificados';
}

// === ACTUALIZAR PERFIL ===
async function actualizarPerfil() {
    try {
        const perfilActualizado = {
            nombres: document.getElementById('nombres').value,
            apellidoPaterno: document.getElementById('apPaterno').value,
            apellidoMaterno: document.getElementById('apMaterno').value,
            fechaNacimiento: document.getElementById('fechaNac').value,
            sexo: document.getElementById('sexo').value,
            celular: document.getElementById('celular').value,
            departamento: document.getElementById('departamento').value,
            provincia: document.getElementById('provincia').value,
            distrito: document.getElementById('distrito').value,
            direccion: document.getElementById('direccion').value,
            tipoSangre: document.getElementById('tipoSangre').value,
            alergias: document.getElementById('alergias').value,
            enfermedadesCronicas: document.getElementById('enfermedades').value,
            medicamentosActuales: document.getElementById('medicamentos').value,
            antecedentes: document.getElementById('antecedentes').value
        };

        const response = await apiCall('/pacientes/perfil', {
            method: 'PUT',
            body: perfilActualizado
        });

        mostrarExito('Perfil actualizado correctamente');
        mostrarDatosPerfil(response);

    } catch (error) {
        mostrarError('Error al actualizar el perfil: ' + error.message);
    }
}

// === CAMBIAR CONTRASEÑA ===
async function cambiarPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    if (newPassword !== confirmPassword) {
        mostrarError('Las contraseñas nuevas no coinciden');
        return;
    }

    // Validar requisitos de contraseña
    const requisitos = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword)
    };

    const todosOk = Object.values(requisitos).every(v => v);
    if (!todosOk) {
        mostrarError('La nueva contraseña no cumple con los requisitos de seguridad');
        return;
    }

    try {
        await apiCall('/pacientes/cambiar-password', {
            method: 'POST',
            body: {
                currentPassword: currentPassword,
                newPassword: newPassword
            }
        });

        mostrarExito('Contraseña actualizada correctamente');

        // Limpiar campos
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

    } catch (error) {
        mostrarError('Error al cambiar la contraseña: ' + error.message);
    }
}

// === HABILITAR EDICIÓN ===
function habilitarEdicion() {
    const elementosEdicion = document.querySelectorAll('.info-value');
    elementosEdicion.forEach(elemento => {
        elemento.contentEditable = true;
        elemento.style.backgroundColor = '#fff9e6';
        elemento.style.border = '1px solid #ffc107';
    });

    document.getElementById('btnEditar').style.display = 'none';
    document.getElementById('btnGuardar').style.display = 'inline-block';
    document.getElementById('btnCancelar').style.display = 'inline-block';
}

// === CANCELAR EDICIÓN ===
function cancelarEdicion() {
    const elementosEdicion = document.querySelectorAll('.info-value');
    elementosEdicion.forEach(elemento => {
        elemento.contentEditable = false;
        elemento.style.backgroundColor = '';
        elemento.style.border = '';
    });

    document.getElementById('btnEditar').style.display = 'inline-block';
    document.getElementById('btnGuardar').style.display = 'none';
    document.getElementById('btnCancelar').style.display = 'none';

    // Recargar datos originales
    cargarPerfil();
}