repositorio: https://github.com/favinafe/Proyecto

Descripción:

Proyecto desarrollado por 3ºMJ del ISBO.
Integrantes:
Facundo Pintos
Felipe Borca
Victoria Priscal
Ignacio Núñez

El sistema se separa en dos modulos. Uno que permite crear y gestionar
documentos medicos y encuestas accesibles mediante un QR.
El otro permite gestionar solicitudes y traslados de hambulancias.

Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Bootstrap 
- PHP
- MariaDB
- Debian
- Git
- GitHub
-Visual Studio
-XAMPP 8
-Debian
-VirtualBox


 Estructura del proyecto
```
proyecto-3-MJ-favinafe
├──elementosComunes
│      ├──autentificaciones
│      ├──conexiónDB  
│      ├──imagenes 
│      ├──Permisos
│      ├──seguridad
│      └──validaciones
├──encuestasMod
│      ├──controlador
│      ├──modelo
│      └──vista-  
│           ├──css
│           ├──html
│           └──js
├──transporteMod
│      ├──controlador
│      ├──-modelo
│      └──-vista 
│            ├──css 
│            ├──html            
│            └──js
│
├──login
│    ├──-controlador
│    ├──-modelo
│    └──-vista 
│          ├──css
│          ├──html
│          └──js
├──documentación
└── -README.md
```

 Instalación

1- Clonar el repositorio con el siguiente comando:
git clone https://github.com/favinafe/Proyecto

2- Copiar la carpeta proyecto-3-MJ-favinafe/ dentro de htdocs/ (XAMPP) 
    
3- Abrir http://localhost/sigsm/ en el navegador.




 Convención de commits

- feat - se usa cuando se añade una nueva funcionalidad.
- fix - se usa al corregir un error.
- style - se usa si se cambia algun estilo de css, un html, o un script de js.
- docs - se usa cuando se modifica algun archivo de la documentación o el readme.
- refactor - se usa cuando se reordenan directorios o cambian de nombre algun archivo.