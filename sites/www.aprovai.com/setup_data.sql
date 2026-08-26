-- Dados Iniciais para SQLite
PRAGMA foreign_keys = ON;

-- Limpa questões anteriores para não duplicar no teste
DELETE FROM options;
DELETE FROM questions;
DELETE FROM subjects;

INSERT OR IGNORE INTO exams (id, name, description, icon) VALUES (1, 'OAB', 'Exame de Ordem dos Advogados do Brasil', 'gavel');
INSERT OR IGNORE INTO exams (id, name, description, icon) VALUES (2, 'ENEM', 'Exame Nacional do Ensino Médio', 'graduation-cap');
INSERT OR IGNORE INTO exams (id, name, description, icon) VALUES (3, 'PRF', 'Polícia Rodoviária Federal', 'shield-alt');

-- Inserindo Matérias
INSERT INTO subjects (id, exam_id, name) VALUES 
(1, 2, 'Linguagens e Códigos'),
(2, 2, 'Matemática e suas Tecnologias'),
(3, 2, 'Ciências da Natureza'),
(4, 2, 'Ciências Humanas');

-- 1. Matemática (subject_id = 2)
INSERT INTO questions (id, subject_id, text, explanation) VALUES (1, 2, 'Se um carro percorre 240km com 20 litros de combustível, qual sua autonomia em km/l?', 'Basta dividir a distância pelo volume: 240 / 20 = 12.');
INSERT INTO options (question_id, text, is_correct) VALUES (1, '10 km/l', 0), (1, '12 km/l', 1), (1, '15 km/l', 0), (1, '8 km/l', 0), (1, '20 km/l', 0);

-- 2. Matemática
INSERT INTO questions (id, subject_id, text, explanation) VALUES (2, 2, 'Qual a probabilidade de tirar um número par ao lançar um dado de 6 faces?', 'Os números pares são 2, 4 e 6. Logo, 3 em 6, que é 50%.');
INSERT INTO options (question_id, text, is_correct) VALUES (2, '1/6', 0), (2, '1/3', 0), (2, '1/2', 1), (2, '2/3', 0), (2, '1/4', 0);

-- 3. Matemática
INSERT INTO questions (id, subject_id, text, explanation) VALUES (3, 2, 'Uma função do primeiro grau é definida por f(x) = 2x + 3. Qual o valor de f(5)?', 'f(5) = 2(5) + 3 = 10 + 3 = 13.');
INSERT INTO options (question_id, text, is_correct) VALUES (3, '10', 0), (3, '13', 1), (3, '15', 0), (3, '8', 0), (3, '23', 0);

-- 6. Linguagens (subject_id = 1)
INSERT INTO questions (id, subject_id, text, explanation) VALUES (4, 1, 'Quem é o autor do livro "Memórias Póstumas de Brás Cubas"?', 'Machado de Assis é o principal nome do Realismo no Brasil.');
INSERT INTO options (question_id, text, is_correct) VALUES (4, 'Monteiro Lobato', 0), (4, 'Machado de Assis', 1), (4, 'Clarice Lispector', 0), (4, 'Guimarães Rosa', 0), (4, 'José de Alencar', 0);

-- 7. Linguagens
INSERT INTO questions (id, subject_id, text, explanation) VALUES (5, 1, 'A figura de linguagem que consiste no exagero é a:', 'Hiperbole é a figura do exagero.');
INSERT INTO options (question_id, text, is_correct) VALUES (5, 'Metáfora', 0), (5, 'Hipérbole', 1), (5, 'Eufemismo', 0), (5, 'Ironia', 0), (5, 'Antítese', 0);

-- 11. Natureza (subject_id = 3)
INSERT INTO questions (id, subject_id, text, explanation) VALUES (6, 3, 'Qual o principal gás responsável pelo efeito estufa liberado por queimas?', 'O CO2 é o principal gás do efeito estufa antropogênico.');
INSERT INTO options (question_id, text, is_correct) VALUES (6, 'Oxigênio', 0), (6, 'Dióxido de Carbono', 1), (6, 'Nitrogênio', 0), (6, 'Hélio', 0), (6, 'Argônio', 0);

-- 12. Natureza
INSERT INTO questions (id, subject_id, text, explanation) VALUES (7, 3, 'Quantos cromossomos tem uma célula somática humana normal?', 'Células somáticas possuem 23 pares, totalizando 46.');
INSERT INTO options (question_id, text, is_correct) VALUES (7, '23', 0), (7, '46', 1), (7, '48', 0), (7, '50', 0), (7, '22', 0);

-- 16. Humanas (subject_id = 4)
INSERT INTO questions (id, subject_id, text, explanation) VALUES (8, 4, 'Em que ano começou a Primeira Guerra Mundial?', 'A guerra iniciou em 1914.');
INSERT INTO options (question_id, text, is_correct) VALUES (8, '1939', 0), (8, '1914', 1), (8, '1918', 0), (8, '1945', 0), (8, '1889', 0);

-- 17. Humanas
INSERT INTO questions (id, subject_id, text, explanation) VALUES (9, 4, 'Qual filósofo é autor da frase "Penso, logo existo"?', 'René Descartes, pai do racionalismo moderno.');
INSERT INTO options (question_id, text, is_correct) VALUES (9, 'Platão', 0), (9, 'René Descartes', 1), (9, 'Aristóteles', 0), (9, 'Nietzsche', 0), (9, 'Kant', 0);
