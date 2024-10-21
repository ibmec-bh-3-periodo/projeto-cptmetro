# projeto-cptm-grupo4

- [Registro de Dailies](https://docs.google.com/document/d/1D0h7AgVgcb1xzSg7Hnw3ze4euTFOjOXcYOAkQtqAha0/edit?usp=sharing)
  
## Integrantes

- Laura Furtado: Scrum Master
- Antônia Villela: Desenvolvimento
- Melina Pissolato: Desenvolvimento

# 1. Nome do Projeto: Grupo 4

Um aplicativo para utilização do metrô.

## 2. Apresentação do Projeto

Este projeto é um sistema para automatizar a experiência do usuário ao utilizar o metrô de São Paulo. Ele permite que os usuários possam realizar pagamentos, acompanhar o seu transporte e entrar em contato com a CPTM em caso de problemas. O projeto foi pensado para facilitar e melhorar a experiência do usuário.

## 3. Gestão de Código

Este projeto utiliza as seguintes tecnologias e ferramentas:

- **Linguagens:** HTML, CSS e JS
- **Framework:** Bootstrap
- **Versionamento de código:** Git

### Padrão para nomes de branches

- feature/: Usado para novas funcionalidades.
Exemplo: feature/adicionar-login-social

- bug/: Usado para correção de bugs.
Exemplo: bug/corrigir-botao-de-envio

- fix/: Usado para correções urgentes em produção.
Exemplo: fix/corrigir-falha-autenticacao

- chore/: Usado para pequenas tarefas ou atualizações técnicas que não afetam o código funcional.
Exemplo: chore/atualizar-documentacao

### Tipos de Commits

- add: Adição de uma nova funcionalidade.
Exemplo: add: implementar sistema de login com JWT

- bug: Correção de bugs.
Exemplo: bug: corrigir erro no cálculo de desconto

- docs: Alterações na documentação.
Exemplo: docs: atualizar README com instruções de instalação

- style: Alterações de formatação e estilo (não afetam a lógica).
Exemplo: style: ajustar espaçamento no arquivo CSS

- refactor: Refatoração de código (melhorias sem adicionar novas funcionalidades).
Exemplo: refactor: otimizar função de busca

- test: Adição ou correção de testes.
Exemplo: test: adicionar testes unitários para componente Header

- chore: Atualizações gerais que não alteram código funcional (ex: atualizações de dependências).
Exemplo: chore: atualizar pacotes NPM

### 4. Organização de Pastas e Arquivos

- **/src**: Contém o código fonte do projeto.
  - **/index**: Arquivos HTML.
  - **/css**: Folhas de estilo CSS.
  - **/js**: Arquivos JS.
  - **/img**: Imagens.
- **/docs**: Documentação do projeto.


### 5. Requisitos Funcionais

1. **Cadastro de Usuários:** Permite o registro de novos usuários (admin e funcionários).
2. **Pagamento:** Usuários podem adicionar uma forma de pagamento.
3. **Mapas:** O usuário consegue ver os mapas dos metrôs e o histórico de viagens.
4. **Ticket:** Usuário pode criar um QR CODE para utilizar nas catracas das estações
5. **Login e Autenticação:** Sistema seguro de login com autenticação JWT.


