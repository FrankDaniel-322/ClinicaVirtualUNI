-- ============================================
-- CLÍNICA VIRTUAL UNI - DATOS DE PRUEBA
-- ============================================

USE ClinicaVirtualUNI;
GO

INSERT INTO roles (nombre, descripcion) VALUES
('PACIENTE', 'Usuarios que solicitan consultas médicas'),
('MEDICO', 'Médicos que responden consultas'),
('ADMIN', 'Administradores del sistema');
GO

INSERT INTO especialidades (codigo, nombre, descripcion) VALUES
('medicina_general', 'Medicina General', 'Atención primaria y diagnóstico general'),
('dermatologia', 'Dermatología', 'Enfermedades de la piel'),
('nutricion', 'Nutrición', 'Asesoramiento alimenticio y control de peso'),
('pediatria', 'Pediatría', 'Atención médica para niños'),
('ginecologia', 'Ginecología', 'Salud femenina'),
('cardiologia', 'Cardiología', 'Enfermedades del corazón');
GO

INSERT INTO sintomas (nombre, descripcion) VALUES
('Fiebre', 'Temperatura corporal elevada'),
('Dolor de cabeza', 'Cefalea o migraña'),
('Tos', 'Tos seca o con flema'),
('Dolor de garganta', 'Molestia o irritación en la garganta'),
('Congestión nasal', 'Nariz tapada'),
('Dificultad para respirar', 'Falta de aire o disnea'),
('Fatiga', 'Cansancio extremo'),
('Dolor muscular', 'Molestia en los músculos'),
('Pérdida del olfato', 'Incapacidad para percibir olores'),
('Pérdida del gusto', 'Incapacidad para percibir sabores'),
('Náuseas', 'Sensación de querer vomitar'),
('Vómitos', 'Expulsión del contenido gástrico'),
('Diarrea', 'Evacuaciones líquidas frecuentes'),
('Dolor abdominal', 'Molestia en el vientre'),
('Dolor en el pecho', 'Molestia en el área torácica'),
('Mareos', 'Vértigo o sensación de desmayo'),
('Erupciones cutáneas', 'Manchas o irritación en la piel');
GO

INSERT INTO usuarios (email, password, rol_id) VALUES
('admin@clinicauni.pe', '$2a$10$ABCDE1234567890ABCDEFO', 3), -- admin
('dr.silva@clinicauni.pe', '$2a$10$ABCDE1234567890ABCDEFO', 2), -- médico
('dra.gonzales@clinicauni.pe', '$2a$10$ABCDE1234567890ABCDEFO', 2), -- médico
('paciente1@email.com', '$2a$10$ABCDE1234567890ABCDEFO', 1), -- paciente
('paciente2@email.com', '$2a$10$ABCDE1234567890ABCDEFO', 1); -- paciente
GO

INSERT INTO medicos (usuario_id, cmp, nombres, apellido_paterno, apellido_materno, especialidad_principal) VALUES
(2, '12345', 'Roberto', 'Silva', 'Mendoza', 'Medicina General'),
(3, '67890', 'Ana', 'Gonzales', 'López', 'Medicina General');
GO

INSERT INTO pacientes (usuario_id, tipo_documento, numero_documento, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, celular, email, departamento, provincia, distrito, direccion, tipo_sangre) VALUES
(4, 'DNI', '76543210', 'Juan', 'Pérez', 'Gómez', '1990-05-15', 'M', '987654321', 'juan.perez@email.com', 'Lima', 'Lima', 'Miraflores', 'Av. Larco 123', 'O+'),
(5, 'DNI', '87654321', 'María', 'López', 'García', '1985-08-20', 'F', '987654322', 'maria.lopez@email.com', 'Lima', 'Lima', 'Surco', 'Av. Benavides 456', 'A+');
GO

INSERT INTO consultas (paciente_id, especialidad_id, motivo_consulta, antecedentes_paciente, estado, urgencia, fecha_solicitud) VALUES
(1, 1, 'Dolor de garganta persistente y fiebre desde hace 3 días', 'Alergia a la penicilina', 'COMPLETADA', 'NORMAL', DATEADD(DAY, -5, GETDATE())),
(1, 1, 'Dolor de cabeza intenso que no cede con analgésicos comunes', 'Ninguno', 'PENDIENTE', 'NORMAL', DATEADD(DAY, -1, GETDATE())),
(2, 1, 'Erupción cutánea en brazos y torso con picazón intensa', 'Historial de alergias estacionales', 'PENDIENTE', 'NORMAL', GETDATE());
GO

INSERT INTO sintomas_consulta (consulta_id, sintoma_id) VALUES
(1, 1), (1, 4),
(2, 2),
(3, 17);
GO

INSERT INTO respuestas_medicas (consulta_id, medico_id, diagnostico, recomendaciones, medicamentos_recetados, fecha_respuesta) VALUES
(1, 1, 'Faringitis aguda probablemente viral', 'Reposo, hidratación abundante, gargarismos con agua tibia y sal. Tomar paracetamol cada 8 horas si hay fiebre.', 'Paracetamol 500mg - 1 tableta cada 8 horas por 3 días si hay fiebre', DATEADD(DAY, -4, GETDATE()));
GO

UPDATE consultas SET fecha_respuesta = DATEADD(DAY, -4, GETDATE()), medico_id = 1 WHERE id = 1;
GO

PRINT 'Base de datos ClinicaVirtualUNI creada exitosamente!';
PRINT 'Datos de prueba insertados:';
PRINT '   - 3 roles del sistema';
PRINT '   - 6 especialidades médicas';
PRINT '   - 17 síntomas comunes';
PRINT '   - 5 usuarios (1 admin, 2 médicos, 2 pacientes)';
PRINT '   - 3 consultas de ejemplo (1 completada, 2 pendientes)';
PRINT '   - 1 respuesta médica';
GO