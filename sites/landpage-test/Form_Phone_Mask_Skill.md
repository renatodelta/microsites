# Skill: Criação de Formulários com Máscara de Telefone/WhatsApp (Celular vs Fixo)

Esta skill descreve o padrão técnico para implementar campos de telefone/WhatsApp em formulários HTML estáticos, com formatação automática em tempo real e restrição para aceitar apenas dígitos numéricos (limite máximo de 11 dígitos, que formatados ocupam 15 caracteres).

---

## 1. Estrutura HTML do Campo
O input deve utilizar o tipo `tel`, possuir um identificador único, um placeholder instrutivo e o limite de caracteres `maxlength="15"` (tamanho máximo da string formatada `(XX) XXXXX-XXXX`).

```html
<div class="form-group">
  <label for="whatsapp" class="form-label">WhatsApp de Contato</label>
  <input 
    type="tel" 
    id="whatsapp" 
    class="form-control" 
    placeholder="Ex: (11) 99999-9999" 
    maxlength="15" 
    required
  >
</div>
```

---

## 2. Lógica JavaScript (Máscara Dinâmica)
O script deve ser inicializado imediatamente após o carregamento do DOM (`DOMContentLoaded`) para evitar bloqueios de execução. Ele divide-se em duas regras:
1. **Bloqueio Físico de Teclado:** Impede a digitação de letras e caracteres especiais.
2. **Máscara Dinâmica:** Formata enquanto digita e limpa caracteres não-numéricos colados.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const whatsappInput = document.getElementById("whatsapp");
  
  if (whatsappInput) {
    // 1. Bloqueia qualquer tecla que não seja número (0 a 9) no momento da digitação
    whatsappInput.addEventListener("keypress", (e) => {
      if (e.key < "0" || e.key > "9") {
        e.preventDefault();
      }
    });

    // 2. Formata o valor dinamicamente e limpa entradas inválidas (copiar/colar)
    whatsappInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo o que não for número
      if (value.length > 11) {
        value = value.slice(0, 11); // Limita estritamente a 11 dígitos
      }
      
      // Aplica a formatação de máscara (Celular vs Telefone Fixo)
      if (value.length > 10) {
        // Formato Celular: (XX) XXXXX-XXXX
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 6) {
        // Formato Fixo: (XX) XXXX-XXXX
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else if (value.length > 2) {
        // Formato Inicial: (XX) XXXX...
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        // Formato DDD: (XX...
        e.target.value = `(${value`;
      } else {
        e.target.value = "";
      }
    });
  }
});
```

---

## 3. Checklist de Implementação e Boas Práticas

- [ ] **ID Correspondente:** Verifique se o ID selecionado no JavaScript (`getElementById`) bate exatamente com o ID do input HTML.
- [ ] **Atributo Maxlength:** Garanta que o input tenha `maxlength="15"`. Se for menor, a digitação será travada antes de completar os 11 dígitos por causa dos parênteses e traço inseridos pela máscara.
- [ ] **Ordem de Inicialização:** Posicione a escuta do input de telefone no início do evento `DOMContentLoaded` no JS para evitar que erros de outros scripts parem a execução da máscara.
- [ ] **Tratamento de Colagem (Paste):** O uso do `replace(/\D/g, "")` no evento `input` garante que, se o usuário copiar um texto como `Meu whats é 11999998888`, o sistema limpe o texto e aplique a máscara corretamente apenas nos números.
