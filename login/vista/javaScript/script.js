const msg = document.getElementById('msg');
const mostrar = (texto, tipo) => { msg.textContent = texto; msg.className = 'msg ' + tipo; };

const login = document.getElementById('login');
if (login) {
  login.addEventListener('submit', e => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const clave = document.getElementById('clave').value;
    if (!usuario || !clave) return mostrar('Completá usuario y contraseña.', 'error');
    const r = Sesion.login(usuario, clave);
    if (r.error) return mostrar(r.error, 'error');
    window.location.href = 'login/vista/panel.html';
  });
}

const recup = document.getElementById('recuperacion');
if (recup) {
  recup.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const problema = document.getElementById('problema').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrar('Ingresá un email válido.', 'error');
    if (!problema) return mostrar('Explicá tu problema.', 'error');
    mostrar('Solicitud enviada. Te contactaremos pronto.', 'ok');
    recup.reset();
  });
}
