# [Grupo 4] Projeto CPTMetrô
- [Registro de Dailies](https://docs.google.com/document/d/1D0h7AgVgcb1xzSg7Hnw3ze4euTFOjOXcYOAkQtqAha0/edit?usp=sharing)
- [Apresentação no Power Point(Front-End)](https://docs.google.com/presentation/d/1HmFXLpo6D4nh54Ol-A4I6Ummylo9N-IeL4LoG4LOqRY/edit?usp=sharing)
  
## Integrantes

- Laura Furtado: Desenvolvedor
- Antônia Villela: Desenvolvedor
- Melina Pissolato: Desenvolvedor
- João Pedro Castro: Desenvolvedor
- Gabriel Borem: Desenvolvedor
- Vitor Neves: Scrum Master

# 1. Nome do Projeto: CPTMetrô

Um aplicativo para utilização do metrô de São Paulo.

## 2. Apresentação do Projeto
Este projeto é um sistema para automatizar a experiência do usuário ao utilizar o metrô de São Paulo. Ele permite que os usuários possam realizar pagamentos, acompanhar o seu transporte e entrar em contato com a CPTM em caso de necessidades. O projeto foi pensado para facilitar e melhorar a jornada do usuário.

## 3. Gestão de Código

Este projeto utiliza as seguintes tecnologias e ferramentas:

- **Linguagens:** HTML, CSS, TS e JS
- **Framework:** Bootstrap, Express
- **Versionamento de código:** Git

### Padrão para nomes de branches

- feature/: Usado para novas funcionalidades.
Exemplo: feature/adicao-login-social

- bug/: Usado para correção de bugs.
Exemplo: bug/correcao-botao-de-envio

- fix/: Usado para correções urgentes em produção.
Exemplo: fix/correcao-falha-autenticacao

- chore/: Usado para pequenas tarefas ou atualizações técnicas que não afetam o código funcional.
Exemplo: chore/atualizacao-da-documentacao

- docs/: Usado para modificações nos documentos.
Exemplo: docs/atualizacao-de-dailys

### Tipos de Commits

- add: Adição de uma nova funcionalidade.
Exemplo: add: implementação do sistema de login com JavaScript

- bug: Correção de bugs.
Exemplo: bug: correção do erro no cálculo de desconto

- docs: Alterações na documentação.
Exemplo: docs: atualização do README

- style: Alterações de formatação e estilo (não afetam a lógica).
Exemplo: style: ajuste do espaçamento no arquivo CSS

- refactor: Refatoração de código (melhorias sem adicionar novas funcionalidades).
Exemplo: refactor: otimização da função de busca

- test: Adição ou correção de testes.
Exemplo: test: adição de testes unitários para componente Header

- chore: Atualizações gerais que não alteram código funcional (ex: atualizações de dependências).
Exemplo: chore: atualização de responsividade

### 4. Organização de Pastas e Arquivos
- Pasta src -> Pastas exclusivas para cada página, ícones e de imagens separadas.
- Páginas relacionadas organizadas na mesma pasta (ex: página de redes sociais e de configuração).
- Pasta docs -> Documentação do projeto, com Aberturas de sprints, backlog, daily e a retrospectiva.

projeto-cptmetro/
├── .github/                      # Configurações relacionadas ao GitHub (workflows, issue templates, etc.)
├── .vscode/                      # Configurações específicas para o ambiente de desenvolvimento VS Code
├── docs/                         # Documentação do projeto, incluindo artefatos de metodologia ágil
│   ├── Abertura Sprint           # Documento ou pasta detalhando o planejamento da Sprint
│   ├── Backlog.txt               # Backlog do produto ou da Sprint em formato de texto
│   ├── Dailys                    # Documentos ou registros das reuniões diárias (Dailys)
│   └── Retrospectiva             # Documentos ou análises de retrospectivas de Sprints
├── node_modules/                 # Dependências do Node.js instaladas (gerado pelo npm install)
├── src/                          # Diretório principal para todo o código-fonte da aplicação
│   ├── configuração/             # Pode conter arquivos de configuração específicos da aplicação
│   ├── homepage/                 # Contém arquivos relacionados à página principal após o login
│   │   └── home.html             # Exemplo: Página HTML da homepage
│   ├── horários/                 # Provavelmente contém arquivos relacionados a exibição de horários
│   ├── icones/                   # Armazena arquivos de ícones (imagens, SVGs)
│   ├── img/                      # Armazena outras imagens gerais do projeto
│   ├── login_e_registro/         # Contém arquivos HTML/CSS/JS para as páginas de login e registro
│   ├── mapa/                     # Pode conter arquivos relacionados à funcionalidade de mapa de linhas
│   ├── notícias/                 # Provavelmente contém recursos para exibir notícias ou atualizações
│   ├── pagamento/                # Contém arquivos relacionados a funcionalidades de pagamento
│   ├── qrcode/                   # Contém arquivos específicos para a funcionalidade de QR Code (geração, leitura)
│   ├── viagens_favorit./         # Contém arquivos da funcionalidade de viagens favoritas (viagens.html, viagens.js)
│   ├── database.json             # Armazena dados das linhas de trem e seus horários
│   ├── server.js                 # Versão JavaScript compilada do server.ts (gerado pelo TypeScript)
│   ├── server.ts                 # Código-fonte do servidor Node.js (backend) em TypeScript
│   └── usuarios.json             # Armazena dados de usuários e suas rotas favoritas
├── teste_logout_laura/           # Pastas de teste/ramo de desenvolvimento específico (indica branch/feature antiga)
├── teste_mapa_vitor/             # Pastas de teste/ramo de desenvolvimento específico
├── teste_qrcode_ga.../           # Pastas de teste/ramo de desenvolvimento específico
├── teste_registro_a.../          # Pastas de teste/ramo de desenvolvimento específico
├── teste_saudacao.../            # Pastas de teste/ramo de desenvolvimento específico
├── .dockerignore                 # Define arquivos e pastas a serem ignorados ao construir imagens Docker
├── .gitignore                    # Define arquivos e pastas a serem ignorados pelo Git
├── Dockerfile                    # Instruções para construir a imagem Docker do aplicativo
├── index.html                    # Página inicial principal do site (geralmente a página de login/cadastro)
├── package-lock.json             # Registro exato das versões das dependências instaladas
├── package.json                  # Configurações do projeto Node.js e lista de dependências
├── README.md                     # Documentação principal do projeto
└── tsconfig.json                 # Configurações do compilador TypeScript

### 5. Requisitos Funcionais

1. **Cadastro de Usuários:** Permite o registro de novos usuários.
2. **Pagamento:** Usuários podem adicionar uma forma de pagamento.
3. **Mapas:** Usuário consegue ver os mapas das linhas dos metrôs e o caminho percorrido pelo metrô para chegar até ele.
4. **Ticket:** Usuário pode criar um QR CODE para utilizar nas catracas das estações.
5. **Notícias:** Usuário consegue acompanhar as notícias relacionadas ao metrô.
6. **Viagens favoritas:** Usuário consegue selecionar suas viagens favoritas.
7. **Situação das linhas:** Usuário consegue acompanhar se a linha que deseja se encontra em atraso, no horário de funcionamento ou chegando.
8. **Contato:** Usuário tem acesso às páginas de contato e ouvidoria para fazer qualquer reclamação, elogio ou sugestão.

### 6. Documentação API

# 📘 API de Cadastro e Gerenciamento de Usuários

API simples desenvolvida em Node.js com Express. Utiliza um arquivo JSON como banco de dados local. Permite:

- Cadastro de usuários
- Login
- Consulta de saldo e número de viagens
- Atualização de saldo e viagens

---

## 🌐 Base URL

```
http://localhost:3000/
```

---

## 📥 POST `/cadastro`

### ➤ Descrição
Cria um novo usuário e o armazena no arquivo `usuarios.json`.

### 🔸 Body (JSON)
```json
{
  "nome": "Maria",
  "email": "maria@example.com",
  "senha": "123456"
}
```

### 🔸 Respostas

#### ✅ 201 Created
```json
{ "success": true, "message": "Usuário cadastrado com sucesso" }
```

#### ❌ 400 Bad Request
```json
{ "success": false, "message": "Nome, email e senha são obrigatórios" }
```

#### ❌ 409 Conflict
```json
{ "success": false, "message": "Email já cadastrado" }
```

#### ❌ 500 Internal Server Error
```json
{ "success": false, "message": "Erro ao salvar o usuário" }
```

---

## 🔐 POST `/login`

### ➤ Descrição
Realiza a autenticação de um usuário.

### 🔸 Body (JSON)
```json
{
  "email": "maria@example.com",
  "senha": "123456"
}
```

### 🔸 Respostas

#### ✅ 200 OK
```json
{
  "nome": "Maria",
  "email": "maria@example.com"
}
```

#### ❌ 400 Bad Request
```json
{ "message": "Email e senha são obrigatórios" }
```

#### ❌ 401 Unauthorized
```json
{ "message": "Email ou senha incorretos" }
```

---

## 📊 GET `/saldo/:email`

### ➤ Descrição
Retorna o saldo e o número de viagens de um usuário.

### 🔸 Parâmetro de URL
- `email`: Email do usuário.

### 🔸 Respostas

#### ✅ 200 OK
```json
{ "saldo": 50, "viagens": 10 }
```

#### ❌ 404 Not Found
```json
{ "message": "Usuário não encontrado." }
```

---

## ✏️ PUT `/saldo/:email`

### ➤ Descrição
Atualiza o saldo e/ou número de viagens de um usuário.

### 🔸 Parâmetro de URL
- `email`: Email do usuário.

### 🔸 Body (JSON)
```json
{
  "saldo": 100,
  "viagens": 5
}
```

- Os campos são opcionais, mas ao menos um deve ser enviado.

### 🔸 Respostas

#### ✅ 200 OK
```json
{ "message": "Saldo atualizado com sucesso." }
```

#### ❌ 404 Not Found
```json
{ "message": "Usuário não encontrado." }
```

---

## 🚫 DELETE `/usuarios/:email` _(Comentado no código)_

> Essa rota permitiria excluir um usuário com base no email.  
> Está comentada no código-fonte, mas pode ser ativada conforme necessidade.

---

## ▶️ Como Rodar o Projeto

```bash
npm install
node nome-do-arquivo.js
```

- O servidor será iniciado na porta **3000**
- Os dados são armazenados em `usuarios.json`

---

## 🧾 Dependências

- express
- cors
- fs (nativo do Node.js)
- path (nativo do Node.js)

---

## 📂 Exemplo de Estrutura dos Dados

```json
[
  {
    "nome": "Maria",
    "email": "maria@example.com",
    "senha": "123456",
    "saldo": 50,
    "viagens": 2
  }
]
```

## ▶️ Como Executar o Projeto com o Docker

1. Build da imagem :
docker build -t projeto-metro

2. Executar com Docker:
docker run -p 3000:3000 projeto-metro

3. Acesse no navegador:
http://localhost:3000
  
