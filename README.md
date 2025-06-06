
# 🚇 Projeto CPTMetrô

Sistema web que visa facilitar e automatizar a experiência do usuário no uso do metrô de São Paulo. O aplicativo oferece funcionalidades como compra de bilhetes, visualização de mapas, situação das linhas, notícias, QR Code para acesso, entre outros.

---

## 👥 Integrantes

- **Laura Furtado** – Desenvolvedora  
- **Antônia Villela** – Desenvolvedora  
- **Melina Pissolato** – Desenvolvedora  
- **João Pedro Castro** – Desenvolvedor  
- **Gabriel Borem** – Desenvolvedor  
- **Vitor Neves** – Scrum Master

---

## 📋 Sumário

- [Apresentação do Projeto](#apresentação-do-projeto)  
- [Tecnologias Utilizadas](#tecnologias-utilizadas)  
- [Organização de Pastas](#organização-de-pastas)  
- [Padrão de Branches e Commits](#padrão-de-branches-e-commits)  
- [Requisitos Funcionais](#requisitos-funcionais)  
- [Documentação da API](#documentação-da-api)  
- [Execução do Projeto](#execução-do-projeto)  
- [Execução com Docker](#execução-com-docker)  

---

## 📌 Apresentação do Projeto

O **CPTMetrô** é um aplicativo que automatiza o uso do metrô de São Paulo. Ele permite aos usuários:

- Realizar pagamentos de passagens.
- Acompanhar horários e situação das linhas.
- Gerar QR Code de acesso.
- Consultar notícias e entrar em contato com a CPTM.

---

## 🛠 Tecnologias Utilizadas

- **Linguagens:** HTML, CSS, JavaScript, TypeScript  
- **Frameworks e Bibliotecas:** Bootstrap, Express  
- **Versionamento:** Git  
- **Gerenciamento de Pacotes:** npm

---

## 📁 Organização de Pastas

```
projeto-cptmetro/
├── .github/                 # Configurações do GitHub
├── .vscode/                 # Configurações do VSCode
├── docs/                    # Documentação do projeto (scrum, backlog, dailys)
│   ├── Abertura Sprint/
│   ├── Backlog.txt
│   ├── Dailys/
│   └── Retrospectiva/
├── node_modules/
├── src/                     # Código-fonte do sistema
│   ├── configuração/
│   ├── homepage/
│   ├── horários/
│   ├── icones/
│   ├── img/
│   ├── login_e_registro/
│   ├── mapa/
│   ├── notícias/
│   ├── pagamento/
│   ├── qrcode/
│   ├── viagens_favorit./
│   ├── database.json
│   ├── usuarios.json
│   ├── server.ts
│   └── server.js
├── teste_*/                 # Pastas de testes isolados por desenvolvedor
├── Dockerfile
├── .dockerignore
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🧭 Padrão de Branches e Commits

### 📌 Nomenclatura de Branches

- `feature/`: Novas funcionalidades  
- `bug/`: Correções de bugs  
- `fix/`: Correções urgentes em produção  
- `chore/`: Tarefas técnicas e não funcionais  
- `docs/`: Alterações na documentação

### 📝 Tipos de Commits

| Tipo     | Descrição                                           |
|----------|------------------------------------------------------|
| add      | Adição de funcionalidade                            |
| bug      | Correção de erro                                    |
| docs     | Atualização de documentação                         |
| style    | Alterações visuais (sem impacto na lógica)          |
| refactor | Refatoração de código (sem alterar funcionalidade)  |
| test     | Inclusão/correção de testes                         |
| chore    | Atualizações não relacionadas à lógica do app       |

---

## ✅ Requisitos Funcionais

1. Cadastro e login de usuários  
2. Adição de forma de pagamento  
3. Visualização de mapa das linhas  
4. Geração de QR Code para bilhetes  
5. Exibição de notícias sobre o metrô  
6. Gestão de viagens favoritas  
7. Verificação da situação das linhas  
8. Página de contato e ouvidoria  

---

## 📘 Documentação da API

### Base URL

```
http://localhost:3000/
```

### POST `/cadastro`

Cria um novo usuário.

**Body:**
```json
{
  "nome": "Maria",
  "email": "maria@example.com",
  "senha": "123456"
}
```

**Respostas:**
- `201 Created`: Sucesso  
- `400`: Campos obrigatórios ausentes  
- `409`: Email já cadastrado  
- `500`: Erro interno

---

### POST `/login`

Realiza autenticação do usuário.

**Body:**
```json
{
  "email": "maria@example.com",
  "senha": "123456"
}
```

**Respostas:**
- `200 OK`: Retorna nome e email  
- `400`: Campos obrigatórios ausentes  
- `401`: Credenciais incorretas

---

### GET `/tickets/:email`

Retorna número de tickets do usuário.

**Resposta:**
```json
{ "tickets": 5 }
```

- `404`: Usuário não encontrado

---

### PUT `/tickets/:email`

Atualiza saldo de tickets.

**Body:**
```json
{
  "tickets": 3
}
```

- `200 OK`: Atualizado com sucesso  
- `404`: Usuário não encontrado

---

### DELETE `/usuarios/:email` _(Comentado)_

> Disponível no código, mas desativado por padrão. Permite deletar um usuário pelo email.

---

## ▶️ Execução do Projeto

```bash
npm install
npm run dev
```

- Porta padrão: `3000`  
- Banco de dados: `usuarios.json`

---

## 🐳 Execução com Docker

1. **Build da imagem**
```bash
docker build -t projeto-metro .
```

2. **Executar container**
```bash
docker run -p 3000:3000 projeto-metro
```

3. **Acessar no navegador**
```
http://localhost:3000
```

---

## 🧾 Exemplo de Dados de Usuário

```json
[
  {
    "nome": "Maria",
    "email": "maria@example.com",
    "senha": "123456",
    "tickets": 3,
    "rotasFavoritas": []
  }
]
```
