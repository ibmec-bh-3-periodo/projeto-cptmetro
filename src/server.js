"use strict";
const express = require('express');
const fs = require('fs');
const path = require('path');

const server = express();
server.use(express.json());

const usuariosPath = path.join(__dirname, 'usuarios.json');

// Middleware para CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Criar usuário
server.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const existente = usuariosData.find((u) => u.email === email);

    if (existente) {
        return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const novoUsuario = { nome, email, senha };
    usuariosData.push(novoUsuario);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuariosData, null, 2));

    return res.status(201).json(novoUsuario);
});

// Buscar usuário por email
server.get('/usuarios/:email', (req, res) => {
    const { email } = req.params;
    const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const usuario = usuariosData.find((u) => u.email === email);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Não retorna a senha
    const { senha, ...dadosUsuario } = usuario;
    return res.json(dadosUsuario);
});

// Atualizar usuário
server.put('/usuarios/:email', (req, res) => {
    const { email } = req.params;
    const { nome, senha } = req.body;
    const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const index = usuariosData.findIndex((u) => u.email === email);
    if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    if (nome) usuariosData[index].nome = nome;
    if (senha) usuariosData[index].senha = senha;
    fs.writeFileSync(usuariosPath, JSON.stringify(usuariosData, null, 2));
    return res.json(usuariosData[index]);
});

// Remover usuário
server.delete('/usuarios/:email', (req, res) => {
    const { email } = req.params;
    const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const index = usuariosData.findIndex((u) => u.email === email);
    if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const usuarioRemovido = usuariosData.splice(index, 1)[0];
    fs.writeFileSync(usuariosPath, JSON.stringify(usuariosData, null, 2));
    return res.json({ message: 'Usuário removido', usuario: usuarioRemovido });
});

const porta = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

// Rota para aumentar saldo do usuário
server.post('/usuarios/:email/saldo', async (req, res) => {
  const { email } = req.params;
  const { valor } = req.body;

  if (typeof valor !== 'number' || valor <= 0) {
    return res.status(400).json({ message: 'Valor deve ser um número positivo' });
  }

  try {
    const users = await readJsonFile(usersFilePath);
    const index = users.findIndex(u => u.email === email);

    if (index === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    users[index].saldo = (users[index].saldo || 0) + valor;

    await writeJsonFile(usersFilePath, users);

    return res.status(200).json({ message: 'Saldo atualizado', saldo: users[index].saldo });
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
