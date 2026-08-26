<?php
$db_file = __DIR__ . '/database.sqlite';

try {
    // Conexão via SQLite (Local) - Passo inicial para D1
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    // Habilita as chaves estrangeiras no SQLite (obrigatório para ON DELETE CASCADE funcionar)
    $pdo->exec("PRAGMA foreign_keys = ON;");
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

session_start();

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function getUserStats($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT xp, streak FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch();
}
?>
