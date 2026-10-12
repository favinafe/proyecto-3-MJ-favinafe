CREATE DATABASE IF NOT EXISTS SIGSM;
USE SIGSM;

CREATE TABLE usuario (
  idUsuario int(11) AUTO_INCREMENT,
  nombreUsuario varchar(50) NOT NULL CHECK (octet_length(nombreUsuario) >= 4),
  contrasenaHash varchar(255) NOT NULL,
  nombre varchar(50) NOT NULL,
  apellido varchar(50) NOT NULL,
  email varchar(120) NOT NULL CHECK (email like '%_@_%.__%'),
  activo tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (idUsuario)
);

CREATE TABLE rol (
   idRol int(11) AUTO_INCREMENT,
   nombreRol varchar(50) NOT NULL UNIQUE,
   descripcion varchar(150) NOT NULL,
   PRIMARY KEY (idRol)
);

CREATE TABLE usuarioRol (
  idUsuario int(11) NOT NULL,
  idRol int(11) NOT NULL,
  fechaAsignacion DATE DEFAULT (CURDATE()) NOT NULL,

  PRIMARY KEY (idUsuario, idRol),

  CONSTRAINT fkUsCaUsr
    FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fkUsCaCat
    FOREIGN KEY (idRol)
    REFERENCES rol (idRol)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

INSERT INTO `usuario` (`nombreUsuario`, `contrasenaHash`, `nombre`, `apellido`, `email`, `activo`) VALUES
( 'facosta', 'qwe', 'Fabian', 'Acosta', 'facosta@sigsm.uy', 1),
( 'mrivero', 'qwe', 'Marcela', 'Rivero', 'mrivero@sigsm.uy', 1),
( 'jgomez', 'qwe', 'Julian', 'Gomez', 'jgomez@sigsm.uy', 0),
( 'pepito', 'qwe', 'Jorge', 'Acosta', 'acosta@sigsm.uy', 0);


INSERT INTO `rol` (`nombreRol`, `descripcion`) VALUES
( 'administrador', 'Acceso total al sistema y gestion de usuarios'),
( 'usuarioBasico', 'Consulta y carga de documentacion de pacientes');

INSERT INTO `usuarioRol` (`idUsuario`, `idRol`, `fechaAsignacion`) VALUES
(1, 1, '2026-08-19'),
(1, 2, '2026-08-19'),
(2, 2, '2026-08-19'),
(3, 2, '2026-08-19'),
(4, 2, '2026-08-20');

CREATE TABLE categoria (
    idCategoria int(11) AUTO_INCREMENT,
    nombre varchar(30) UNIQUE NOT NULL,
    descripcion varchar(150) NOT NULL,
    codigoQrUrl varchar(150) UNIQUE NOT NULL,

    PRIMARY KEY (idCategoria)
);
CREATE TABLE documento (
    idDocumento int(11) AUTO_INCREMENT,
    idCategoria int(11) NOT NULL,
    idUsuario int(11) NOT NULL,
    titulo varchar(40) NOT NULL UNIQUE,
    descripcion varchar(160) NOT NULL UNIQUE,
    archivoUrl varchar(160) NOT NULL UNIQUE,
    fechaCarga DATE DEFAULT (CURDATE()) NOT NULL,
    fechaAsignacion DATE DEFAULT (CURDATE()) NOT NULL,
    activo tinyint(1) NOT NULL DEFAULT 1,

    PRIMARY KEY (idDocumento),

    CONSTRAINT fkDocCat
        FOREIGN KEY (idCategoria)
        REFERENCES categoria (idCategoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fkDocUsr
        FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE encuesta (
    idEncuesta int(11) AUTO_INCREMENT,
    idCategoria int(11) NOT NULL,
    titulo varchar(30) NOT NULL,
    segmento varchar(30) NOT NULL,

    PRIMARY KEY (idEncuesta),

    CONSTRAINT fkEncCat
        FOREIGN KEY (idCategoria)
        REFERENCES categoria (idCategoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE pregunta (
    idPregunta int(11) AUTO_INCREMENT,
    idEncuesta int(11) NOT NULL,
    txtPregunta varchar(60) NOT NULL,
    orden int NOT NULL,

    PRIMARY KEY (idPregunta),

    CONSTRAINT pregEnc
        FOREIGN KEY (idEncuesta)
        REFERENCES encuesta (idEncuesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE opcionRespuesta (
    idOpcion int(11) AUTO_INCREMENT,
    idPregunta int(11) NOT NULL,
    textoOpcion varchar(60) NOT NULL,

    PRIMARY KEY (idOpcion),

    CONSTRAINT opcPreg
        FOREIGN KEY (idPregunta)
        REFERENCES pregunta (idPregunta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE respuestaEncuesta (
    idRespuestaEncuesta int(11) AUTO_INCREMENT,
    idEncuesta int(11) NOT NULL,
    fechaEnvio DATE DEFAULT (CURDATE()) NOT NULL,

    PRIMARY KEY (idRespuestaEncuesta),

    CONSTRAINT fkReenEnc
        FOREIGN KEY (idEncuesta)
        REFERENCES encuesta (idEncuesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE respuestaPregunta (
    idRespuestaPregunta int(11) AUTO_INCREMENT,
    idRespuestaEncuesta int(11) NOT NULL,
    idPregunta int(11) NOT NULL,
    idOpcion int(11) NOT NULL,

    PRIMARY KEY (idRespuestaPregunta),

    CONSTRAINT fkReprResEnc
        FOREIGN KEY (idRespuestaEncuesta)
        REFERENCES respuestaEncuesta (idRespuestaEncuesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fkReprPreg
        FOREIGN KEY (idPregunta)
        REFERENCES pregunta (idPregunta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fkReprOp
        FOREIGN KEY (idOpcion)
        REFERENCES opcionRespuesta (idOpcion)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);





INSERT INTO categoria (nombre, descripcion, codigoQrUrl) VALUES
('Documentos médicos', 'Documentación médica accesible mediante QR.', 'https://ejemplo.com/qr/documentos'),
('Encuestas', 'Encuestas para recopilar información de pacientes.', 'https://ejemplo.com/qr/encuestas'),
('Información general', 'Documentos con información general para pacientes.', 'https://ejemplo.com/qr/informacion');

INSERT INTO documento 
(idCategoria, idUsuario, titulo, descripcion, archivoUrl, fechaCarga, fechaAsignacion, activo) 
VALUES
(1, 1, 'Historia clínica', 'Documento de ejemplo para la historia clínica del paciente.', 'https://ejemplo.com/docs/historia-clinica.pdf', '2026-09-01', '2026-09-01', 1),
(1, 2, 'Indicaciones médicas', 'Documento con indicaciones médicas generales.', 'https://ejemplo.com/docs/indicaciones.pdf', '2026-09-01', '2026-09-01', 1),
(3, 1, 'Información al paciente', 'Información general sobre el procedimiento.', 'https://ejemplo.com/docs/informacion.pdf', '2026-09-02', '2026-09-02', 1);

INSERT INTO encuesta (idCategoria, titulo, segmento) VALUES
(2, 'Satisfacción del servicio', 'Pacientes'),
(2, 'Calidad de atención', 'Pacientes'),
(2, 'Experiencia de traslado', 'Pacientes');

INSERT INTO pregunta (idEncuesta, txtPregunta, orden) VALUES
(1, '¿Cómo calificaría la atención recibida?', 1),
(1, '¿Qué tan satisfecho está con el servicio?', 2),
(2, '¿El personal fue amable?', 1),
(2, '¿La información recibida fue clara?', 2),
(3, '¿Cómo calificaría el traslado?', 1);

INSERT INTO opcionRespuesta (idPregunta, textoOpcion) VALUES
(1, 'Excelente'),
(1, 'Buena'),
(1, 'Regular'),
(1, 'Mala'),
(2, 'Muy satisfecho'),
(2, 'Satisfecho'),
(2, 'Poco satisfecho'),
(2, 'Insatisfecho'),
(3, 'Sí'),
(3, 'No'),
(4, 'Sí'),
(4, 'No'),
(5, 'Excelente'),
(5, 'Bueno'),
(5, 'Regular'),
(5, 'Malo');

INSERT INTO respuestaEncuesta (idEncuesta, fechaEnvio) VALUES
(1, '2026-09-01'),
(2, '2026-09-01'),
(3, '2026-09-02');

INSERT INTO respuestaPregunta 
(idRespuestaEncuesta, idPregunta, idOpcion) 
VALUES
(1, 1, 1),
(1, 2, 5),
(2, 3, 9),
(2, 4, 11),
(3, 5, 13);


CREATE TABLE tipoVehiculo (
    idTipoVehiculo int(11) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL UNIQUE,
    fechaEnvio DATE DEFAULT (CURDATE()) NOT NULL,

    PRIMARY KEY (idTipoVehiculo)
);

CREATE TABLE vehiculo (
    idVehiculo int(11) AUTO_INCREMENT,
    idTipoVehiculo int(11) NOT NULL,
    matricula varchar(7) NOT NULL UNIQUE,
    marca varchar(40) NOT NULL,
    modelo varchar(40) NOT NULL,
    activo tinyint(1) NOT NULL DEFAULT 1,

    PRIMARY KEY (idVehiculo),

    CONSTRAINT fkVehTipoveh
        FOREIGN KEY (idTipoVehiculo)
        REFERENCES tipoVehiculo (idTipoVehiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tipoElemento (
    idTipoElemento int(11) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL UNIQUE,
    descripcion varchar(40) NOT NULL,

    PRIMARY KEY (idTipoElemento)
);

CREATE TABLE compatibilidad (
    idTipoVehiculo int(11) NOT NULL,
    idTipoElemento int(11) NOT NULL,

    PRIMARY KEY (idTipoVehiculo, idTipoElemento),

    CONSTRAINT fkComTVeh
        FOREIGN KEY (idTipoVehiculo)
        REFERENCES tipoVehiculo (idTipoVehiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkComTElem
        FOREIGN KEY (idTipoElemento)
        REFERENCES tipoElemento (idTipoElemento)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE chofer (
    ciChofer int(11),
    nombre varchar(40) NOT NULL,
    apellido varchar(40) NOT NULL,

    PRIMARY KEY (ciChofer)
);

CREATE TABLE enfermero (
    ciEnfermero int(11),
    nombre varchar(40) NOT NULL,
    apellido varchar(40) NOT NULL,

    PRIMARY KEY (ciEnfermero)
);

CREATE TABLE proveedor (
    idProveedor int(11) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL,
    contacto varchar(40) NOT NULL,

    PRIMARY KEY (idProveedor)
);

CREATE TABLE paciente (
    ciPaciente int(9) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL,
    apellido varchar(40) NOT NULL,
    fechaNacimiento DATE NOT NULL,

    PRIMARY KEY (ciPaciente)
);

CREATE TABLE canalSolicitud (
    idCanal int(11) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL,

    PRIMARY KEY (idCanal)
);

CREATE TABLE ruta (
    idRuta int(11) AUTO_INCREMENT,
    origen varchar(40) NOT NULL,
    destino varchar(40) NOT NULL,
    descripcion varchar(40) NOT NULL,
    distanciaKm DOUBLE NOT NULL CHECK (distanciaKm > 0),

    PRIMARY KEY (idRuta)
);

CREATE TABLE solicitudTraslado (
    idSolicitud int(11) AUTO_INCREMENT,
    ciPaciente int(11) NOT NULL,
    idTipoElemento int(11) NOT NULL,
    idRuta int(11) NOT NULL,
    idCanal int(11) NOT NULL,
    idUsuario int(11) NOT NULL,
    fechaSolicitud DATE DEFAULT (CURDATE()) NOT NULL,
    motivo varchar(100) NOT NULL,
    estadoSolicitud ENUM('pendiente', 'enCurso', 'finalizado') NOT NULL,
    descripcion varchar(100) NOT NULL,

    PRIMARY KEY (idSolicitud),

    CONSTRAINT fkSolPac
        FOREIGN KEY (ciPaciente)
        REFERENCES paciente (ciPaciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkSolTipEle
        FOREIGN KEY (idTipoElemento)
        REFERENCES tipoElemento (idTipoElemento)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkSolRut
        FOREIGN KEY (idRuta)
        REFERENCES ruta (idRuta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkSolCan
        FOREIGN KEY (idCanal)
        REFERENCES canalSolicitud (idCanal)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkSolUsr
        FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE estadoTraslado (
    idEstado int(11) AUTO_INCREMENT,
    nombre varchar(40) NOT NULL,

    PRIMARY KEY (idEstado)
);

CREATE TABLE traslado (
    idTraslado int(11) AUTO_INCREMENT,
    idSolicitud int(11) NOT NULL,
    idVehiculo int(11) NOT NULL,
    ciChofer int(11) NOT NULL,
    ciEnfermero int(11) NOT NULL,
    idProveedor int(11) NOT NULL,
    idRuta int(11) NOT NULL,
    horaSalida DATETIME NOT NULL,
    horaLlegada DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (idTraslado),

    CONSTRAINT fkTraSol
        FOREIGN KEY (idSolicitud)
        REFERENCES solicitudTraslado (idSolicitud)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraVehi
        FOREIGN KEY (idVehiculo)
        REFERENCES vehiculo (idVehiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraCho
        FOREIGN KEY (ciChofer)
        REFERENCES chofer (ciChofer)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraEnf
        FOREIGN KEY (ciEnfermero)
        REFERENCES enfermero (ciEnfermero)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraPro
        FOREIGN KEY (idProveedor)
        REFERENCES proveedor (idProveedor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraRuta
        FOREIGN KEY (idRuta)
        REFERENCES ruta (idRuta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE historialEstado (
    idHistorial int(11) AUTO_INCREMENT,
    idTraslado int(11) NOT NULL,
    idEstado int(11) NOT NULL,
    horaLlegada DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observaciones varchar(100) NOT NULL,

    PRIMARY KEY (idHistorial),

    CONSTRAINT fkHisTra
        FOREIGN KEY (idTraslado)
        REFERENCES traslado (idTraslado)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fkHisEst
        FOREIGN KEY (idEstado)
        REFERENCES estadoTraslado (idEstado)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
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

INSERT INTO enfermero (ciEnfermero, nombre, apellido) VALUES
(45678901, 'Laura', 'Martínez'),
(47890123, 'Diego', 'Sosa'),
(48901234, 'Sofía', 'Pereira');

INSERT INTO chofer (ciChofer,nombre, apellido) VALUES
(41239102,'Martín', 'González'),
(56517828,'Federico', 'López'),
(57527829,'Andrés', 'Silva');

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
(idSolicitud, idVehiculo, ciChofer, ciEnfermero, idProveedor, idRuta, horaSalida, horaLlegada) VALUES
(1, 1, 41239102, 45678901, 1, 1, '2026-09-02 08:00:00', '2026-09-02 08:30:00'),
(2, 2, 56517828, 47890123, 2, 2, '2026-09-02 09:00:00', '2026-09-02 09:45:00'),
(3, 3, 57527829, 48901234, 3, 3, '2026-09-02 10:00:00', '2026-09-02 10:25:00');

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


