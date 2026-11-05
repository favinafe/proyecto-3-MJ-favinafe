const form = document.getElementById("formLogin");
const solUsr = document.getElementById("usuario");
const solPasw = document.getElementById("contrasena");
const pUsr = document.getElementById("pUsr");
const pPaswd = document.getElementById("pPaswd");

form.addEventListener("submit", (login) => {
    login.preventDefault();

    const usuario = solUsr.value.trim();
    const contrasena = solPasw.value;

    let usrValido = true;
    let pasValido = true;

    // Limpiar mensajes anteriores
    pUsr.textContent = "";
    pPaswd.textContent = "";

    if (usuario.length <= 4 || usuario.length >= 25 || usuario.includes(" ")) {
        usrValido = false;
    }

    if (contrasena.length <= 4 || contrasena.length >= 25) {
        pasValido = false;
    }

    if (!usrValido) {
        pUsr.textContent = "Usuario incorrecto";
    }

    if (!pasValido) {
        pPaswd.textContent = "Contraseña incorrecta";
    }

    if (usrValido && pasValido) {
        window.location.href = "/proyecto-3-MJ-favinafe/login/vista/panel";
    }
});