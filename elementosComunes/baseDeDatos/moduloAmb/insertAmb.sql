INSERT INTO tipoElemento (nombre, descripcion) VALUES
('Camilla', 'Camilla para traslado'),
('Silla de ruedas', 'Silla para traslado'),
('Oxígeno', 'Equipamiento de oxígeno'),
('Monitor', 'Monitor de signos vitales');

INSERT INTO tipoVehiculo (nombre, fechaEnvio) VALUES
('Ambulancia básica', '2026-09-01'),
('Ambulancia avanzada', '2026-09-01'),
('Unidad de traslado', '2026-09-02');

INSERT INTO compatibilidad (idTipoVehiculo, idTipoElemento) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2);

INSERT INTO paciente (ciPaciente, nombre, apellido, fechaNacimiento) VALUES
(51234567, 'Juan', 'Pérez', '1990-04-15'),
(49876543, 'María', 'Gómez', '1985-11-22'),
(53456789, 'Carlos', 'Rodríguez', '2001-07-08'),
(47654321, 'Ana', 'Fernández', '1978-02-19');

INSERT INTO ruta (origen, destino, descripcion, distanciaKm) VALUES
('Hospital Central', 'Policlínica Norte', 'Traslado programado', '8.5'),
('Hospital Central', 'Hospital del Sur', 'Traslado interhospitalario', '12.3'),
('Domicilio', 'Hospital Central', 'Traslado de paciente', '6.7'),
('Policlínica Norte', 'Hospital Central', 'Retorno al hospital', '8.5');

INSERT INTO canalSolicitud (nombre) VALUES
('Teléfono'),
('Aplicación web'),
('Presencial'),
('Correo electrónico');

INSERT INTO estadoTraslado (nombre) VALUES
('Solicitado'),
('Asignado'),
('En camino'),
('Paciente trasladado'),
('Finalizado'),
('Cancelado');

INSERT INTO proveedor (nombre, contacto) VALUES
('Servicio de Ambulancias Norte', '2400-1000'),
('Emergencias Médicas Uruguay', '2400-2000'),
('Traslados Salud', '2400-3000');

INSERT INTO enfermero (CI, nombre, apellido) VALUES
('45678901', 'Laura', 'Martínez'),
('47890123', 'Diego', 'Sosa'),
('48901234', 'Sofía', 'Pereira');

INSERT INTO chofer (nombre, apellido) VALUES
('Martín', 'González'),
('Federico', 'López'),
('Andrés', 'Silva');

INSERT INTO vehiculo 
(idTipoVehiculo, matricula, marca, modelo, activo) VALUES
(1, 'SAB1234', 'Mercedes-Benz', 'Sprinter', 1),
(2, 'SAB5678', 'Renault', 'Master', 1),
(3, 'SAB9012', 'Fiat', 'Ducato', 1),
(2, 'SAB3456', 'Mercedes-Benz', 'Sprinter', 1);

INSERT INTO solicitudTraslado 
(ciPaciente, idTipoElemento, idRuta, idCanal, idUsuario, fechaSolicitud, motivo, estadoSolicitud, descripcion) VALUES
(51234567, 1, 1, 1, 1, '2026-09-01', 'Consulta médica', 'pendiente', 'Paciente requiere traslado con camilla.'),
(49876543, 2, 2, 2, 2, '2026-09-01', 'Derivación médica', 'enCurso', 'Traslado interhospitalario.'),
(53456789, 1, 3, 3, 1, '2026-09-02', 'Control médico', 'finalizado', 'Traslado desde domicilio.');

INSERT INTO traslado 
(idSolicitud, idVehiculo, idChofer, idEnfermero, idProveedor, idRuta, horaSalida, horaLlegada) VALUES
(1, 1, 1, 1, 1, 1, '2026-09-02 08:00:00', '2026-09-02 08:30:00'),
(2, 2, 2, 2, 2, 2, '2026-09-02 09:00:00', '2026-09-02 09:45:00'),
(3, 3, 3, 3, 3, 3, '2026-09-02 10:00:00', '2026-09-02 10:25:00');

INSERT INTO historialEstado 
(idTraslado, idEstado, horaLlegada, observaciones) VALUES
(1, 1, '2026-09-02 07:30:00', 'Solicitud recibida.'),
(1, 2, '2026-09-02 07:45:00', 'Vehículo y personal asignados.'),
(1, 3, '2026-09-02 08:00:00', 'Vehículo salió hacia el origen.'),
(2, 1, '2026-09-02 08:30:00', 'Solicitud recibida.'),
(2, 2, '2026-09-02 08:45:00', 'Vehículo y personal asignados.'),
(2, 3, '2026-09-02 09:00:00', 'Traslado en curso.'),
(3, 1, '2026-09-02 09:30:00', 'Solicitud recibida.'),
(3, 5, '2026-09-02 10:25:00', 'Traslado finalizado.');