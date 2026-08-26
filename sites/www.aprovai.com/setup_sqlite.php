<?php
header('Content-Type: text/plain; charset=utf-8');

// Conecta ou cria o BD novo sqlite localmente
require_once 'db.php';

echo "Iniciando instalação do banco de dados SQLite...\n\n";

try {
    // Lê e executa o schema.sql
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    $pdo->exec($schema);
    echo "✅ [schema.sql] Tabelas criadas com sucesso!\n";

    // Lê e executa o setup_data.sql
    $data = file_get_contents(__DIR__ . '/setup_data.sql');
    $pdo->exec($data);
    echo "✅ [setup_data.sql] Dados de teste inseridos com sucesso!\n";

    echo "\nO banco local SQLite está pronto para o uso. \nAs mesmas querys do schema geradas aqui funcionarão no ambiente de produção do Cloudflare D1!";

} catch (PDOException $e) {
    echo "❌ Erro ao rodar script: " . $e->getMessage();
}
?>
