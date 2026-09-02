INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `contrasenha_hash`, `nombre`, `apellido`, `email`, `activo`) VALUES
(1, 'facosta', '$2y$10$4F8EVpedm.j9CpPOo1cme.6CwYcSTgNpjoz6PoU62xfoC84qKcO0G', 'Fabian', 'Acosta', 'facosta@sigsm.uy', 1),
(2, 'mrivero', '$2y$10$4F8EVpedm.j9CpPOo1cme.6CwYcSTgNpjoz6PoU62xfoC84qKcO0G', 'Marcela', 'Rivero', 'mrivero@sigsm.uy', 1),
(3, 'jgomez', '$2y$10$S13KZ3GUzeU3EVGoQu09S.q5VYpMi01Dd7LLWnLFuuLLBN7LB/giW', 'Julian', 'Gomez', 'jgomez@sigsm.uy', 0),
(4, 'pepito', '$2y$10$o7BP8hxsDNWU9n5c2UOIa.HEc4cadgR5iPXSis7I8W9jIynj6HK6.', 'Jorge', 'Acosta', 'acosta@sigsm.uy', 0);

INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`, `fecha_asignacion`) VALUES
(1, 1, '2026-08-19'),
(1, 2, '2026-08-19'),
(2, 2, '2026-08-19'),
(3, 2, '2026-08-19'),
(4, 2, '2026-08-20');

INSERT INTO `rol` (`id_rol`, `nombre_rol`, `descripcion`) VALUES
(1, 'administrador', 'Acceso total al sistema y gestion de usuarios'),
(2, 'usuario_basico', 'Consulta y carga de documentacion de pacientes');