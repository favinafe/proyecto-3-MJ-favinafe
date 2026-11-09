<?php
// Verificación de formularios en el servidor.
//   accion=solicitud  -> R1
//   accion=documento  -> R2, R3, R4 (+ tipo de archivo permitido)
//   accion=usuario    -> R5, R6, R7, R8
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
ob_start();
// Si PHP falla, devolver siempre JSON con el motivo
register_shutdown_function(function () {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        ob_end_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'error' => 'Error interno de PHP: ' . $e['message']], JSON_UNESCAPED_UNICODE);
    }
});

const CARPETA   = __DIR__ . '/archivos/';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// extensión => MIME(s) reales permitidos (se comprueban con el contenido, no con el nombre)
const PERMITIDOS = [
    'pdf'  => ['application/pdf'],
    'doc'  => ['application/msword', 'application/vnd.ms-office', 'application/octet-stream'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
    'odt'  => ['application/vnd.oasis.opendocument.text', 'application/zip'],
    'rtf'  => ['application/rtf', 'text/rtf', 'text/plain'],
    'txt'  => ['text/plain'],
    'xls'  => ['application/vnd.ms-excel', 'application/vnd.ms-office', 'application/octet-stream'],
    'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
    'ods'  => ['application/vnd.oasis.opendocument.spreadsheet', 'application/zip'],
    'ppt'  => ['application/vnd.ms-powerpoint', 'application/vnd.ms-office', 'application/octet-stream'],
    'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'],
    'odp'  => ['application/vnd.oasis.opendocument.presentation', 'application/zip'],
];

function responder(array $datos, int $codigo = 200): void {
    if (ob_get_level()) ob_end_clean();
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}
function fallar(string $mensaje, int $codigo = 200): void {
    responder(['ok' => false, 'error' => $mensaje], $codigo);
}
function campo(string $k): string {
    return trim((string)($_POST[$k] ?? ''));
}
function minus(string $s): string {
    return function_exists('mb_strtolower') ? mb_strtolower(trim($s), 'UTF-8') : strtolower(trim($s));
}
function existentes(): array {
    $j = json_decode((string)($_POST['existentes'] ?? '[]'), true);
    return is_array($j) ? $j : [];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fallar('Método no permitido.', 405);
}

switch ($_POST['accion'] ?? '') {

    // ---------- 20.1.1 Crear solicitud de traslados ----------
    case 'solicitud':
        // R1: no se pueden dejar casillas vacías
        foreach (['chofer', 'motivo', 'desc', 'enf', 'tv', 'prov', 'veh', 'pac', 'elem', 'ruta', 'canal'] as $k) {
            if (campo($k) === '') fallar('No se pueden dejar casillas vacías.');
        }
        responder(['ok' => true]);

    // ---------- 20.1.2 Crear documento ----------
    case 'documento':
        // R2: no se pueden dejar casillas vacías
        foreach (['titulo', 'desc', 'cat'] as $k) {
            if (campo($k) === '') fallar('No se pueden dejar casillas vacías.');
        }
        // R3: es obligatorio subir un archivo
        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] === UPLOAD_ERR_NO_FILE) {
            fallar('Es obligatorio subir un archivo.');
        }
        // R4: el nombre del documento no puede repetirse
        foreach (existentes() as $titulo) {
            if (minus((string)$titulo) === minus(campo('titulo'))) {
                fallar('Ya existe un documento con ese nombre.');
            }
        }
        $url = guardarArchivo($_FILES['archivo']);
        responder(['ok' => true, 'url' => $url]);

    // ---------- 20.1.3 Crear usuarios ----------
    case 'usuario':
        $editar = campo('editar') === '1';
        $id     = campo('id');
        // R5: no se pueden dejar casillas vacías (al editar, la contraseña vacía = no cambiarla)
        foreach (['nu', 'no', 'ap', 'em', 'rol'] as $k) {
            if (campo($k) === '') fallar('No se pueden dejar casillas vacías.');
        }
        $pw = (string)($_POST['pw'] ?? '');
        if (!$editar && $pw === '') fallar('No se pueden dejar casillas vacías.');
        // R6: el mail tiene que tener un @
        if (strpos(campo('em'), '@') === false) {
            fallar('El mail tiene que tener un @.');
        }
        // R7: el nombre de usuario y el email no pueden repetirse
        foreach (existentes() as $u) {
            if ($editar && (string)($u['id'] ?? '') === $id) continue;
            if (minus((string)($u['u'] ?? '')) === minus(campo('nu'))) fallar('Ese nombre de usuario ya existe.');
            if (minus((string)($u['e'] ?? '')) === minus(campo('em'))) fallar('Ese email ya está en uso.');
        }
        // R8: la contraseña tiene que tener al menos 8 caracteres
        if (($pw !== '' || !$editar) && (function_exists('mb_strlen') ? mb_strlen($pw, 'UTF-8') : strlen($pw)) < 8) {
            fallar('La contraseña tiene que tener al menos 8 caracteres.');
        }
        responder(['ok' => true]);

    default:
        fallar('Acción no válida.', 400);
}

// Valida que el archivo sea PDF o documento similar y lo guarda. Devuelve la URL relativa.
function guardarArchivo(array $f): string {
    if ($f['error'] !== UPLOAD_ERR_OK) {
        $errores = [
            UPLOAD_ERR_INI_SIZE   => 'El archivo supera el tamaño máximo permitido por el servidor.',
            UPLOAD_ERR_FORM_SIZE  => 'El archivo es demasiado grande.',
            UPLOAD_ERR_PARTIAL    => 'El archivo se subió de forma incompleta.',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal en el servidor.',
            UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo en el servidor.',
        ];
        fallar($errores[$f['error']] ?? 'Error al subir el archivo.');
    }
    if (!is_uploaded_file($f['tmp_name'])) fallar('Subida no válida.');
    if ($f['size'] <= 0 || $f['size'] > MAX_BYTES) {
        fallar('El archivo debe pesar entre 1 byte y ' . (MAX_BYTES / 1024 / 1024) . ' MB.');
    }

    // Nombre seguro
    $nombre = basename(str_replace('\\', '/', $f['name']));
    $nombre = preg_replace('/[^\p{L}\p{N}._ -]/u', '_', $nombre);
    $nombre = trim($nombre, ' .');
    if ($nombre === '' || strpos($nombre, '.') === false) fallar('El archivo debe tener un nombre y una extensión.');
    if (strlen($nombre) > 100) fallar('El nombre del archivo es demasiado largo (máx. 100 caracteres).');

    // Extensión permitida
    $ext = strtolower(pathinfo($nombre, PATHINFO_EXTENSION));
    if (!array_key_exists($ext, PERMITIDOS)) {
        fallar('Tipo de archivo no permitido. Solo PDF, Word, Excel, PowerPoint, texto u OpenDocument.');
    }
    if (preg_match('/\.(php\d?|phtml|phar|pl|py|cgi|sh|exe|js|html?)\./i', $nombre)) fallar('Nombre de archivo no permitido.');

    // MIME real según el contenido
    $mime = class_exists('finfo') ? (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name'])
          : (function_exists('mime_content_type') ? mime_content_type($f['tmp_name']) : null);
    if ($mime !== null && ($mime === false || !in_array($mime, PERMITIDOS[$ext], true))) {
        fallar('El contenido del archivo no coincide con su extensión (.' . $ext . ').');
    }

    // Firma ("magic bytes")
    $cab = (string)file_get_contents($f['tmp_name'], false, null, 0, 8);
    if ($ext === 'pdf' && strncmp($cab, '%PDF-', 5) !== 0) fallar('El archivo no es un PDF válido.');
    if (in_array($ext, ['docx', 'xlsx', 'pptx', 'odt', 'ods', 'odp'], true) && strncmp($cab, "PK\x03\x04", 4) !== 0) fallar('El archivo no es un documento válido.');
    if (in_array($ext, ['doc', 'xls', 'ppt'], true) && strncmp($cab, "\xD0\xCF\x11\xE0", 4) !== 0) fallar('El archivo no es un documento válido.');

    // Guardar (si el nombre del archivo ya existe en disco, se le antepone un prefijo único)
    if (!is_dir(CARPETA) && !mkdir(CARPETA, 0755, true)) fallar('No se pudo crear la carpeta de archivos.', 500);
    if (file_exists(CARPETA . $nombre)) $nombre = uniqid() . '_' . $nombre;
    if (!move_uploaded_file($f['tmp_name'], CARPETA . $nombre)) fallar('No se pudo guardar el archivo.', 500);
    chmod(CARPETA . $nombre, 0644);

    return 'archivos/' . $nombre;
}
