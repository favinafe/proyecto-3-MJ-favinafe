<?php

//borra cualquier mensaje de error para que json funque
ini_set("display_errors", "0");
ini_set("log_errors", "1");
ob_start();

function responder(array $datos): never
{
    while (ob_get_level() > 0) 
    {
        ob_end_clean();         
    }
    header("Content-Type: application/json; charset=utf-8");
    header("Cache-Control: no-store");
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fallo(string $mensaje): never
{
    responder(["valido" => false, "mensaje" => $mensaje]);
}

try 
{
    //verifica que el metodo sea post
    if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") 
    {
        fallo("Método no permitido.");
    }

    //guarda los inputs del usr y los vuelve a verificar como js
    $usuario    = (string)($_POST["usuario"] ?? "");
    $contrasena = (string)($_POST["contrasena"] ?? "");

    if 
    (
        $usuario === "" || $contrasena === ""
        || strlen($usuario) < 4 || strlen($usuario) > 25
        || strlen($contrasena) > 72                // límite real de bcrypt
        || preg_match("/\s/", $usuario)
    ) 
    else
    {
        fallo("Usuario o contraseña incorrectos.");
    }

    require __DIR__ . "/../../elementosComunes/baseDeDatos/conexion.php";

    //consulta preparada
    $stmt = $pdo->prepare(
        "SELECT idUsuario, nombreUsuario, contrasenaHash, nombre, apellido, activo
           FROM usuario
          WHERE nombreUsuario = :usuario
          LIMIT 1"
    );
    $stmt->execute([":usuario" => $usuario]);
    $fila = $stmt->fetch();

    //verifica la contraseña
    $hash =$fila ? $fila["contrasenaHash"] : "";
    $claveOk = password_verify($contrasena, $hash);

    if (!$fila || !$claveOk) 
    {
        fallo("Usuario o contraseña incorrectos.");
    }

    // Credenciales correctas pero la cuenta está desactivada
    if ((int)$fila["activo"] !== 1) 
    {
        fallo("El usuario está inactivo.");
    }

    // re hash
    if (password_needs_rehash($fila["contrasenaHash"], PASSWORD_DEFAULT)) 
    {
        $upd = $pdo->prepare("UPDATE usuario SET contrasenaHash = :hash WHERE idUsuario = :id");
        $upd->execute([
            ":hash" => password_hash($contrasena, PASSWORD_DEFAULT),
            ":id"   => $fila["idUsuario"],
        ]);
    }

    //Select de los roles del usr
    $stmtRoles = $pdo->prepare(
        "SELECT r.nombreRol
           FROM usuarioRol ur
           JOIN rol r ON r.idRol = ur.idRol
          WHERE ur.idUsuario = :id"
    );
    $stmtRoles->execute([":id" => $fila["idUsuario"]]);
    $roles = $stmtRoles->fetchAll(PDO::FETCH_COLUMN);

    if (!$roles) {
        // Existe y está activo, pero sin ningún rol asignado: no hay a dónde derivarlo
        fallo("El usuario no tiene roles asignados.");
    }

    //crear una secion
    session_start();       

    $_SESSION["idUsuario"]     = (int)$fila["idUsuario"];
    $_SESSION["nombreUsuario"] = $fila["nombreUsuario"];
    $_SESSION["nombre"]        = $fila["nombre"];
    $_SESSION["apellido"]      = $fila["apellido"];
    $_SESSION["roles"]         = $roles;

  responder([
    "valido"  => true,
    "link"    => login/vista/panel.html,
    "usuario" => [
        "id"       => (int)$fila["idUsuario"],
        "usuario"  => $fila["nombreUsuario"],
        "nombre"   => $fila["nombre"],
        "apellido" => $fila["apellido"],
    ],
    "roles"   => $roles,
]);

} catch (Throwable $e) {
    error_log("[SIGSM] iniciarSecion.php: " . $e->getMessage());
    fallo("Error interno del servidor.");
}