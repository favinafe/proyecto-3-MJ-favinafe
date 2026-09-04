CREATE TABLE documento (
    'idDocumento' int(11) AUTO_INCREMENT NOT NULL,
    'idCategoria' int(11)  NOT NULL, 
    'idUsuario' int(11)  NOT NULL,
    'titulo' varchar(40) NOT NULL UNIQUE,
    'descripcion' varchar(160) NOT NULL UNIQUE,
    'archivoUrl' varchar(160) NOT NULL UNIQUE CHECK (archivoUrl LIKE '%/%'),
    'fechaCarga' DATE DEFAULT (CURDATE()) NOT NULL,
    'fechaAsignacion' DATE DEFAULT (CURDATE()) NOT NULL,
    'activo' tinyint(1) NOT NULL DEFAULT 1,
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

CREATE TABLE categoria (
    'idCategoria' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(30),
    'descripcion' varchar(150),
    'codigoQrUrl' varchar(150),

    PRIMARY KEY (idCategoria)
); 

CREATE TABLE encuesta(
    'idEncuesta' int(11) AUTO_INCREMENT NOT NULL,
    'idCategoria'int(11) NOT NULL,
    'titulo' varchar(30),
    'segmento' varchar(30),
    PRIMARY KEY (idEncuesta),
    
        CONSTRAINT fkEncCat
        FOREIGN KEY (idCategoria)
        REFERENCES categoria (idCategoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE

); 

CREATE TABLE respuestaEncuesta (
    'idRespuestaEncuesta' int(11) AUTO_INCREMENT NOT NULL,
    'idEncuesta' int(11) NOT NULL,
    'fechaEnvio' DATE DEFAULT (CURDATE()) NOT NULL,

    PRIMARY KEY (idRespuestaEncuesta),
    
    CONSTRAINT fkReenEnc
        FOREIGN KEY (idEncuesta)
        REFERENCES encuesta (idEncuesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
); 

CREATE TABLE respuestaPregunta(
    'idRespuestaPregunta'int(11) AUTO_INCREMENT NOT NULL,
    'idRespuestaEncuesta'int(11) NOT NULL,
    'idPregunta'int(11) NOT NULL,
    'idOpcion'int(11) NOT NULL,
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

CREATE TABLE opcionRespuesta(
    'idOpcion' int(11) AUTO_INCREMENT NOT NULL,
    'idPregunta' int(11) NOT NULL,
    'textoOpcion' varchar(60),

    PRIMARY KEY (idOpcion),

    CONSTRAINT opcPreg
        FOREIGN KEY (idPregunta)
        REFERENCES pregunta (idPregunta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE pregunta (
    'idPregunta' int(11) AUTO_INCREMENT NOT NULL,
    'idEncuesta' int(11) NOT NULL,
    'txtPregunta' varchar(60),
    'orden' int, 

    PRIMARY KEY (idPregunta),

    CONSTRAINT pregEnc
        FOREIGN KEY (idEncuesta)
        REFERENCES encuesta (idEncuesta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
