-- Insertar departamentos de ejemplo
INSERT INTO departamentos (descripcion, activo) VALUES
('Recursos Humanos', 1),
('Tecnología', 1),
('Contabilidad', 1),
('Ventas', 1),
('Marketing', 1),
('Operaciones', 1);

-- Insertar empleados de ejemplo
INSERT INTO empleados (nombre, cedula, departamento_id, tipo_persona, fecha_ingreso, activo) VALUES
('María García López', '001-1391820-5', 1, 1, '2023-01-15', 1),
('Carlos López Martínez', '001-0992990-1', 2, 1, '2022-06-10', 1),
('Ana Martínez Rodríguez', '031-0524452-3', 3, 1, '2023-03-20', 1),
('Pedro Rodríguez Sánchez', '123-4567890-3', 4, 1, '2022-11-05', 1),
('Laura Sánchez Torres', '113-6741331-4', 5, 1, '2023-02-14', 1),
('Miguel Torres Herrera', '822-9056169-3', 6, 1, '2022-08-22', 1),
('Carmen Herrera Díaz', '630-4336441-1', 1, 2, '2023-04-10', 1),
('José Díaz Morales', '899-8562850-5', 2, 2, '2022-12-01', 1),
('Elena Morales Castro', '199-9173265-2', 3, 1, '2023-05-18', 1);


-- Insertar tipos de activos de ejemplo
INSERT INTO tipos_activos (descripcion, cuenta_contable_compra, cuenta_contable_depreciacion, activo) VALUES
('Equipos de Cómputo', '1205001', '1209001', 1),
('Vehículos', '1205002', '1209002', 1),
('Mobiliario de Oficina', '1205003', '1209003', 1),
('Herramientas', '1205004', '1209004', 1),
('Equipos de Oficina', '1205005', '1209005', 1),
('Inmuebles', '1205006', '1209006', 1),
('Equipos Eléctricos', '1205007', '1209007', 1),
('Equipos de Red', '1205008', '1209008', 1);
