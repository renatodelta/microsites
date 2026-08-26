import sqlite3
import re
import sys

try:
    conn = sqlite3.connect('database.sqlite')
    cursor = conn.cursor()

    # Cria ou busca exame
    cursor.execute("INSERT INTO exams (name, description, icon) VALUES ('EAOF', 'Estágio de Adaptação ao Oficialato 2026', 'fighter-jet')")
    exam_id = cursor.lastrowid

    # Cria a matéria
    cursor.execute("INSERT INTO subjects (exam_id, name) VALUES (?, 'EAOF 2026 - Caderno A')", (exam_id,))
    subject_id = cursor.lastrowid

    with open('extracted_pdf.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    # Separa por número da questão ex: "01)", "02)", "50)"
    pattern = r'(?m)^(\d{2})\)'
    parts = re.split(pattern, text)

    index = 1
    count = 0
    while index < len(parts):
        q_num = parts[index]
        q_content = parts[index+1]
        
        opt_pattern = r'(?m)^([a-d])\)\s*(.*)'
        options_matches = list(re.finditer(opt_pattern, q_content))
        
        if len(options_matches) >= 4:
            first_opt_start = options_matches[0].start()
            question_text = q_content[:first_opt_start].strip()
            
            # Clean up artifact headers
            question_text = re.sub(r'---PAGE---', '', question_text)
            question_text = re.sub(r'EAOF 2026 – Versão A', '', question_text)
            question_text = re.sub(r'(?m)^-\s*\d+\s*-\s*$', '', question_text)
            question_text = question_text.strip()
            
            cursor.execute("INSERT INTO questions (subject_id, text, explanation, banca, year) VALUES (?, ?, ?, ?, ?)",
                           (subject_id, f"Questão {q_num}\n{question_text}", "Gabarito ainda não importado.", "EAOF", 2026))
            question_id = cursor.lastrowid
            
            for i in range(len(options_matches)):
                start = options_matches[i].start(2)
                end = options_matches[i+1].start() if i + 1 < len(options_matches) else len(q_content)
                
                opt_text = q_content[start:end].strip()
                opt_text = re.sub(r'---PAGE---', '', opt_text)
                opt_text = re.sub(r'EAOF 2026 – Versão A', '', opt_text)
                opt_text = re.sub(r'(?m)^-\s*\d+\s*-\s*$', '', opt_text)
                opt_text = opt_text.strip()
                
                # Por não ter o gabarito no PDF extraído (1 a 17), marco a primeira (A) como correta para não quebrar a UI
                is_correct = 1 if i == 0 else 0
                
                if i < 4: # Pega apenas a, b, c, d
                    cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                                   (question_id, opt_text, is_correct))
            count += 1
        index += 2

    conn.commit()
    conn.close()
    print(f"Sucesso! {count} questões foram parseadas e inseridas no Banco SQlite.")
except Exception as e:
    print(f"Erro ao inserir no banco: {e}")
