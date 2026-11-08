const form = document.getElementById("formLogin");
const solUsr = document.getElementById("usuario");
const solPasw = document.getElementById("contrasena");
const pUsr = document.getElementById("pUsr");
const pPaswd = document.getElementById("pPaswd");

form.addEventListener("submit", async (login) => {
    login.preventDefault();

    const usuario = solUsr.value.trim();
    const contrasena = solPasw.value;

    let usrValido = true;
    let pasValido = true;

    // Limpiar mensajes anteriores
    pUsr.textContent = "";
    pPaswd.textContent = "";

    //Pasa la pasw y el usr para hacer una validacion rapida, comprueva si usr>25 o < 4, si usr tiene " " y tambien el tamaño de pasw
    if (usuario.length <= 4 || usuario.length >= 25 || usuario.includes(" ")) 
    {
        usrValido = false;
    }

    if (contrasena.length <= 4 || contrasena.length >= 25) 
    {
        pasValido = false;
    }

    //Muestran los mensajes de error
    if (!usrValido) 
    {
        pUsr.textContent = "Usuario incorrecto";
    }

    if (!pasValido) 
    {
        pPaswd.textContent = "Contraseña incorrecta";
    }


    //Lo que ocurre si usr y pasw es valido
    if (usrValido && pasValido) 
        {
 //       try 
   //     {
            const resp = await fetch("login/controlador/iniciarSecion.php", 
            {
                method: "POST",
                body: new FormData(form),
                credentials: "same-origin" 
            });
            const data = await resp.json();
            
            if (data.valido) 
            {
                window.location.href = data.link; 
            }
            else
            {
                pUsr.textContent = "Usuario incorrecto";
                pPaswd.textContent = "Contraseña incorrecta";
            }
       // }
   //      catch (err) 
     //   {
       //     pUsr.textContent = "Error con el servidor";
         //   pPaswd.textContent = "Error con el servidor";
        //}    
};
   
});

  
   