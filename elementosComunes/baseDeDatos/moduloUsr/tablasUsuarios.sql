CREATE TABLE 'usuario' (
  'idUsuario' int(11) AUTO_INCREMENT NOT NULL ,
  'nombreUsuario' varchar(50) NOT NULL CHECK (octet_length('nombresuario') >= 4),
  'contrasenaHash' varchar(255) NOT NULL,
  'nombre' varchar(50) NOT NULL,
  'apellido' varchar(50) NOT NULL,
  'email' varchar(120) NOT NULL CHECK ('email' like '%_@_%.__%'),
  'activo' tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (idUsuario)
) 

CREATE TABLE 'usuarioRol' (
  'idUsuario' int(11) NOT NULL,
  'idRol' int(11) PRIMARY KEY ,
  'fechaAsignacion' DATE DEFAULT (CURDATE()) NOT NULL,
    PRIMARY KEY (idUsuario,idRol),

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

) 

CREATE TABLE 'rol' (
   'idRol' int(11) AUTO_INCREMENT NOT NULL,
   'nombreRol' ENUM('admin','usrHambulncia','usrDocs') NOT NULL UNIQUE,
   'descripcion' varchar(160) NULL,
   PRIMARY KEY ('idRol') 
) 
