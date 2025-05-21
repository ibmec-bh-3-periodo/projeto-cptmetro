import { error } from "console";

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const usuariosPath = path.join(__dirname, './usuarios.json');

// Helper function to read users
const readUsers = () => {
    return JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
};

// Helper function to write users
const writeUsers = (users: any) => {
    fs.writeFileSync(usuariosPath, JSON.stringify(users, null, 2));
};

server.post('/cadastro', (req:any, res:any) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
    }

    const usuarios = readUsers();
    const existente = usuarios.find((u:any) => u.email === email);

    if (existente) {
        return res.status(409).json({ success: false, message: 'Email já cadastrado' });
    }

    // Initialize rotasFavoritas as an empty array for new users
    const novoUsuario = { nome, email, senha, saldo: 0, viagens: 0, rotasFavoritas: [] };
    usuarios.push(novoUsuario);
    try {
        writeUsers(usuarios);
        res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro ao salvar o usuário' });
    }
});

server.post('/login', (req:any, res:any) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const usuarios = readUsers();
    const usuario = usuarios.find((u:any) => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    // Return the user's favorite routes as well
    return res.json({ nome: usuario.nome, email: usuario.email, rotasFavoritas: usuario.rotasFavoritas });
});

// Obter saldo e viagens de um usuário
server.get('/saldo/:email', (req: any, res: any) => {
    const { email } = req.params;
    const usuarios = readUsers();
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ saldo: usuario.saldo, viagens: usuario.viagens });
});

// Atualizar saldo e viagens
server.put('/saldo/:email', (req: any, res: any) => {
    const { email } = req.params;
    const { saldo, viagens } = req.body;

    let usuarios = readUsers();
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (typeof saldo === 'number') usuarios[index].saldo = saldo;
    if (typeof viagens === 'number') usuarios[index].viagens = viagens;

    writeUsers(usuarios);
    res.json({ message: "Saldo atualizado com sucesso." });
});

// --- API Endpoints for Favorite Routes ---

// GET favorite routes for a user
server.get('/favoritas/:email', (req: any, res: any) => {
    const { email } = req.params;
    const usuarios = readUsers();
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ rotasFavoritas: usuario.rotasFavoritas || [] });
});

// POST (add) a favorite route for a user
server.post('/favoritas/:email', (req: any, res: any) => {
    const { email } = req.params;
    const { rota } = req.body; // 'rota' will be the selected line value

    if (!rota) {
        return res.status(400).json({ message: "O nome da rota é obrigatório." });
    }

    let usuarios = readUsers();
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Ensure rotasFavoritas exists and is an array
    if (!usuarios[index].rotasFavoritas) {
        usuarios[index].rotasFavoritas = [];
    }

    // Avoid adding duplicates
    if (!usuarios[index].rotasFavoritas.includes(rota)) {
        usuarios[index].rotasFavoritas.push(rota);
        writeUsers(usuarios);
        return res.status(200).json({ message: "Rota favorita adicionada com sucesso.", rotasFavoritas: usuarios[index].rotasFavoritas });
    } else {
        return res.status(409).json({ message: "Esta rota já está na sua lista de favoritos." });
    }
});

// DELETE a favorite route for a user
server.delete('/favoritas/:email/:rota', (req: any, res: any) => {
    const { email, rota } = req.params; // 'rota' will come from the URL parameter

    let usuarios = readUsers();
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!usuarios[index].rotasFavoritas) {
        usuarios[index].rotasFavoritas = []; // Initialize if null/undefined
    }

    const initialLength = usuarios[index].rotasFavoritas.length;
    usuarios[index].rotasFavoritas = usuarios[index].rotasFavoritas.filter((fav: string) => fav !== rota);

    if (usuarios[index].rotasFavoritas.length < initialLength) {
        writeUsers(usuarios);
        return res.status(200).json({ message: "Rota favorita removida com sucesso.", rotasFavoritas: usuarios[index].rotasFavoritas });
    } else {
        return res.status(404).json({ message: "Rota favorita não encontrada." });
    }
});


const porta = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});