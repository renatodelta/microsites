import os
import sqlite3
import re
import sys
import glob

try:
    import pypdf
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "--quiet"])
    import pypdf

base_dir = r"C:\Users\renat\Documents\FAB\Provas_EAOF2026\Provas_EAOF2026"
folders = ["ANV", "ARM", "BBA", "CTA", "FOT", "GDS", "MET", "MUS", "SIA", "SVA", "SVE", "SVH", "SVM"]

conn = sqlite3.connect('database.sqlite')
cursor = conn.cursor()

for folder in folders:
    print(f"Processando especialidade {folder}...", end=" ")
    pdf_path = os.path.join(base_dir, folder, f"{folder}.pdf")
    
    if not os.path.exists(pdf_path):
        pdfs = glob.glob(os.path.join(base_dir, folder, "*.pdf"))
        if not pdfs:
            print(f"(ERRO: PDF não encontrado)")
            continue
        pdf_path = pdfs[0]

    cursor.execute("SELECT id FROM subjects WHERE name = ?", (f"EAOF 2026 - {folder}",))
    if cursor.fetchone():
        print(f"(IGNORADO: Já estava processado)")
        continue

    text = ""
    with open(pdf_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        total_pages = min(25, len(reader.pages))
        for i in range(total_pages):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text + "\n---PAGE---\n"

    exam_name = f"EAOF - Especialidade {folder}"
    cursor.execute("SELECT id FROM exams WHERE name = ?", (exam_name,))
    row = cursor.fetchone()
    if row:
        exam_id = row[0]
    else:
        cursor.execute("INSERT INTO exams (name, description, icon) VALUES (?, ?, 'book')", 
                       (exam_name, f"Estágio de Adaptação ao Oficialato 2026 ({folder})"))
        exam_id = cursor.lastrowid

    cursor.execute("INSERT INTO subjects (exam_id, name) VALUES (?, ?)", (exam_id, f"EAOF 2026 - {folder}"))
    subject_id = cursor.lastrowid

    pattern = r'(?m)^(\d{2})\)'
    parts = re.split(pattern, text)

    index = 1
    count = 0
    while index < len(parts):
        q_num = parts[index]
        if int(q_num) > 50:
            break
            
        q_content = parts[index+1]
        opt_pattern = r'(?m)^([a-d])\)\s*(.*)'
        options_matches = list(re.finditer(opt_pattern, q_content))
        
        if len(options_matches) >= 4:
            first_opt_start = options_matches[0].start()
            question_text = q_content[:first_opt_start].strip()
            
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

    print(f"--> Inseridas {count} questões.")

conn.commit()
conn.close()
print("==============================")
print("PROCESSO BATCH COMPLETO.")
