import sqlite3
import re
import sys
import os

try:
    import pypdf
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "--quiet"])
    import pypdf

pdf_path = r"C:\Users\renat\Documents\FAB\Provas_EAOF2026\Provas_EAOF2026\COM\COM.pdf"

if not os.path.exists(pdf_path):
    print(f"Erro: não encontrado o arquivo {pdf_path}")
    sys.exit(1)

print("Lendo PDF de Comunicações...")
text = ""
with open(pdf_path, "rb") as f:
    reader = pypdf.PdfReader(f)
    total_pages = min(25, len(reader.pages))
    for i in range(total_pages):
        page_text = reader.pages[i].extract_text()
        if page_text:
            text += page_text + "\n---PAGE---\n"

print("Separando as questões...")
conn = sqlite3.connect('database.sqlite')
cursor = conn.cursor()

# Get exam_id
cursor.execute("SELECT id FROM exams WHERE name = 'EAOF'")
row = cursor.fetchone()
if row:
    exam_id = row[0]
else:
    cursor.execute("INSERT INTO exams (name, description, icon) VALUES ('EAOF', 'Estágio de Adaptação ao Oficialato 2026', 'fighter-jet')")
    exam_id = cursor.lastrowid

# Create new Subject specifically for this exam variation
cursor.execute("INSERT INTO subjects (exam_id, name) VALUES (?, 'EAOF 2026 - Comunicações (COM)')", (exam_id,))
subject_id = cursor.lastrowid

pattern = r'(?m)^(\d{2})\)'
parts = re.split(pattern, text)

index = 1
count = 0
while index < len(parts):
    q_num = parts[index]
    
    # User requested exactly up to question 50
    if int(q_num) > 50:
        break
        
    q_content = parts[index+1]
    
    opt_pattern = r'(?m)^([a-d])\)\s*(.*)'
    options_matches = list(re.finditer(opt_pattern, q_content))
    
    if len(options_matches) >= 4:
        first_opt_start = options_matches[0].start()
        question_text = q_content[:first_opt_start].strip()
        
        # Clean page headers and footers
        question_text = re.sub(r'---PAGE---', '', question_text)
        question_text = re.sub(r'EAOF\s*2026.*?Versão\s*[A-Z]', '', question_text, flags=re.IGNORECASE)
        question_text = re.sub(r'(?m)^-\s*\d+\s*-\s*$', '', question_text)
        
        cursor.execute("INSERT INTO questions (subject_id, text, explanation, banca, year) VALUES (?, ?, ?, ?, ?)",
                       (subject_id, f"Questão {q_num}\n{question_text}", "Gabarito ainda não importado.", "EAOF", 2026))
        question_id = cursor.lastrowid
        
        for i in range(len(options_matches)):
            start = options_matches[i].start(2)
            end = options_matches[i+1].start() if i + 1 < len(options_matches) else len(q_content)
            
            opt_text = q_content[start:end].strip()
            opt_text = re.sub(r'---PAGE---', '', opt_text)
            opt_text = re.sub(r'EAOF\s*2026.*?Versão\s*[A-Z]', '', opt_text, flags=re.IGNORECASE)
            opt_text = re.sub(r'(?m)^-\s*\d+\s*-\s*$', '', opt_text)
            opt_text = opt_text.strip()
            
            is_correct = 1 if i == 0 else 0
            
            if i < 4:
                cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                               (question_id, opt_text, is_correct))
        count += 1
    index += 2

conn.commit()
conn.close()

print(f"Sucesso! {count} questões de Comunicações cadastradas.")
