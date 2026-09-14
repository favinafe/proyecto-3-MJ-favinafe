INSERT INTO `usuario` (`nombre_usuario`, `contrasenaHash`, `nombre`, `apellido`, `email`, `activo`) VALUES
( 'facosta', 'qwe', 'Fabian', 'Acosta', 'facosta@sigsm.uy', 1),
( 'mrivero', 'qwe', 'Marcela', 'Rivero', 'mrivero@sigsm.uy', 1),
( 'jgomez', 'qwe', 'Julian', 'Gomez', 'jgomez@sigsm.uy', 0),
( 'pepito', 'qwe', 'Jorge', 'Acosta', 'acosta@sigsm.uy', 0);


INSERT INTO `rol` (`nombre_rol`, `descripcion`) VALUES
( 'administrador', 'Acceso total al sistema y gestion de usuarios'),
( 'usuario_basico', 'Consulta y carga de documentacion de pacientes');

INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`, `fecha_asignacion`) VALUES
(1, 1, '2026-08-19'),
(1, 2, '2026-08-19'),
(2, 2, '2026-08-19'),
(3, 2, '2026-08-19'),
(4, 2, '2026-08-20');