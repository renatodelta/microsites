<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'db.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'login') {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header('Location: index.php');
            exit;
        } else {
            $error = "Credenciais inválidas.";
        }
    } elseif ($action === 'register') {
        $username = $_POST['username'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $password]);
            $success = "Conta criada com sucesso! Faça login.";
        } catch (PDOException $e) {
            $error = "Erro ao criar conta. Email ou usuário já existem.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrar - Aprovai</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <style>
        .auth-container {
            max-width: 400px;
            margin: 5rem auto;
        }
        .tabs {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .tab {
            flex: 1;
            text-align: center;
            padding: 1rem;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-light);
            transition: all 0.3s;
        }
        .tab.active {
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
        }
        .auth-form {
            display: none;
        }
        .auth-form.active {
            display: block;
        }
        .alert {
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            font-weight: 500;
        }
        .alert-error { background: #fee2e2; color: #b91c1c; }
        .alert-success { background: #ecfdf5; color: #047857; }
    </style>
</head>
<body>
    <div class="auth-container card">
        <a href="index.php" class="logo" style="justify-content: center; margin-bottom: 2rem;">
            Aprovai<span>.</span>
        </a>

        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo $error; ?></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="alert alert-success"><?php echo $success; ?></div>
        <?php endif; ?>

        <div class="tabs">
            <div class="tab active" onclick="switchTab('login')">Entrar</div>
            <div class="tab" onclick="switchTab('register')">Cadastrar</div>
        </div>

        <form id="login-form" class="auth-form active" method="POST">
            <input type="hidden" name="action" value="login">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-input" required placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label>Senha</label>
                <input type="password" name="password" class="form-input" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Entrar</button>
        </form>

        <form id="register-form" class="auth-form" method="POST">
            <input type="hidden" name="action" value="register">
            <div class="form-group">
                <label>Usuário</label>
                <input type="text" name="username" class="form-input" required placeholder="ex: joaosilva">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-input" required placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label>Senha</label>
                <input type="password" name="password" class="form-input" required placeholder="Mínimo 6 caracteres">
            </div>
            <button type="submit" class="btn btn-secondary" style="width: 100%; justify-content: center;">Criar Conta</button>
        </form>
    </div>

    <script>
        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            if (tab === 'login') {
                document.querySelectorAll('.tab')[0].classList.add('active');
                document.getElementById('login-form').classList.add('active');
            } else {
                document.querySelectorAll('.tab')[1].classList.add('active');
                document.getElementById('register-form').classList.add('active');
            }
        }
    </script>
</body>
</html>
