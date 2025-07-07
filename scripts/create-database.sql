-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS bd_activo_fijo;
USE bd_activo_fijo;

-- Verificar que las tablas existan
SHOW TABLES;

-- Si no existen, crearlas
CREATE TABLE IF NOT EXISTS departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    departamento_id INT NOT NULL,
    tipo_persona TINYINT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

CREATE TABLE IF NOT EXISTS tipos_activos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    cuenta_contable_compra VARCHAR(50) NOT NULL,
    cuenta_contable_depreciacion VARCHAR(50) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS activos_fijos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    departamento_id INT,
    tipo_activo_id INT NOT NULL,
    fecha_adquisicion DATE NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    depreciacion_acumulada DECIMAL(15,2) NOT NULL,
    estado TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (tipo_activo_id) REFERENCES tipos_activos(id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

-- Insertar datos de ejemplo si las tablas están vacías
INSERT IGNORE INTO departamentos (descripcion, activo) VALUES
('Recursos Humanos', 1),
('Tecnología', 1),
('Contabilidad', 1),
('Ventas', 1),
('Marketing', 1),
('Operaciones', 1);

-- Verificar datos insertados
SELECT 'Departamentos' as tabla, COUNT(*) as registros FROM departamentos
UNION ALL
SELECT 'Empleados' as tabla, COUNT(*) as registros FROM empleados
UNION ALL
SELECT 'Tipos Activos' as tabla, COUNT(*) as registros FROM tipos_activos
UNION ALL
SELECT 'Activos Fijos' as tabla, COUNT(*) as registros FROM activos_fijos;
