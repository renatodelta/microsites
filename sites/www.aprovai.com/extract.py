import subprocess
import sys
import os

try:
    import pypdf
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "--quiet"])
    import pypdf

pdf_path = r"C:\Users\renat\Documents\FAB\Provas_EAOF2026\Provas_EAOF2026\SUP\SUP.pdf"
out_path = r"c:\xampp\htdocs\microsites\sites\www.aprovai.com\extracted_pdf.txt"

try:
    if not os.path.exists(pdf_path):
        print(f"Arquivo não encontrado: {pdf_path}")
        sys.exit(1)
        
    with open(pdf_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        total_pages = min(17, len(reader.pages))
        text = ""
        for i in range(total_pages):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text + "\n---PAGE---\n"
                
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(text)
    print("Sucesso")
except Exception as e:
    print(f"Erro: {e}")
