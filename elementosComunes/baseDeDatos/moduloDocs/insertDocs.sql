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