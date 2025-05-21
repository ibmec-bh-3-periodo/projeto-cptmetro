import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const server = express();
const PORT = 3000;

server.use(bodyParser.json());
server.use(cors());

const usersFilePath = path.join(__dirname, 'usuarios.json');

async function readJsonFile(filePath: string): Promise<any[]> {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`Arquivo não encontrado em ${filePath}. Criando um vazio.`);
            return []; // Retorna um array vazio se o arquivo não existe
        }
        console.error(`Erro ao ler o arquivo ${filePath}:`, error);
        throw new Error(`Falha ao ler o arquivo: ${error.message}`);
    }
}

async function writeJsonFile(filePath: string, data: any[]): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Dados escritos em ${filePath}.`);
    } catch (error: any) {
        throw new Error(`Falha ao escrever no arquivo: ${error.message}`);
    }
}

// =======================================================
// ROTAS DE AUTENTICAÇÃO E USUÁRIOS
// =======================================================

// Rota de registro
server.post('/register', async (req: any, res: any) => {
    // CORREÇÃO: Usando 'nome', 'email', 'senha' para o registro
    const { nome, email, senha } = req.body as any;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const users = await readJsonFile(usersFilePath);

        if (users.some((user: any) => user.email === email)) {
            return res.status(409).json({ message: 'Este e-mail já está registrado.' });
        }

        const newUser = {
            nome,
            email,
            senha, 
            saldo: 0, // Adicionando saldo padrão
            viagens: 0, // Adicionando viagens padrão
            rotasFavoritas: []
        };

        users.push(newUser);
        await writeJsonFile(usersFilePath, users);
        console.log(`Usuário ${newUser.email} registrado e salvo.`);

        res.status(201).json({ message: 'Registro bem-sucedido!', user: { nome: newUser.nome, email: newUser.email } });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ message: 'Erro interno do servidor durante o registro.' });
    }
});

// Rota de login
server.post('/login', async (req: any, res: any) => {
    const { email, senha } = req.body as any;
    if (!email || !senha) {
        console.log("Erro: Email ou senha vazios.");
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const users = await readJsonFile(usersFilePath);
        console.log("Usuários carregados do arquivo 'usuarios.json':", users);

        const user = users.find((u: any) => u.email === email && u.senha === senha);

        if (!user) {
            console.log("Nenhum usuário encontrado com as credenciais fornecidas.");
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
        res.status(200).json({ message: 'Login bem-sucedido!', user: { nome: user.nome, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor durante o login.' });
    } 
});

// =======================================================
// ROTAS DE ROTAS FAVORITAS
// =======================================================

server.get('/favoritas/:email', async (req: any, res: any) => {
    const userEmail = req.params.email;

    try {
        const users = await readJsonFile(usersFilePath);
        const user = users.find((u: any) => u.email === userEmail);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ rotasFavoritas: user.rotasFavoritas || [] });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para adicionar uma rota favorita a um usuário
server.post('/favoritas/:email', async (req: any, res: any) => {
    const userEmail = req.params.email;
    const { rota } = req.body as { rota: string };

    if (!rota) {
        return res.status(400).json({ message: 'O nome da rota é obrigatório.' });
    }

    try {
        const users = await readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u: any) => u.email === userEmail);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = users[userIndex];
        if (!user.rotasFavoritas) {
            user.rotasFavoritas = [];
        }

        if (user.rotasFavoritas.includes(rota)) {
            return res.status(409).json({ message: 'Esta rota já está nos favoritos.' });
        }

        user.rotasFavoritas.push(rota);
        await writeJsonFile(usersFilePath, users);

        res.status(200).json({ message: 'Rota adicionada aos favoritos!', rotasFavoritas: user.rotasFavoritas });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para remover uma rota favorita de um usuário
server.delete('/favoritas/:email/:rota', async (req: any, res: any) => {
    const userEmail = req.params.email;
    const rotaToRemove = decodeURIComponent(req.params.rota);

    try {
        const users = await readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u: any) => u.email === userEmail);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = users[userIndex];
        if (!user.rotasFavoritas || !user.rotasFavoritas.includes(rotaToRemove)) {
            return res.status(404).json({ message: 'Rota favorita não encontrada para este usuário.' });
        }

        user.rotasFavoritas = user.rotasFavoritas.filter((r: string) => r !== rotaToRemove);
        await writeJsonFile(usersFilePath, users);

        res.status(200).json({ message: 'Rota removida dos favoritos!', rotasFavoritas: user.rotasFavoritas });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});