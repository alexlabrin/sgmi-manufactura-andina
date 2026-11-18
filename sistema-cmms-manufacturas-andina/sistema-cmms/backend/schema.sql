-- ESQUEMA DE BASE DE DATOS SGMI-MA (Manufacturas Andina S.A.)

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS activos (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Operativo',
    salud INT DEFAULT 100,
    temperatura NUMERIC(5,2),
    vibracion NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    stock_actual INT NOT NULL CHECK (stock_actual >= 0),
    stock_minimo INT NOT NULL,
    precio_unitario INT NOT NULL,
    ubicacion VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS ot_mantenimiento (
    id VARCHAR(20) PRIMARY KEY,
    equipo_id VARCHAR(20) REFERENCES activos(id),
    descripcion TEXT NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Pendiente',
    reportado_por VARCHAR(100) NOT NULL,
    tecnico_asignado VARCHAR(100),
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    horas_hombre INT DEFAULT 0,
    costo_total INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS logs_auditoria (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    estado VARCHAR(20) NOT NULL
);
