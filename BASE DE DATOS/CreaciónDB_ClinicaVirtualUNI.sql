-- ============================================
-- CLÍNICA VIRTUAL UNI - CREACIÓN DE BASE DE DATOS
-- ============================================

CREATE DATABASE ClinicaVirtualUNI;
GO

USE ClinicaVirtualUNI;
GO

CREATE TABLE roles (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id BIGINT FOREIGN KEY REFERENCES roles(id),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE pacientes (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    usuario_id BIGINT UNIQUE FOREIGN KEY REFERENCES usuarios(id),
    tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('DNI', 'CE', 'PASAPORTE')),
    numero_documento VARCHAR(15) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    celular VARCHAR(15),
    departamento VARCHAR(50),
    provincia VARCHAR(50),
    distrito VARCHAR(50),
    direccion TEXT,
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    enfermedades_cronicas TEXT,
    medicamentos_actuales TEXT,
    antecedentes TEXT,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE medicos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    usuario_id BIGINT UNIQUE FOREIGN KEY REFERENCES usuarios(id),
    cmp VARCHAR(10) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    especialidad_principal VARCHAR(100) NOT NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE especialidades (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activa BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE consultas (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    paciente_id BIGINT FOREIGN KEY REFERENCES pacientes(id),
    medico_id BIGINT FOREIGN KEY REFERENCES medicos(id), -- Puede ser NULL inicialmente
    especialidad_id BIGINT FOREIGN KEY REFERENCES especialidades(id),
    motivo_consulta TEXT NOT NULL,
    antecedentes_paciente TEXT,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'COMPLETADA', 'CANCELADA')),
    urgencia VARCHAR(20) DEFAULT 'NORMAL' CHECK (urgencia IN ('NORMAL', 'URGENTE')),
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    fecha_respuesta DATETIME NULL,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE sintomas (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE sintomas_consulta (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    consulta_id BIGINT FOREIGN KEY REFERENCES consultas(id),
    sintoma_id BIGINT FOREIGN KEY REFERENCES sintomas(id),
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE respuestas_medicas (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    consulta_id BIGINT UNIQUE FOREIGN KEY REFERENCES consultas(id),
    medico_id BIGINT FOREIGN KEY REFERENCES medicos(id),
    diagnostico TEXT NOT NULL,
    recomendaciones TEXT NOT NULL,
    medicamentos_recetados TEXT,
    proximo_control DATE NULL,
    archivo_receta VARCHAR(255) NULL,
    fecha_respuesta DATETIME DEFAULT GETDATE(),
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE archivos_adjuntos (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    consulta_id BIGINT FOREIGN KEY REFERENCES consultas(id),
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(50),
    tamano_bytes BIGINT,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX idx_consultas_medico ON consultas(medico_id);
CREATE INDEX idx_consultas_estado ON consultas(estado);
CREATE INDEX idx_consultas_fecha ON consultas(fecha_solicitud);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_pacientes_documento ON pacientes(numero_documento);
CREATE INDEX idx_medicos_cmp ON medicos(cmp);
GO