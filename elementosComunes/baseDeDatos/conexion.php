<?php

$host    = "localhost";
$bd      = "SIGSM";
$user    = "root";
$pass    = "";
$charset = "utf8mb4";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$bd;charset=$charset",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    error_log("[SIGSM] Error de conexión a la base de datos: " . $e->getMessage());
    throw new RuntimeException("No se pudo conectar a la base de datos.");
}