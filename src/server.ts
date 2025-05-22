import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const server = express();
const PORT = 3000;

server.use(bodyParser.json());
server.use(cors());

// A raiz dos arquivos estáticos é a pasta PAI de 'src' (a raiz do seu projeto)
// Se server.ts está em 'src', então a raiz do projeto é a pasta um nível acima.
const staticFilesRoot = path.join(__dirname, '../'); // Isso aponta para a raiz do seu projeto
server.use(express.static(staticFilesRoot));

// Caminhos dos arquivos JSON. Se server.ts está em 'src', e os JSONs também,
// então o caminho é relativo à pasta 'src'.
const usersFilePath = path.join(__dirname, 'usuarios.json'); // No mesmo diretório que server.ts
const linesDataPath = path.join(__dirname, 'database.json');   // No mesmo diretório que server.ts

async function readJsonFile(filePath: string): Promise<any[]> {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`[readJsonFile - ${path.basename(filePath)}] Arquivo não encontrado: ${filePath}. Retornando array vazio.`);
            return [];
        }
        console.error(`[readJsonFile - ${path.basename(filePath)}] Erro ao ler o arquivo ${filePath}:`, error);
        throw new Error(`Falha ao ler o arquivo: ${error.message}`);
    }
}

async function writeJsonFile(filePath: string, data: any[]): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[writeJsonFile - ${path.basename(filePath)}] Dados escritos com sucesso.`);
    } catch (error: any) {
        console.error(`[writeJsonFile - ${path.basename(filePath)}] Erro ao escrever no arquivo ${filePath}:`, error);
        throw new Error(`Falha ao escrever no arquivo: ${error.message}`);
    }
}

// =======================================================
// ROTAS DE AUTENTICAÇÃO E USUÁRIOS
// =======================================================

server.post('/register', async (req: any, res: any) => {
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
            saldo: 0,
            viagens: 0,
            rotasFavoritas: []
        };

        users.push(newUser);
        await writeJsonFile(usersFilePath, users);

        res.status(201).json({ message: 'Registro bem-sucedido!', user: { nome: newUser.nome, email: newUser.email } });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ message: 'Erro interno do servidor durante o registro.' });
    }
});

server.post('/login', async (req: any, res: any) => {
    const { email, senha } = req.body as any;
    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const users = await readJsonFile(usersFilePath);
        const user = users.find((u: any) => u.email === email && u.senha === senha);

        if (!user) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
        res.status(200).json({ message: 'Login bem-sucedido!', user: { nome: user.nome, email: user.email } });
    } catch (error) {
        console.error("Erro no login:", error);
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
        console.error("Erro ao obter rotas favoritas:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

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
        console.error("Erro ao adicionar rota favorita:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

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
        console.error("Erro ao remover rota favorita:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// =======================================================
// ROTA ESPECÍFICA PARA database.json
// =======================================================
server.get('/database.json', async (req: any, res: any) => {
    try {
        const data = await fs.readFile(linesDataPath, 'utf8');
        console.log(`[GET /database.json] Arquivo lido com sucesso de: ${linesDataPath}`);
        res.status(200).json(JSON.parse(data));
    } catch (error: any) {
        console.error(`[GET /database.json] ERRO ao servir database.json do caminho: ${linesDataPath}. Erro:`, error);
        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'Arquivo database.json não encontrado no servidor.' });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao carregar dados das linhas.' });
    }
});


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servindo arquivos estáticos de: ${staticFilesRoot}`);
    console.log(`Caminho esperado para usuarios.json: ${usersFilePath}`);
    console.log(`Caminho esperado para database.json: ${linesDataPath}`);
});