<?php
require_once '../db.php';

if (!isLoggedIn()) {
    http_response_code(403);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'];
$questionId = $data['question_id'] ?? 0;
$isCorrect = $data['is_correct'] ?? false;

if ($questionId > 0) {
    // Record the answer
    $stmt = $pdo->prepare("INSERT INTO user_answers (user_id, question_id, is_correct) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $questionId, $isCorrect]);

    // Update XP and Streak if correct
    if ($isCorrect) {
        $stmt = $pdo->prepare("UPDATE users SET xp = xp + 10 WHERE id = ?");
        $stmt->execute([$userId]);
    }
    
    // Simple streak logic: update last_login and increment if it was yesterday
    $stmt = $pdo->prepare("SELECT last_login FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $lastLogin = $stmt->fetchColumn();
    $today = date('Y-m-d');
    
    if ($lastLogin != $today) {
        $stmt = $pdo->prepare("UPDATE users SET streak = streak + 1, last_login = ? WHERE id = ?");
        $stmt->execute([$today, $userId]);
    }

    echo json_encode(['status' => 'success']);
}
?>
