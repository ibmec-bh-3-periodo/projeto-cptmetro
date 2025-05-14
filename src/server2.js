const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const DB_FILE = "data.json";

// Função para carregar os dados do arquivo
function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Função para salvar os dados
function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Obter dados do usuário
app.get("/usuario/:username", (req, res) => {
  const data = loadData();
  const user = data[req.params.username];
  if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });
  res.json(user);
});

// Criar ou atualizar saldo
app.post("/usuario/:username/recarregar", (req, res) => {
  const { username } = req.params;
  const data = loadData();
  const user = data[username] || { saldo: 0, viagens: 0 };

  user.saldo += 4.40;
  user.viagens += 1;

  data[username] = user;
  saveData(data);
  res.json(user);
});

// Reduzir saldo (ex: após uso do QR Code)
app.post("/usuario/:username/reduzir", (req, res) => {
  const { username } = req.params;
  const data = loadData();
  const user = data[username];

  if (!user || user.saldo < 4.40) {
    return res.status(400).json({ erro: "Saldo insuficiente ou usuário inexistente." });
  }

  user.saldo -= 4.40;
  user.viagens -= 1;

  data[username] = user;
  saveData(data);
  res.json(user);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
