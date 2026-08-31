CREATE TABLE `usuario` (
  `idUsuario` int(11) AUTO_INCREMENT NOT NULL ,
  `nombreUsuario` varchar(50) NOT NULL CHECK (octet_length(`nombre_usuario`) >= 4),
  `contrasenaHash` varchar(255) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(120) NOT NULL CHECK (`email` like '%_@_%.__%'),
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuarioRol` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) PRIMARY KEY ,
  `fechaAsignacion` DATE DEFAULT (CURDATE()) NOT NULL,
    PRIMARY KEY (),

    CONSTRAINT fk_ur_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
    CONSTRAINT fk_ur_rol
    FOREIGN KEY (idRol)
    REFERENCES rol (idRol)
    ON DELETE RESTRICT
    ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rol` (
   `idRol` int(11) AUTO_INCREMENT NOT NULL,
   `nombreRol` ENUM(`admin`,`usrHambulncia`,`usrDocs`) NOT NULL UNIQUE,
   `descripcion` varchar(160) NULL4,
   PRIMARY KEY (`idRol`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
