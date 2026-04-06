
import os

folder = r"c:\xampp\htdocs\microsites\sites\custodecarro.com\artigos"

replacements = {
    "Ãª": "ê",
    "Ã´": "ô",
    "Ã§": "ç",
    "Ã£": "ã",
    "Ã©": "é",
    "Ã¡": "á",
    "Ã­": "í",
    "Ãº": "ú",
    "Ã³": "ó",
    "Ã ": "à",
    "Ã€": "À",
    "Ã·": "÷",
    "Ã—": "×",
    "Â©": "©",
    "Ã‰": "É",
    "Ã¢": "â",
    "Ãµ": "õ",
    "â€”": "—",
    "â€“": "–",
    "â€œ": "“",
    "â€": "”",
    "Ã ": "à ",
    "VocÃª": "Você",
    "vocÃª": "você",
}

for root, dirs, files in os.walk(folder):
    for name in files:
        if name.endswith(".html"):
            path = os.path.join(root, name)
            print(f"Repairing {name}...")
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            for k, v in replacements.items():
                content = content.replace(k, v)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

print("Batch repair finished.")
