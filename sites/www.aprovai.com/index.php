<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'db.php';

$isLoggedIn = isLoggedIn();
$userStats = null;
$overallStats = ['correct' => 0, 'answered' => 0, 'total' => 0];

if ($isLoggedIn) {
    $userStats = getUserStats($pdo, $_SESSION['user_id']);
    if (!$userStats) {
        header('Location: logout.php');
        exit;
    }
    $level = floor($userStats['xp'] / 200) + 1;
    $xp_in_level = $userStats['xp'] % 200;
    $xp_percent = ($xp_in_level / 200) * 100;

    $q = $pdo->prepare("SELECT COUNT(DISTINCT question_id) FROM user_answers WHERE user_id = ?");
    $q->execute([$_SESSION['user_id']]);
    $overallStats['answered'] = $q->fetchColumn();

    $q = $pdo->prepare("SELECT COUNT(DISTINCT question_id) FROM user_answers WHERE user_id = ? AND is_correct = 1");
    $q->execute([$_SESSION['user_id']]);
    $overallStats['correct'] = $q->fetchColumn();

    $overallStats['total'] = $pdo->query("SELECT COUNT(*) FROM questions")->fetchColumn();
}

// Em SQLite precisamos pegar as bancas existentes
$stmt = $pdo->query("SELECT DISTINCT banca FROM questions WHERE banca IS NOT NULL");
$bancas = $stmt->fetchAll(PDO::FETCH_COLUMN);

$selected_banca = $_GET['banca'] ?? '';

// Busca os exames juntamente com uma contagem de questões
$sql = "SELECT e.*, 
        (SELECT COUNT(*) FROM questions q JOIN subjects s ON q.subject_id = s.id WHERE s.exam_id = e.id";

if ($selected_banca && $selected_banca !== 'Todas as Bancas') {
    $sql .= " AND q.banca = :banca";
}
$sql .= ") as q_count FROM exams e";

$stmt = $pdo->prepare($sql);
if ($selected_banca && $selected_banca !== 'Todas as Bancas') {
    $stmt->execute([':banca' => $selected_banca]);
} else {
    $stmt->execute();
}
$exams = $stmt->fetchAll();

// Se uma banca específica for selecionada, remove os exames que não possuem questões daquela banca
if ($selected_banca && $selected_banca !== 'Todas as Bancas') {
    $exams = array_filter($exams, function($e) { return $e['q_count'] > 0; });
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gabarix - Plataforma de Alta Performance</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
        window.onload = () => {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
        }
    </script>
    <style>
        /* Modern EdTech Adjustments */
        body { font-family: 'Inter', sans-serif; }
        
        /* Hero Section (Storefront style) */
        .hero {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
            color: white;
            padding: 5rem 1.5rem;
            text-align: center;
            border-radius: 0 0 30px 30px;
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        .hero::after {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>') repeat;
            opacity: 0.5; z-index: 0; pointer-events: none;
        }
        .hero-content {
            position: relative; z-index: 1;
            max-width: 800px; margin: 0 auto;
        }
        .hero h1 {
            font-size: 3.5rem; font-weight: 900; letter-spacing: -2px; line-height: 1.1; margin-bottom: 1.5rem;
        }
        .hero p {
            font-size: 1.25rem; font-weight: 400; opacity: 0.9; margin-bottom: 2.5rem;
        }
        
        /* Great Search Bar */
        .search-wrapper {
            display: flex; background: white; padding: 0.5rem; border-radius: 99px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-width: 600px; margin: 0 auto;
        }
        .search-wrapper input {
            flex: 1; border: none; padding: 1rem 1.5rem; border-radius: 99px 0 0 99px;
            font-family: inherit; font-size: 1rem; color: var(--text); outline: none;
        }
        .search-wrapper button {
            background: var(--secondary); color: white; padding: 1rem 2rem;
            border: none; border-radius: 99px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .search-wrapper button:hover { transform: scale(1.02); filter: brightness(1.1); }
        
        /* Features Section */
        .features-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1000px; margin: -5rem auto 4rem; position: relative; z-index: 10; padding: 0 1.5rem;
        }
        .feature-card {
            background: var(--card-bg); padding: 2rem; border-radius: 16px; box-shadow: var(--shadow);
            text-align: center; border: 1px solid var(--border);
        }
        .feature-card i { font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem; }
        .feature-card h4 { font-weight: 800; margin-bottom: 0.5rem; }
        .feature-card p { font-size: 0.875rem; color: var(--text-dim); }

        /* Dashboard specific */
        .exam-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;
        }
        .exam-card {
            background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px;
            transition: all 0.3s; padding: 1.5rem; display: flex; flex-direction: column;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .exam-card:hover {
            transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border-color: var(--primary-light);
        }
        .exam-meta {
            display: flex; gap: 0.5rem; margin-bottom: 1rem;
        }
        .exam-tag {
            font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 6px; text-transform: uppercase;
        }
        .tag-gray { background: var(--border); color: var(--text-dim); }
        .tag-green { background: rgba(16, 185, 129, 0.1); color: var(--secondary); }

        .btn-start {
            margin-top: auto; width: 100%; justify-content: center; padding: 0.875rem;
            background: var(--primary-light); color: var(--primary); font-weight: 800;
        }
        .btn-start:hover { background: var(--primary); color: white; }
    </style>
</head>
<body>
    <header style="border-bottom: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <nav style="padding: 1rem 1.5rem;">
            <a href="index.php" class="logo" style="font-size: 1.75rem;">Gabarix<span style="color: var(--secondary);">.</span></a>
            
            <div style="display: flex; gap: 1.5rem; align-items: center;">
                <button onclick="toggleTheme()" class="btn" style="padding: 0.5rem; border-radius: 50%; color: var(--text-dim); background: transparent;">
                    <i class="fas fa-moon"></i>
                </button>
                
                <?php if ($isLoggedIn): ?>
                    <div style="display: flex; align-items: center; gap: 1rem; background: var(--primary-light); padding: 0.5rem 1rem; border-radius: 99px;">
                        <div style="text-align: right;">
                            <div style="font-weight: 800; font-size: 0.75rem; color: var(--primary);">NÍVEL <?php echo $level; ?></div>
                            <div class="xp-bar-container" style="width: 80px; height: 4px; margin-top: 2px;"><div class="xp-bar-fill" style="width: <?php echo $xp_percent; ?>%;"></div></div>
                        </div>
                        <div style="width: 1px; height: 20px; background: rgba(79, 70, 229, 0.2);"></div>
                        <div style="font-weight: 800; color: var(--primary); font-size: 0.875rem;">
                            <i class="fas fa-check-circle" style="margin-right: 4px;"></i> <?php echo $overallStats['correct']; ?>
                        </div>
                    </div>
                    <a href="logout.php" class="btn" style="color: var(--text-dim); font-size: 0.875rem; font-weight: 600;">Sair</a>
                <?php else: ?>
                    <a href="login.php" class="btn" style="color: var(--text); font-weight: 600;">Entrar</a>
                    <a href="login.php" class="btn btn-primary" style="border-radius: 99px; padding: 0.75rem 1.5rem;">Cadastre-se</a>
                <?php endif; ?>
            </div>
        </nav>
    </header>

    <main>
        <?php if (!$isLoggedIn): ?>
            <!-- Public Storefront / Aprova Concursos Style -->
            <section class="hero">
                <div class="hero-content">
                    <h1>O que cai na prova, direto ao ponto.</h1>
                    <p>Estude menos, acerte mais. Pratique com questões reais focadas exclusivamente no edital do seu concurso e alcance a aprovação.</p>
                    
                    <div class="search-wrapper">
                        <input type="text" placeholder="Busque por concurso, cargo ou disciplina...">
                        <button><i class="fas fa-search" style="margin-right: 0.5rem;"></i> Buscar</button>
                    </div>
                </div>
            </section>

            <section class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-bullseye"></i>
                    <h4>Foco no Essencial</h4>
                    <p>Nossa IA mapeia as bancas para você estudar apenas o que realmente é cobrado. Sem enrolação.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-layer-group"></i>
                    <h4>Milhares de Questões</h4>
                    <p>Treine com simulados gamificados reais, veja a explicação e acompanhe seu rendimento.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chart-line"></i>
                    <h4>Monitoramento</h4>
                    <p>Painel de desempenho completo focado nos seus pontos fracos e revisão espaçada.</p>
                </div>
            </section>
            
            <div class="container" style="text-align: center; max-width: 800px; margin-bottom: 5rem;">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Preparado para gabaritar?</h2>
                <a href="login.php" class="btn btn-primary" style="padding: 1rem 3rem; font-size: 1.125rem; border-radius: 99px;">Começar Grátis Agora</a>
            </div>

        <?php else: ?>
            <!-- Dashboard Layout -->
            <div class="container" style="max-width: 1200px; padding-top: 2rem;">
                <div class="dashboard-layout">
                    <form method="GET" action="index.php" style="display: contents;">
                        <aside class="sidebar" style="top: 2rem;">
                            <h3 style="font-weight: 800; margin-bottom: 1.5rem; font-size: 1.125rem;">Filtrar Cadernos</h3>
                            
                            <div class="filter-group">
                                <label class="filter-label">Banca Examinadora</label>
                                <select class="filter-select" name="banca">
                                    <option value="Todas as Bancas">Todas as Bancas</option>
                                    <?php foreach($bancas as $b): ?>
                                        <option value="<?php echo htmlspecialchars($b); ?>" <?php echo ($selected_banca === $b) ? 'selected' : ''; ?>>
                                            <?php echo htmlspecialchars($b); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Nível de Escolaridade</label>
                                <select class="filter-select" name="level">
                                    <option>Qualquer Nível</option>
                                    <option>Superior</option>
                                    <option>Médio</option>
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 1rem; border-radius: 8px;">Aplicar Filtros</button>
                        </aside>
                    </form>

                    <div class="main-content">
                        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <h2 style="font-size: 1.75rem; font-weight: 900; letter-spacing: -0.5px;">Cursos Direto ao Ponto</h2>
                                <p style="color: var(--text-dim); margin-top: 0.25rem;">Selecione o seu caderno e inicie o treinamento prático.</p>
                            </div>
                        </div>

                        <div class="exam-grid">
                            <?php foreach ($exams as $exam): ?>
                                <div class="exam-card">
                                    <div class="exam-meta">
                                        <span class="exam-tag tag-green"><i class="fas fa-file-alt" style="margin-right: 4px;"></i> ATUALIZADO 2026</span>
                                        <span class="exam-tag tag-gray"><?php echo $exam['q_count']; ?> Questões</span>
                                    </div>
                                    <h3 style="font-weight: 800; font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text);">
                                        <i class="fas fa-<?php echo htmlspecialchars($exam['icon']); ?>" style="color: var(--primary); margin-right: 0.5rem;"></i>
                                        <?php echo htmlspecialchars($exam['name']); ?>
                                    </h3>
                                    <p style="color: var(--text-dim); font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.5;">
                                        <?php echo htmlspecialchars($exam['description']); ?>
                                    </p>
                                    
                                    <a href="solve.php?exam_id=<?php echo $exam['id']; ?>&banca=<?php echo urlencode($selected_banca); ?>" class="btn btn-start">
                                        Testar Conhecimentos <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>
