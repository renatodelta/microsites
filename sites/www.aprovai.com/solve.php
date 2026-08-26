<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'db.php';
requireLogin();

$exam_id = $_GET['exam_id'] ?? 1;
$selected_banca = $_GET['banca'] ?? '';
$user_id = $_SESSION['user_id'];

$banca_query = ($selected_banca && $selected_banca !== 'Todas as Bancas') ? " AND q.banca = :banca " : "";

// Total questions
$total_sql = "SELECT COUNT(*) FROM questions q JOIN subjects s ON q.subject_id = s.id WHERE s.exam_id = :exam_id" . $banca_query;
$total_stmt = $pdo->prepare($total_sql);
$params_total = [':exam_id' => $exam_id];
if ($banca_query) $params_total[':banca'] = $selected_banca;
$total_stmt->execute($params_total);
$total_exam_questions = $total_stmt->fetchColumn();

// Correct answers
$correct_sql = "
    SELECT COUNT(DISTINCT question_id) FROM user_answers ua 
    JOIN questions q ON ua.question_id = q.id
    JOIN subjects s ON q.subject_id = s.id
    WHERE ua.user_id = :user_id AND ua.is_correct = 1 AND s.exam_id = :exam_id" . $banca_query;
$correct_stmt = $pdo->prepare($correct_sql);
$params_correct = [':user_id' => $user_id, ':exam_id' => $exam_id];
if ($banca_query) $params_correct[':banca'] = $selected_banca;
$correct_stmt->execute($params_correct);
$correct_count = $correct_stmt->fetchColumn() ?: 0;

$progress_percent = ($total_exam_questions > 0) ? ($correct_count / $total_exam_questions) * 100 : 0;

// Get a random question
$q_sql = "
    SELECT q.*, s.name as subject_name 
    FROM questions q 
    JOIN subjects s ON q.subject_id = s.id 
    WHERE s.exam_id = :exam_id 
    AND q.id NOT IN (
        SELECT question_id FROM user_answers WHERE user_id = :user_id AND is_correct = 1
    )" . $banca_query . "
    ORDER BY RANDOM() 
    LIMIT 1
";
$stmt = $pdo->prepare($q_sql);
$params_q = [':exam_id' => $exam_id, ':user_id' => $user_id];
if ($banca_query) $params_q[':banca'] = $selected_banca;
$stmt->execute($params_q);
$question = $stmt->fetch();

$finished = !$question;

if (!$finished) {
    $stmt = $pdo->prepare("SELECT * FROM options WHERE question_id = ?");
    $stmt->execute([$question['id']]);
    $options = $stmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Treinar - Gabarix</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f3f4f6; }
        
        .question-card {
            background: white; border: 1px solid #e5e7eb; border-radius: 8px;
            padding: 2.5rem; max-width: 900px; margin: 3rem auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .q-header {
            display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
            border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem;
            font-size: 0.85rem; color: #4b5563; font-weight: 500;
        }

        .q-header .tag-box {
            background: #f9fafb; border: 1px solid #e5e7eb; padding: 0.2rem 0.5rem; border-radius: 4px;
        }

        .q-header .sep { color: #9ca3af; font-size: 0.75rem; margin: 0 0.2rem; }

        .q-text {
            font-size: 1.1rem; line-height: 1.8; color: #1f2937; margin-bottom: 2.5rem; font-weight: 400; 
            text-align: justify; letter-spacing: -0.2px;
        }

        /* Minimalist Options */
        .option-item {
            display: flex; align-items: flex-start; gap: 1.25rem;
            padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px;
            cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
        }
        .option-item:hover { background: #f9fafb; }
        
        .opt-letter {
            width: 32px; height: 32px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            border: 1px solid #f97316; color: #f97316; border-radius: 50%;
            font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
        }
        .option-item:hover .opt-letter { background: #fff7ed; }
        .opt-text { color: #374151; font-size: 1.05rem; line-height: 1.6; padding-top: 4px; }

        /* States via JS */
        .option-item.correct { background: #ecfdf5; border-color: #10b981; }
        .option-item.correct .opt-letter { background: #10b981; border-color: #10b981; color: white; }
        .option-item.correct .opt-text { color: #065f46; font-weight: 600; }

        .option-item.wrong { background: #fef2f2; border-color: #ef4444; }
        .option-item.wrong .opt-letter { background: #ef4444; border-color: #ef4444; color: white; }
        .option-item.wrong .opt-text { color: #991b1b; }

        /* Explanation box directly inside card */
        .feedback-box {
            margin-top: 2rem; padding: 1.5rem; border-radius: 8px; display: none;
            font-size: 0.95rem; line-height: 1.6;
        }
        .feedback-box.correct { background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; }
        .feedback-box.wrong { background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; }

        /* Disable pointer events after answer */
        .answered .option-item { pointer-events: none; }
        
        .loading-bar {
            height: 4px; background: #e5e7eb; border-radius: 4px; margin-top: 1rem; overflow: hidden; display: none;
        }
        .loading-fill { height: 100%; background: #f97316; width: 0%; animation: fillUp 3s linear forwards; }
        @keyframes fillUp { to { width: 100%; } }

    </style>
</head>
<body>
    <header style="background: white; border-bottom: 1px solid #e5e7eb;">
        <nav style="max-width: 900px; padding: 1rem 1.5rem; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <a href="index.php" class="logo" style="font-size: 1.5rem; font-weight: 800; color: #111827; text-decoration: none;">Gabarix<span style="color: #10b981;">.</span></a>
            
            <div style="display: flex; gap: 2rem; align-items: center;">
                <div style="font-size: 0.875rem; font-weight: 600; color: #4b5563;">
                    Acertos: <span style="color: #10b981;"><?php echo $correct_count; ?></span> / <?php echo $total_exam_questions; ?>
                </div>
                <a href="index.php" class="btn-outline" style="border: 1px solid #e5e7eb; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; color: #374151; font-weight: 500; font-size: 0.875rem;">Sair</a>
            </div>
        </nav>
    </header>

    <main>
        <?php if ($finished): ?>
            <div class="question-card" style="text-align: center; padding: 5rem 2rem;">
                <i class="fas fa-trophy" style="font-size: 4rem; color: #f59e0b; margin-bottom: 1.5rem;"></i>
                <h2 style="font-size: 2rem; font-weight: 900; color: #111827;">Módulo Concluído!</h2>
                <p style="color: #4b5563; font-size: 1.125rem; margin-top: 1rem;">Você esgotou todas as questões deste caderno.</p>
                <a href="index.php" class="btn-primary" style="display: inline-block; background: #10b981; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 2rem;">Voltar ao Dashboard</a>
            </div>
        <?php else: ?>
            <div class="question-card" id="q-container">
                <div class="q-header">
                    <span class="tag-box">Q<?php echo $question['id']; ?></span>
                    <strong style="color: #111827;"><?php echo htmlspecialchars($question['banca']); ?> - <?php echo htmlspecialchars($question['year']); ?></strong>
                    <i class="fas fa-caret-right sep"></i>
                    <span><?php echo htmlspecialchars($question['subject_name']); ?></span>
                    <i class="fas fa-caret-right sep"></i>
                    <span>Gabarix</span>
                </div>

                <div class="q-text">
                    <?php 
                        $qText = $question['text'];
                        
                        // 1. Remove qualquer "Questão XX" no início do texto
                        $qText = preg_replace('/^Questão\s+\d+\s*\n*/i', '', $qText);

                        // 2. Lógica para limpar quebras de linha marginais de PDF
                        // Preserva quebras de linha que parecem estruturais (I. II. III., Sobre as assertivas, etc.)
                        $qText = preg_replace('/\n(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{1,3})[\.\-\)])/u', '<BR_MARKER>$1', $qText);
                        $qText = preg_replace('/\n(Sobre as assertivas|Com base|A sequência|Assinale|Das opções|Diante do exposto|Considerando)/ui', '<BR_MARKER>$1', $qText);
                        $qText = preg_replace('/\n(I|II|III|IV|V|VI|VII|VIII|IX|X)[\.\-\)]/u', '<BR_MARKER>$1', $qText);
                        
                        // Troca quebras de linha simples restantes por espaços (juntando as frases cortadas pela margem)
                        $qText = preg_replace('/([^\n])\n([^\n])/u', '$1 $2', $qText);
                        
                        // Restaura os marcadores estruturais com duplo parágrafo para ficar mais limpo
                        $qText = str_replace('<BR_MARKER>', "\n\n", $qText);
                        $qText = str_replace("\n", "<br>", $qText);

                        echo $qText; 
                    ?>
                </div>

                <div id="options-list">
                    <?php $labels = ['A', 'B', 'C', 'D', 'E']; foreach($options as $i => $opt): ?>
                        <div class="option-item" onclick="submitAnswer(this)" data-correct="<?php echo $opt['is_correct']; ?>">
                            <div class="opt-letter"><?php echo $labels[$i]; ?></div>
                            <div class="opt-text"><?php echo nl2br(htmlspecialchars($opt['text'])); ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div id="feedback-area" class="feedback-box">
                    <strong id="feedback-title" style="display: block; margin-bottom: 0.5rem; font-size: 1.1rem;"></strong>
                    <span id="explanation-text"><?php echo nl2br(htmlspecialchars($question['explanation'] ?? '')); ?></span>
                    <div class="loading-bar" id="l-bar"><div class="loading-fill"></div></div>
                </div>
            </div>
        <?php endif; ?>
    </main>

    <script>
        function submitAnswer(selectedDiv) {
            // Previne duplo clique
            const container = document.getElementById('q-container');
            if(container.classList.contains('answered')) return;
            container.classList.add('answered');

            const isCorrect = selectedDiv.dataset.correct === "1";
            
            // Marca a resposta do usuário
            selectedDiv.classList.add(isCorrect ? 'correct' : 'wrong');

            // Revela a verdadeira caso o usuário tenha errado
            if (!isCorrect) {
                const correctOption = document.querySelector('.option-item[data-correct="1"]');
                if(correctOption) correctOption.classList.add('correct');
            }

            // Exibe Feedback
            const feedbackArea = document.getElementById('feedback-area');
            const feedbackTitle = document.getElementById('feedback-title');
            
            feedbackArea.className = 'feedback-box ' + (isCorrect ? 'correct' : 'wrong');
            feedbackArea.style.display = 'block';
            
            feedbackTitle.innerHTML = isCorrect ? '<i class="fas fa-check-circle"></i> Resposta Certa!' : '<i class="fas fa-times-circle"></i> Resposta Errada!';
            
            // Barra de Loading de transição
            document.getElementById('l-bar').style.display = 'block';

            // Salva na Base de Dados
            fetch('api/save_answer.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question_id: <?php echo $question['id'] ?? 0; ?>, is_correct: isCorrect })
            });

            // Passa para a próxima automaticamente após 3 segundos
            setTimeout(() => {
                const url = new URL(window.location.href);
                location.href = url.toString();
            }, 3000);
        }
    </script>
</body>
</html>
