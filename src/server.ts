// server.ts

import { error } from "console"; // 'error' is likely unused here, but kept if you have other console uses

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const usuariosPath = path.join(__dirname, 'usuarios.json');

// Helper function to read users
const readUsers = () => {
    if (!fs.existsSync(usuariosPath)) {
        console.warn("usuarios.json not found. Creating an empty array.");
        return [];
    }
    const data = fs.readFileSync(usuariosPath, 'utf-8');
    try {
        // Handle empty file case
        if (data.trim() === '') {
            return [];
        }
        return JSON.parse(data);
    } catch (e) {
        console.error("Error parsing usuarios.json:", e);
        return [];
    }
};

// Helper function to write users
const writeUsers = (users: any) => {
    fs.writeFileSync(usuariosPath, JSON.stringify(users, null, 2));
};

// --- User Management Endpoints ---

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
        console.error("Error saving user:", error); // Log server-side errors
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

    // Return the user's name, email, and favorite routes
    return res.json({ nome: usuario.nome, email: usuario.email, rotasFavoritas: usuario.rotasFavoritas || [] });
});

server.get('/saldo/:email', (req: any, res: any) => {
    const { email } = req.params;
    const usuarios = readUsers();
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ saldo: usuario.saldo, viagens: usuario.viagens });
});

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

// --- Favorite Routes Endpoints ---

server.get('/favoritas/:email', (req: any, res: any) => {
    const { email } = req.params;
    const usuarios = readUsers();
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
        // It's often better to return an empty array for favorites if user not found,
        // or a 404 if the user genuinely doesn't exist. Let's return 404 if no user.
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ rotasFavoritas: usuario.rotasFavoritas || [] });
});

server.post('/favoritas/:email', (req: any, res: any) => {
    const { email } = req.params;
    const { rota } = req.body;

    if (!rota) {
        return res.status(400).json({ message: "O nome da rota é obrigatório." });
    }

    let usuarios = readUsers();
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!usuarios[index].rotasFavoritas) {
        usuarios[index].rotasFavoritas = [];
    }

    if (!usuarios[index].rotasFavoritas.includes(rota)) {
        usuarios[index].rotasFavoritas.push(rota);
        writeUsers(usuarios);
        return res.status(200).json({ message: "Rota favorita adicionada com sucesso.", rotasFavoritas: usuarios[index].rotasFavoritas });
    } else {
        return res.status(409).json({ message: "Esta rota já está na sua lista de favoritos." });
    }
});

server.delete('/favoritas/:email/:rota', (req: any, res: any) => {
    const { email, rota } = req.params;

    let usuarios = readUsers();
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!usuarios[index].rotasFavoritas) {
        usuarios[index].rotasFavoritas = [];
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

// --- Train Times Endpoint ---

server.get('/train-time/:lineName', (req: any, res: any) => {
    const { lineName } = req.params;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let nextTrainHour: number = currentHour;
    let nextTrainMinute: number = currentMinute;
    let foundLine = true;

    // --- IMPORTANT: Replace this with your actual database lookup logic ---
    // This is a simulation based on current time and fixed intervals.
    switch (lineName) {
        case "Linha 1 - Azul":
            nextTrainMinute = currentMinute + (5 - (currentMinute % 5));
            if (nextTrainMinute >= 60) {
                nextTrainMinute -= 60;
                nextTrainHour = (currentHour + 1) % 24;
            }
            break;
        case "Linha 13 - Jade":
            nextTrainMinute = currentMinute + (10 - (currentMinute % 10));
            if (nextTrainMinute >= 60) {
                nextTrainMinute -= 60;
                nextTrainHour = (currentHour + 1) % 24;
            }
            break;
        case "Linha 4 - Vermelha":
            nextTrainMinute = currentMinute + (7 - (currentMinute % 7));
            if (nextTrainMinute >= 60) {
                nextTrainMinute -= 60;
                nextTrainHour = (currentHour + 1) % 24;
            }
            break;
        default:
            foundLine = false;
    }

    if (!foundLine) {
        return res.status(404).json({ message: "Linha de trem não encontrada ou sem previsão." });
    }

    const formattedNextTrainTime = `${String(nextTrainHour).padStart(2, '0')}:${String(nextTrainMinute).padStart(2, '0')}`;

    const nextTrainDate = new Date();
    nextTrainDate.setHours(nextTrainHour, nextTrainMinute, 0, 0);

    // Adjust if the calculated time is in the past (meaning it's for the next cycle)
    // This logic ensures that if a train "just left", it calculates the next one.
    if (nextTrainDate.getTime() < now.getTime()) {
        if (lineName === "Linha 1 - Azul") nextTrainDate.setMinutes(nextTrainDate.getMinutes() + 5);
        else if (lineName === "Linha 13 - Jade") nextTrainDate.setMinutes(nextTrainDate.getMinutes() + 10);
        else if (lineName === "Linha 4 - Vermelha") nextTrainDate.setMinutes(nextTrainDate.getMinutes() + 7);
    }

    const timeUntilNextTrainMs = nextTrainDate.getTime() - now.getTime();
    let timeUntilNextTrainMinutes = Math.ceil(timeUntilNextTrainMs / (1000 * 60));

    // Ensure minimum of 1 minute if time is very close (e.g., 0 minutes means "now" or less than a minute)
    if (timeUntilNextTrainMinutes <= 0) {
        timeUntilNextTrainMinutes = 1;
    }

    res.json({
        line: lineName,
        nextTrainTime: formattedNextTrainTime,
        timeUntilNextTrainMinutes: timeUntilNextTrainMinutes
    });
});


const porta = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});