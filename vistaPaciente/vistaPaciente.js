// Vista del paciente: categorías -> documentos de la categoría -> el archivo se abre directamente en otra pestaña.
// Lee los documentos que se cargan en el módulo de documentos (mismos datos que ../db.js).
const app = document.getElementById('app');
const titulo = document.getElementById('titulo');
const LOGO = '../img/logo.png';

const docsDe = id => DB.where('documento', d => d.activo && d.idCategoria == id)
  .sort((a, b) => String(b.fechaCarga).localeCompare(String(a.fechaCarga)) || b.idDocumento - a.idDocumento);

// Los archivos subidos quedan en "archivos/" (carpeta de la raíz); desde este sitio hay que subir un nivel.
const urlArchivo = u => {
  u = String(u || '').trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u) || !u) return null; // otros esquemas (javascript:, data:...) no se enlazan
  return '../' + u.replace(/^\/+/, '');
};

const tile = (href, texto, nueva) =>
  `<a class="tile" href="${esc(href)}"${nueva ? ' target="_blank" rel="noopener"' : ''}><img src="${LOGO}" alt=""><span>${esc(texto)}</span></a>`;
const atras = href => `<a class="btn atras" href="${esc(href)}">Atrás</a>`;

function vistaCategorias() {
  document.title = 'Hospital de Clínicas - Categorías';
  titulo.textContent = 'Categorías';
  const cats = DB.all('categoria');
  app.innerHTML = cats.length
    ? `<div class="mosaico">${cats.map(c => tile('#categoria-' + c.idCategoria, c.nombre)).join('')}</div>`
    : '<p class="vacio">Todavía no hay categorías.</p>';
}

function vistaCategoria(cat) {
  document.title = cat.nombre + ' - Hospital de Clínicas';
  titulo.textContent = cat.nombre;
  const docs = docsDe(cat.idCategoria);
  app.innerHTML = (docs.length
    ? `<div class="mosaico">${docs.map(d => tile(urlArchivo(d.archivoUrl) || '#', d.titulo, !!urlArchivo(d.archivoUrl))).join('')}</div>`
    : '<p class="vacio">Esta categoría todavía no tiene documentos.</p>') + atras('#');
}

function ruta() {
  const h = location.hash.slice(1);
  let m;
  window.scrollTo(0, 0);
  if ((m = h.match(/^categoria-(\d+)$/)) && DB.get('categoria', m[1])) return vistaCategoria(DB.get('categoria', m[1]));
  vistaCategorias();
}
window.addEventListener('hashchange', ruta);
ruta();
