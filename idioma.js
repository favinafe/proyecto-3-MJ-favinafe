/* Selector de idioma (Español / English).
   El texto original está en español; en inglés se traduce lo que se ve en pantalla
   usando el diccionario D y unos pocos patrones. El idioma se guarda en localStorage. */
(function () {
  const D = {
    // ----- Ingreso / recuperación -----
    'Bienvenido': 'Welcome', 'Usuario:': 'Username:', 'Contraseña:': 'Password:', 'Confirmar': 'Confirm',
    'No puedo entrar': "I can't log in", 'Recuperación': 'Recovery', 'Email:': 'Email:',
    'Explica tu problema:': 'Describe your problem:', 'Atrás': 'Back',
    'Hospital de Clínicas - Ingreso': 'Hospital de Clínicas - Login',
    'Hospital de Clínicas - Recuperación': 'Hospital de Clínicas - Recovery',
    'Completá usuario y contraseña.': 'Enter your username and password.',
    'Usuario o contraseña incorrectos.': 'Incorrect username or password.',
    'Tu usuario está inactivo. Contactá a un administrador.': 'Your user is inactive. Contact an administrator.',
    'Ingresá un email válido.': 'Enter a valid email.', 'Explicá tu problema.': 'Describe your problem.',
    'Solicitud enviada. Te contactaremos pronto.': 'Request sent. We will contact you soon.',

    // ----- Estructura general -----
    'Cerrar sesión': 'Log out', 'Traslados': 'Transfers', 'Documentación': 'Documentation',
    'Usuarios': 'Users', 'Encuestas': 'Surveys',
    'Módulo de documentos': 'Documents module',
    'Módulo de administración de usuarios': 'User administration module',
    'Módulo de trazabilidad de ambulancias': 'Ambulance tracking module',
    'Módulo de encuestas': 'Surveys module',
    'Trazabilidad de ambulancias': 'Ambulance tracking', 'Gestor de documentos': 'Document manager',
    'Gestor de usuarios': 'User manager', 'Gestor de encuestas': 'Survey manager',
    'Buscar': 'Search', 'Buscar...': 'Search...', 'Sin resultados': 'No results', 'Listo.': 'Done.',
    'Seleccioná una fila primero.': 'Select a row first.', 'Verificando...': 'Verifying...',
    'Borrar': 'Delete', 'Editar': 'Edit', 'Cerrar': 'Close', 'Crear': 'Create', 'Acción': 'Action',
    '¿Borrar el documento seleccionado?': 'Delete the selected document?',
    '¿Dar de baja al usuario seleccionado?': 'Deactivate the selected user?',
    '¿Borrar la solicitud seleccionada y su traslado?': 'Delete the selected request and its transfer?',
    'No podés dar de baja tu propio usuario.': "You can't deactivate your own user.",

    // ----- Documentos -----
    'Categoría': 'Category', 'Crear documento': 'Create document', 'Nombre': 'Name', 'Fecha': 'Date',
    'Abrir': 'Open', 'Nombre:': 'Name:', 'Descripción:': 'Description:', 'Archivo:': 'File:', 'Categoría:': 'Category:',

    // ----- Usuarios -----
    'Usuario': 'User', 'Email': 'Email', 'Rol': 'Role', 'Estado': 'Status', 'Activo': 'Active', 'Inactivo': 'Inactive',
    'Tipo de usuario': 'User type', 'Crear Usuario': 'Create user', 'Crear usuario': 'Create user',
    'Editar usuario': 'Edit user', 'Apellido:': 'Last name:', 'Rol:': 'Role:',
    'Contraseña (vacío = no cambiar):': 'Password (empty = no change):', 'Aplicar cambios': 'Apply changes',

    // ----- Traslados -----
    'chofer': 'driver', 'destino': 'destination', 'elemento': 'item', 'canal': 'channel',
    'Crear solicitud': 'Create request', 'Ver': 'View', 'Vista solicitud': 'Request details',
    'Chofer:': 'Driver:', 'Motivo:': 'Reason:', 'Enfermero:': 'Nurse:', 'Tipo de vehículo:': 'Vehicle type:',
    'Proveedor:': 'Provider:', 'Vehículo:': 'Vehicle:', 'Paciente:': 'Patient:',
    '¿Qué se transporta?:': 'What is being transported?:', 'Destino:': 'Destination:', 'Canal:': 'Channel:',
    'Estado / fecha:': 'Status / date:', 'Historial': 'History',

    // ----- Encuestas -----
    'Estadísticas de satisfacción': 'Satisfaction statistics', 'Título': 'Title', 'Segmento': 'Segment',
    'Respuestas': 'Responses', 'Ver preguntas': 'View questions',
    'Extremadamente positivas': 'Extremely positive', 'Mayormente positivas': 'Mostly positive',
    'Variadas': 'Mixed', 'Mayormente negativas': 'Mostly negative', 'Extremadamente negativas': 'Extremely negative',

    // ----- Mensajes del servidor (verificar.php) -----
    'No se pueden dejar casillas vacías.': 'Fields cannot be left empty.',
    'Es obligatorio subir un archivo.': 'You must upload a file.',
    'Ya existe un documento con ese nombre.': 'A document with that name already exists.',
    'El mail tiene que tener un @.': 'The email must contain an @.',
    'Ese nombre de usuario ya existe.': 'That username already exists.',
    'Ese email ya está en uso.': 'That email is already in use.',
    'La contraseña tiene que tener al menos 8 caracteres.': 'The password must have at least 8 characters.',
    'Tipo de archivo no permitido. Solo PDF, Word, Excel, PowerPoint, texto u OpenDocument.': 'File type not allowed. Only PDF, Word, Excel, PowerPoint, text or OpenDocument.',
    'El archivo no es un PDF válido.': 'The file is not a valid PDF.',
    'El archivo no es un documento válido.': 'The file is not a valid document.',
    'El archivo supera el tamaño máximo permitido por el servidor.': 'The file exceeds the maximum size allowed by the server.',
    'El archivo es demasiado grande.': 'The file is too large.',
    'El archivo se subió de forma incompleta.': 'The file was only partially uploaded.',
    'Error al subir el archivo.': 'Error uploading the file.',
    'Subida no válida.': 'Invalid upload.',
    'Nombre de archivo no permitido.': 'File name not allowed.',
    'El archivo debe tener un nombre y una extensión.': 'The file must have a name and an extension.',
    'No se pudo guardar el archivo.': 'The file could not be saved.',
    'No se pudo crear la carpeta de archivos.': 'The files folder could not be created.',
    'Método no permitido.': 'Method not allowed.', 'Acción no válida.': 'Invalid action.',
    'La app está abierta como archivo (file://). Abrila desde un servidor con PHP, por ejemplo http://localhost:8000 con "php -S localhost:8000" o XAMPP.':
      'The app is open as a file (file://). Open it from a PHP server, e.g. http://localhost:8000 with "php -S localhost:8000" or XAMPP.',

    // ----- Datos de ejemplo -----
    'administrador': 'administrator', 'usuario de documentos': 'documents user',
    'usuario de ambulancias': 'ambulance user', 'usuario de encuestas': 'surveys user',
    'Ginecología y Obstetricia': 'Gynecology and Obstetrics', 'Urología': 'Urology', 'Imagenología': 'Imaging',
    'Medicina Nuclear': 'Nuclear Medicine', 'Cardiología': 'Cardiology', 'Nefrología y Trasplante': 'Nephrology and Transplant',
    'Interrupción voluntaria del embarazo': 'Voluntary termination of pregnancy', 'Prostatectomía radical': 'Radical prostatectomy',
    'Preparación para estudios imagenológicos': 'Preparation for imaging studies',
    'Estudios diagnósticos con pertecnetato': 'Diagnostic studies with pertechnetate',
    'Centellograma de perfusión miocárdica': 'Myocardial perfusion scintigraphy',
    'Ecocardiograma con dobutamina': 'Dobutamine echocardiogram', 'Pacientes en tratamiento con warfarina': 'Patients on warfarin treatment',
    'Ecocardiograma transesofágico': 'Transesophageal echocardiogram', 'Ingreso a Nefrología y Trasplante': 'Admission to Nephrology and Transplant',
    'Plan de alta enfermería, Nefrología': 'Nursing discharge plan, Nephrology', 'Enfermería para usuarios trasplantados': 'Nursing care for transplant patients',
    'Prevención de infecciones': 'Infection prevention',
    'Documentos médicos': 'Medical documents', 'Información general': 'General information',
    'Historia clínica': 'Medical record', 'Indicaciones médicas': 'Medical instructions',
    'Información al paciente': 'Patient information',
    'Satisfacción del servicio': 'Service satisfaction', 'Calidad de atención': 'Quality of care',
    'Experiencia de traslado': 'Transfer experience', 'Pacientes': 'Patients',
    '¿Cómo calificaría la atención recibida?': 'How would you rate the care received?',
    '¿Qué tan satisfecho está con el servicio?': 'How satisfied are you with the service?',
    '¿El personal fue amable?': 'Was the staff friendly?',
    '¿La información recibida fue clara?': 'Was the information received clear?',
    '¿Cómo calificaría el traslado?': 'How would you rate the transfer?',
    'Excelente': 'Excellent', 'Buena': 'Good', 'Bueno': 'Good', 'Regular': 'Fair', 'Mala': 'Poor', 'Malo': 'Poor',
    'Muy satisfecho': 'Very satisfied', 'Satisfecho': 'Satisfied', 'Poco satisfecho': 'Slightly satisfied',
    'Insatisfecho': 'Dissatisfied', 'Sí': 'Yes', 'No': 'No',
    'Camilla': 'Stretcher', 'Silla de ruedas': 'Wheelchair', 'Oxígeno': 'Oxygen', 'Monitor': 'Monitor',
    'Ambulancia básica': 'Basic ambulance', 'Ambulancia avanzada': 'Advanced ambulance', 'Unidad de traslado': 'Transfer unit',
    'Teléfono': 'Phone', 'Aplicación web': 'Web app', 'Presencial': 'In person', 'Correo electrónico': 'Email',
    'Solicitado': 'Requested', 'Asignado': 'Assigned', 'En camino': 'On the way',
    'Paciente trasladado': 'Patient transferred', 'Finalizado': 'Completed', 'Cancelado': 'Cancelled',
    'pendiente': 'pending', 'enCurso': 'in progress', 'finalizado': 'completed',
    'Hospital Central': 'Central Hospital', 'Policlínica Norte': 'North Polyclinic', 'Hospital del Sur': 'South Hospital',
    'Domicilio': 'Home',
    'Servicio de Ambulancias Norte': 'North Ambulance Service', 'Emergencias Médicas Uruguay': 'Uruguay Medical Emergencies',
    'Traslados Salud': 'Health Transfers',
    'Consulta médica': 'Medical consultation', 'Derivación médica': 'Medical referral', 'Control médico': 'Medical check-up',
    'Paciente requiere traslado con camilla.': 'Patient requires transfer by stretcher.',
    'Traslado interhospitalario.': 'Inter-hospital transfer.', 'Traslado desde domicilio.': 'Transfer from home.',
    'Solicitud recibida.': 'Request received.', 'Vehículo y personal asignados.': 'Vehicle and staff assigned.',
    'Vehículo salió hacia el origen.': 'Vehicle left for the pickup point.', 'Traslado en curso.': 'Transfer in progress.',
    'Traslado finalizado.': 'Transfer completed.'
  };

  // Roles: se reconocen aunque cambien mayúsculas, tildes o espacios ("Administrador", "Usuario de Documentos"...)
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const ROLES = {};
  ['administrador', 'usuario de documentos', 'usuario de ambulancias', 'usuario de encuestas'].forEach(r => { ROLES[norm(r)] = D[r]; });
  const t1 = s => {
    if (Object.prototype.hasOwnProperty.call(D, s)) return D[s];
    const k = norm(s);
    if (Object.prototype.hasOwnProperty.call(ROLES, k)) {
      const r = ROLES[k];
      return /^[A-ZÁÉÍÓÚÑ]/.test(s) ? r[0].toUpperCase() + r.slice(1) : r;
    }
    return undefined;
  };

  // Traduce un texto (sin espacios sobrantes en los bordes)
  function tr(s) {
    let r = t1(s);
    if (r !== undefined) return r;
    let m;
    if ((m = s.match(/^Encuestas completadas: (\d+)$/))) return 'Completed surveys: ' + m[1];
    if ((m = s.match(/^(.+): (\d+)$/)) && t1(m[1])) return t1(m[1]) + ': ' + m[2];               // estadísticas
    if ((m = s.match(/^(\d+)\. (.+)$/)) && t1(m[2])) return m[1] + '. ' + t1(m[2]);              // preguntas
    if ((m = s.match(/^(\d{4}-\d{2}-\d{2}[\d :]*) — (.+?): (.*)$/)))                              // historial
      return m[1] + ' — ' + (t1(m[2]) || m[2]) + ': ' + (t1(m[3]) || m[3]);
    if ((m = s.match(/^(pendiente|enCurso|finalizado) — (.*)$/))) return t1(m[1]) + ' — ' + m[2]; // estado / fecha
    if ((m = s.match(/^(.+) → (.+?)( \(\d+ km\))?$/)) && (t1(m[1]) || t1(m[2])))                  // rutas
      return (t1(m[1]) || m[1]) + ' → ' + (t1(m[2]) || m[2]) + (m[3] || '');
    if (s.includes(', ')) { const p = s.split(', '); if (p.every(x => t1(x))) return p.map(t1).join(', '); } // roles
    if ((m = s.match(/^El contenido del archivo no coincide con su extensión \((.+)\)\.$/))) return 'The file content does not match its extension (' + m[1] + ').';
    if ((m = s.match(/^El archivo debe pesar entre 1 byte y (\d+) MB\.$/))) return 'The file must weigh between 1 byte and ' + m[1] + ' MB.';
    if ((m = s.match(/^El nombre del archivo es demasiado largo \(máx\. (\d+) caracteres\)\.$/))) return 'The file name is too long (max. ' + m[1] + ' characters).';
    if ((m = s.match(/^Error interno de PHP: (.*)$/))) return 'Internal PHP error: ' + m[1];
    if ((m = s.match(/^No se pudo conectar con el servidor \((.*)\)\.$/))) return 'Could not connect to the server (' + m[1] + ').';
    if (/^El servidor respondió \d+ pero no ejecutó verificar\.php/.test(s))
      return 'The server did not run verificar.php (is PHP active on this server?). Check that you opened the app through XAMPP or "php -S".';
    return s;
  }

  const trTexto = s => { const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/); return m[2] ? m[1] + tr(m[2]) + m[3] : s; };

  if (typeof module !== 'undefined') module.exports = { tr, D };
  if (typeof document === 'undefined') return;

  // ---------- Idioma guardado ----------
  const K = 'sigsm_lang';
  let lang = 'es';
  try { lang = localStorage.getItem(K) === 'en' ? 'en' : 'es'; } catch (e) {}

  // ---------- Botón ----------
  // Banderas dibujadas en SVG (los emojis de bandera no se ven en Windows: salen como "ES" / "US")
  const BANDERAS = {
    es: '<svg class="bandera" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>',
    en: '<svg class="bandera" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/>' +
        [0, 2, 4, 6, 8, 10, 12].map(i => '<rect y="' + (i * 20 / 13).toFixed(2) + '" width="30" height="' + (20 / 13).toFixed(2) + '" fill="#b22234"/>').join('') +
        '<rect width="12" height="10.77" fill="#3c3b6e"/>' +
        [2, 5, 8, 11].map(y => [2, 5, 8, 11].map(x => '<circle cx="' + (x - 0.4 + (y % 2 ? 0 : 0)) + '" cy="' + (y - 0.3) + '" r=".7" fill="#fff"/>').join('')).join('') +
        '</svg>'
  };
  const css = document.createElement('style');
  css.textContent =
    // mismo aspecto que .btn / .esquina del resto de la aplicación
    '.langbtn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-style:italic;white-space:nowrap}' +
    '.langbtn .bandera{height:.8em;width:auto;border:1px solid rgba(0,0,0,.35);border-radius:2px}' +
    '.langbtn.fijo{position:fixed;top:36px;right:56px;padding:10px 40px;font-size:25px;z-index:100}' +
    '.top .langbtn{margin-left:0}' +
    '@media(max-width:700px){.langbtn.fijo{position:static;margin-top:20px}}';
  document.head.appendChild(css);

  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'btn langbtn';
  btn.innerHTML = BANDERAS[lang === 'en' ? 'es' : 'en'] + '<span>' + (lang === 'en' ? 'Español' : 'English') + '</span>';
  btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
  btn.addEventListener('click', () => {
    try { localStorage.setItem(K, lang === 'en' ? 'es' : 'en'); } catch (e) {}
    location.reload();
  });
  const top = document.querySelector('.top');
  if (top) top.appendChild(btn); else { btn.classList.add('fijo'); document.body.appendChild(btn); }

  if (lang !== 'en') return;

  // ---------- Traducción de la pantalla ----------
  document.documentElement.lang = 'en';
  document.title = tr(document.title);
  const confirmOriginal = window.confirm.bind(window);
  window.confirm = txt => confirmOriginal(tr(String(txt)));

  const ATTRS = ['placeholder', 'title', 'aria-label'];
  function traducir(nodo) {
    if (nodo.nodeType === 3) {
      const p = nodo.parentNode;
      if (p && /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
      if (p && p.classList && p.classList.contains('langbtn')) return;
      const n = trTexto(nodo.nodeValue);
      if (n !== nodo.nodeValue) nodo.nodeValue = n;
    } else if (nodo.nodeType === 1) {
      if (nodo.classList.contains('langbtn') || /^(SCRIPT|STYLE)$/.test(nodo.nodeName)) return;
      ATTRS.forEach(a => { if (nodo.hasAttribute(a)) { const v = nodo.getAttribute(a), n = trTexto(v); if (n !== v) nodo.setAttribute(a, n); } });
      nodo.childNodes.forEach(traducir);
    }
  }
  traducir(document.body);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'characterData') traducir(m.target);
    else m.addedNodes.forEach(traducir);
  })).observe(document.body, { childList: true, characterData: true, subtree: true });
})();
