
import os
import re

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
    "Ã–": "Ö",
    "Ãœ": "Ü",
    "Ã¢": "â",
    "ÃŽ": "Î",
    "Ãƒ": "Ã",
    "Ãµ": "õ",
    "â€”": "—",
    "â€“": "–",
    "â€œ": "“",
    "â€": "”",
    "Ã ": "à ",
}

# Add more surgically
surgical = {
    "VocÃª": "Você",
    "vocÃª": "você",
    "combustÃ­vel": "combustível",
    "mÃªs": "mês",
    "mÃ©dio": "médio",
    "automÃ³vel": "automóvel",
    "veÃ­culo": "veículo",
    "PolÃ­tica": "Política",
    "Privacidade": "Privacidade",
}

for root, dirs, files in os.walk(folder):
    for name in files:
        if name.endswith(".html"):
            path = os.path.join(root, name)
            print(f"Repairing {path}")
            try:
                # Read as latin-1 to see corrupted utf-8 bytes
                with open(path, 'r', encoding='latin-1') as f:
                    content = f.read()
                
                # Those corrupted sequences are actually the same as the characters themselves
                # after a double-encoding trip.
                # Actually, the quickest way to fix "double-encoded" text:
                # content.encode('latin-1').decode('utf-8')
                
                try:
                    repaired = content.encode('latin-1').decode('utf-8')
                except Exception as e:
                    print(f"Standard decode failed for {name}, falling back to manual replacement: {e}")
                    # Fallback to manual dictionary
                    for k, v in replacements.items():
                        content = content.replace(k, v)
                    for k, v in surgical.items():
                        content = content.replace(k, v)
                    repaired = content

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(repaired)
            except Exception as e:
                print(f"Critical error on {name}: {e}")

print("Done.")
