const express = require('express');
const fs = require('fs');
const path = require('path');
const data = require('./database.json');
const usuarios = require('./usuarios.json');

const server = express();
server.use(express.json());

const usuariosPath = path.join(__dirname, 'usuarios.json');

server.post('/usuarios', (req:any, res:any) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));

    const existente = usuarios.find((u: any) => u.email === email);
    if (existente) {
        return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const novoUsuario = { nome, email, senha };
    usuarios.push(novoUsuario);

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

    return res.status(201).json(novoUsuario);
});

server.put('/usuarios/:email', (req:any, res:any) => {
    const { email } = req.params;
    const { nome, senha } = req.body;

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));

    const index = usuarios.findIndex((u: any) => u.email === email);
    if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (nome) usuarios[index].nome = nome;
    if (senha) usuarios[index].senha = senha;

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

    return res.json(usuarios[index]);
});

server.delete('/usuarios/:email', (req:any, res:any) => {
    const { email } = req.params;

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));

    const index = usuarios.findIndex((u: any) => u.email === email);
    if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const usuarioRemovido = usuarios.splice(index, 1)[0];

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

    return res.json({ message: 'Usuário removido', usuario: usuarioRemovido });
});

const porta: number = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
