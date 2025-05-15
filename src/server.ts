import { error } from "console";

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');




const server = express();
server.use(express.json());
server.use(cors());

const usuariosPath = path.join(__dirname, 'usuarios.json');

server.post('/cadastro', (req:any, res:any) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
    }

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const existente = usuarios.find((u:any) => u.email === email);

    if (existente) {
        return res.status(409).json({ success: false, message: 'Email já cadastrado' });
    }

    const novoUsuario = { nome, email, senha, saldo: 0, viagens: 0 };
    usuarios.push(novoUsuario);
    try {
        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
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

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const usuario = usuarios.find((u:any) => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    return res.json({ nome: usuario.nome, email: usuario.email });
});


/*server.delete('/usuarios/:email', (req, res) => {
    const { email } = req.params;

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const index = usuarios.findIndex((u) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const usuarioRemovido = usuarios.splice(index, 1)[0];
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

    return res.json({ message: 'Usuário removido', usuario: usuarioRemovido });
});*/

// Obter saldo e viagens de um usuário
server.get('/saldo/:email', (req: any, res: any) => {
    const { email } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
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

    let usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const index = usuarios.findIndex((u: any) => u.email === email);

    if (index === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (typeof saldo === 'number') usuarios[index].saldo = saldo;
    if (typeof viagens === 'number') usuarios[index].viagens = viagens;

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.json({ message: "Saldo atualizado com sucesso." });
});



const porta = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
