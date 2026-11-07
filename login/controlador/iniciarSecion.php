
<?php
// Login: valida usuario y contraseña contra la base de datos y crea la sesión
session_start();
require "/proyecto-3-MJ-favinafe/baseDeDatos/conexion.php";

if (empty($_SESSION["csrf"])) 
{
    $_SESSION["csrf"] = bin2hex(random_bytes(32));
}

$error = "";


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!hash_qeuals($_SESSION["csrf"], $_POST["csrf"] ?? "")) 
    {
       $error = "No se pudo enviar el formulario";
    } 
    else 
    {
        $usuario  = $_POST["usuario"] ?? "";
        $password = $_POST["password"] ?? "";
                // "u" es un marcador, como en java "?" . 
        $consulta = $pdo->prepare("SELECT idUsuario, nombreUsuario, contrasenaHash FROM usuarios WHERE nombreUsuario = :u LIMIT 1");
        $consulta->execute([":u" => $usuario]);
        $fila = $consulta->fetch();

        if ($fila && password_verify($password, $fila["password_hash"])) 
        {
            session_regenerate_id(true);
            
            $_SESSION["usuarioId"] = $fila["idUsuario"];
            $_SESSION["usuario"]    = $fila["usuario"];

            // Verifica si se tiene que hashear la contraseña porque se cambio el algoritmo 
            if (password_needs_rehash($fila["password_hash"], PASSWORD_DEFAULT)) 
            {
                $nuevo = password_hash($password, PASSWORD_DEFAULT);
                $pdo->prepare("UPDATE usuarios SET password_hash = :h WHERE id = :id")
                    ->execute([":h" => $nuevo, ":id" => $fila["id"]]);
            }

            echo json_encode([
                "valido" => true,
                "link" => "/home/naco/proyecto-3-MJ-favinafe/login/vista/panel.html"   // o null si no hay que mover al usuario
                ]);
                exit;
        } 
        else 
        {
            $error = "Usuario o contraseña incorrectos.";
        }
    }
}
?>

