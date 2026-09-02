CREATE TABLE 'tipoElemento' (
    'idTipoElemento' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) NOT NULL,
    'descripcion' varchar(40) NOT NULL,

    PRIMARY KEY (idTipoElemento)
)  
CREATE TABLE 'compatibilidad' (
    'idTipoVehiculo' int(11) NOT NULL,
    'idTipoElemento' int(11) NOT NULL,
    
    PRIMARY KEY (idTipoVehiculo,idTipoElemento),
    
    CONSTRAINT fkComTVeh
        FOREIGN KEY (idTipoVehiculo)
        REFERENCES tipoVehiculo (idTipoVehiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkComTElem
        FOREIGN KEY (idTipoElemento)
        REFERENCES tipoElemento (idTipoElemento)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
) 

CREATE TABLE 'solicitudTraslado' (
    'idSolicitud' int(11) AUTO_INCREMENT NOT NULL,           
    'ciPaciente' int(11) NOT NULL,      
    'idTipoElemento' int(11) NOT NULL,     
    'idRuta' int(11) NOT NULL,                   
    'idCanal' int(11) NOT NULL,           
    'idUsuario' int(11) NOT NULL,              
    'fechaSolicitud' DATE DEFAULT (CURDATE()) NOT NULL,
    'motivo' varchar(100),      
    'estadoSolicitud' ENUM('pendiente', 'enCurso', 'finalizado') NOT NULL,    
    'descripcion' varchar(100),        

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
        ON UPDATE CASCADE,
) 
CREATE TABLE 'paciente' (
    'ciPaciente' int(9) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) NOT NULL,
    'apellido' varchar(40) NOT NULL,
    'fechaNacimiento' DATE NOT NULL,

    PRIMARY KEY (ciPaciente)
) 
CREATE TABLE 'ruta' (
    'idRuta' int(11) AUTO_INCREMENT NOT NULL,
    'origen' varchar(40) NOT NULL,
    'destino' varchar(40) NOT NULL,
    'descripcion' varchar(40) NOT NULL,
    'distanciaKm' varchar(40) NOT NULL,

    PRIMARY KEY (idRuta)
) 

CREATE TABLE 'canalSolicitud' (
    'idCanal' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40),

    PRIMARY KEY (idCanal)
) 

CREATE TABLE 'estadoTraslado' (
    'idEstado' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) 

    PRIMARY KEY (idEstado)
) 

CREATE TABLE 'historialEstado' (
    'idHistorial' int(11) AUTO_INCREMENT NOT NULL,
    'idTraslado' int(11) NOT NULL,
    'idEstado' int(11) NOT NULL,
    'horaLlegada' DATETIME DEFAULT CURRENT_TIMESTAMP,
    'observaciones' varchar(100),
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
        ON UPDATE CASCADE,   
) 


CREATE TABLE 'proveedor' (
    'idProveedor' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) NOT NULL,
    'contacto' varchar(40) NOT NULL,

    PRIMARY KEY (idProveedor),
) 

CREATE TABLE 'traslado' (
    'idTraslado' int(11) AUTO_INCREMENT NOT NULL,
    'idSolicitud' int(11) NOT NULL,
    'idVehiculo' int(11) NOT NULL,
    'idChofer' int(11) NOT NULL,
    'idEnfermero' int(11) NOT NULL,
    'idProveedor' int(11) NOT NULL,
    'idRuta' int(11) NOT NULL,
    'horaSalida' DATETIME NOT NULL,
    'horaLlegada' DATETIME DEFAULT CURRENT_TIMESTAMP,
    
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
        FOREIGN KEY (idChofer)
        REFERENCES chofer (idChofer)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fkTraEnf
        FOREIGN KEY (idEnfermero)
        REFERENCES enfermero (idEnfermero)
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

) 

CREATE TABLE 'tipoVehiculo' (
    'idTipoVehiculo' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) NOT NULL,
    'fechaEnvio' DATE DEFAULT (CURDATE()) NOT NULL,

    PRIMARY KEY (idTipoVehiculo)
) 

CREATE TABLE 'vehiculo' (
    'idVehiculo' int(11) AUTO_INCREMENT NOT NULL,
    'idTipoVehiculo' int(11) NOT NULL,
    'matricula' varchar(7) NOT NULL UNIQUE,
    'marca' varchar(40) NOT NULL,
    'modelo' varchar(40) NOT NULL,
    'activo' tinyint(1) NOT NULL DEFAULT 1,

    PRIMARY KEY (idVehiculo),
    
    CONSTRAINT fkVehTipoveh
        FOREIGN KEY (idTipoVehiculo)
        REFERENCES tipoVehiculo (idTipoVehiculo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) 

CREATE TABLE 'enfermero' (
    'idEnfermero' int(11) AUTO_INCREMENT NOT NULL,
    'CI' varchar(9) NOT NULL UNIQUE,
    'nombre' varchar(40) NOT NULL,
    'apellido' varchar(40) NOT NULL,

    PRIMARY KEY (idEnfermero)
)

CREATE TABLE 'chofer' (
    'idChofer' int(11) AUTO_INCREMENT NOT NULL,
    'nombre' varchar(40) NOT NULL,
    'apellido' varchar(40) NOT NULL,

    PRIMARY KEY (idChofer)
) 
