import sqlite3

try:
    conn = sqlite3.connect('database.sqlite')
    cursor = conn.cursor()

    # 1. Ajusta o exame original (ID 1) para ser exclusivo de Suprimento Técnico
    cursor.execute("""
        UPDATE exams 
        SET name = 'EAOF - Suprimento Técnico', 
            description = 'Estágio de Adaptação ao Oficialato 2026 (Especialidade SUP)',
            icon = 'boxes'
        WHERE name = 'EAOF' OR name LIKE '%Suprimento%'
    """)

    # 2. Tenta encontrar se "Comunicações" já existe nos exames
    cursor.execute("SELECT id FROM exams WHERE name = 'EAOF - Comunicações'")
    row = cursor.fetchone()
    
    if not row:
        # Se não existe, cria um novo caderno/exame principal para Comunicações
        cursor.execute("""
            INSERT INTO exams (name, description, icon) 
            VALUES ('EAOF - Comunicações', 'Estágio de Adaptação ao Oficialato 2026 (Especialidade COM)', 'satellite-dish')
        """)
        comup_exam_id = cursor.lastrowid
    else:
        comup_exam_id = row[0]

    # 3. Pula todas as matérias(subjects) que sejam de Comunicações para o novo exame
    # O script anterior criava com o nome 'EAOF 2026 - Comunicações (COM)'
    cursor.execute("UPDATE subjects SET exam_id = ? WHERE name LIKE '%Comunicações%' OR name LIKE '%COM%'", (comup_exam_id,))
    
    # Check subjects count per exam
    cursor.execute("""
        SELECT e.name, COUNT(q.id) 
        FROM exams e 
        LEFT JOIN subjects s ON s.exam_id = e.id 
        LEFT JOIN questions q ON q.subject_id = s.id 
        GROUP BY e.id
    """)
    res = cursor.fetchall()

    conn.commit()
    conn.close()
    
    print("Sucesso DB Separado!")
    for r in res:
        print(f"Exame: {r[0]} | Questões: {r[1]}")
        
except Exception as e:
    print("Erro:", e)
