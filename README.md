# Proyecto S.I.G.S.M

Proyecto desarrollado por estudiantes de **3º MJ del ISBO**.

## Integrantes

* Facundo Pintos
* Felipe Borca
* Victoria Priscal
* Ignacio Núñez

## Descripción

El sistema se divide en dos módulos principales:

* **Módulo de encuestas:** permite crear y gestionar documentos médicos y encuestas accesibles mediante códigos QR.
* **Módulo de transporte:** permite gestionar solicitudes y traslados de ambulancias.

Además, el sistema cuenta con funcionalidades comunes de autenticación, permisos, seguridad y validaciones.

## Tecnologías utilizadas

* HTML
* CSS
* JavaScript
* Bootstrap
* PHP
* MariaDB
* Debian
* Git
* GitHub
* Visual Studio Code
* XAMPP 8
* VirtualBox

## Estructura del proyecto

```text
Proyecto/
├── elementosComunes/
│   ├── autentificaciones/
│   ├── baseDeDatos/
│   │   ├──modUsr
│   │   ├──modDocs
│   │   ├──modLogin
│   │   └──documentacion    
│   ├── imagenes/
│   ├── Permisos/
│   ├── seguridad/
│   └── validaciones/
│
├── encuestasMod/
│   ├── controlador/
│   ├── modelo/
│   └── vista/ -Esta carpeta tambien contiene los archivos HTML de dicho modulo
│       ├── css/
│       └── js/
│
├── transporteMod/
│   ├── controlador/
│   ├── modelo/
│   └── vista/ -Esta carpeta tambien contiene los archivos HTML de dicho modulo
│       ├── css/
│       └── js/
│
├── login/
│   ├── controlador/
│   ├── modelo/
│   └── vista/ -Esta carpeta tambien contiene los archivos HTML de dicho modulo
│       ├── css/
│       └── js/
│
└── README.md
```

## Instalación

### 1. Clonar el repositorio

Ejecutar:

```
git clone https://github.com/favinafe/proyecto-3-MJ-favinafe
```

### 2. Copiar el proyecto a XAMPP

Copiar la carpeta del proyecto dentro del directorio `htdocs` de XAMPP.


### 3. Iniciar XAMPP

Iniciar los servicios necesarios de **Apache** y **MariaDB** desde XAMPP.

### 4. Acceder al sistema

Abrir el navegador y acceder a:

```text
http://localhost/Proyecto/
```

## Convención de commits

Para los comits se usan las siguientes abreviaturas :

| Prefijo    | Uso                                                                                                
| ---------- | -------------------------------------------------------------------------------------------------- 
| `feat`     | Añadir una nueva funcionalidad.                                                                    
| `fix`      | Corregir un error o problema existente.                                                            
| `style`    | Modificar estilos CSS, HTML o scripts de JavaScript sin cambiar la funcionalidad.                  
| `docs`     | Modificar documentación.                                                               
| `refactor` | Reorganizar código o modificar la estructura de directorios/archivos sin cambiar la funcionalidad.

