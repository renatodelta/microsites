# Aprovai - Guia de Configuração

Para colocar o site no ar usando o XAMPP, siga estas etapas:

1. **Ative o MySQL e Apache**: No Painel de Controle do XAMPP, inicie os módulos Apache e MySQL.
2. **Crie o Banco de Dados**:
   - Acesse `http://localhost/phpmyadmin/`.
   - Clique na aba "Importar".
   - Selecione o arquivo `schema.sql` que está na pasta do projeto.
   - Clique em "Executar".
3. **Acesse o Site**: Abra `http://localhost/microsites/sites/www.aprovai.com/` no seu navegador.

### Recursos Implementados:
- **Gamificação**: Sistema de XP e Offensivas (Streaks) inspirados no Duolingo.
- **Feedback Visual**: Cores de sucesso e erro instantâneas ao responder.
- **Login/Cadastro**: Persistência de progresso por usuário.
- **Organização**: Questões separadas por concurso (Ex: OAB, ENEM, PRF).
- **Design Premium**: Uso de fontes modernas (Outfit), Glassmorphism e sombras suaves.

### Credenciais de Teste:
Como o banco está vazio, você pode se cadastrar na tela de login ou inserir um usuário manualmente no MySQL para testar.
