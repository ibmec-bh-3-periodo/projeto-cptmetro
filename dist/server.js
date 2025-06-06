"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const server = (0, express_1.default)();
const PORT = 3000;
server.use(body_parser_1.default.json());
server.use((0, cors_1.default)());
// A raiz dos arquivos estáticos é a pasta PAI de 'src' (a raiz do seu projeto)
// Se server.ts está em 'src', então a raiz do projeto é a pasta um nível acima.
const staticFilesRoot = path_1.default.join(__dirname, '../src');
server.use(express_1.default.static(staticFilesRoot));
server.use('/src', express_1.default.static(staticFilesRoot));
server.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../index.html"));
});
// Adicionar middleware para lidar com caminhos relativos
server.use((req, res, next) => {
    if (req.path.startsWith('/src/')) {
        req.url = req.url.replace('/src/', '/');
    }
    next();
});
// Caminhos dos arquivos JSON. Se server.ts está em 'src', e os JSONs também,
// então o caminho é relativo à pasta 'src'.
const usersFilePath = path_1.default.join(__dirname, 'usuarios.json'); // No mesmo diretório que server.ts
const linesDataPath = path_1.default.join(__dirname, 'database.json'); // No mesmo diretório que server.tss
function readJsonFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield promises_1.default.readFile(filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`[readJsonFile - ${path_1.default.basename(filePath)}] Arquivo não encontrado: ${filePath}. Retornando array vazio.`);
                return [];
            }
            console.error(`[readJsonFile - ${path_1.default.basename(filePath)}] Erro ao ler o arquivo ${filePath}:`, error);
            throw new Error(`Falha ao ler o arquivo: ${error.message}`);
        }
    });
}
function writeJsonFile(filePath, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`[writeJsonFile - ${path_1.default.basename(filePath)}] Dados escritos com sucesso.`);
        }
        catch (error) {
            console.error(`[writeJsonFile - ${path_1.default.basename(filePath)}] Erro ao escrever no arquivo ${filePath}:`, error);
            throw new Error(`Falha ao escrever no arquivo: ${error.message}`);
        }
    });
}
// =======================================================
// ROTAS DE AUTENTICAÇÃO E USUÁRIOS
// =======================================================
server.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }
    try {
        const users = yield readJsonFile(usersFilePath);
        if (users.some((user) => user.email === email)) {
            return res.status(409).json({ message: 'Este e-mail já está registrado.' });
        }
        const newUser = {
            nome,
            email,
            senha,
            tickets: 0,
            viagens: 0,
            rotasFavoritas: []
        };
        users.push(newUser);
        yield writeJsonFile(usersFilePath, users);
        res.status(201).json({ message: 'Registro bem-sucedido!', user: { nome: newUser.nome, email: newUser.email } });
    }
    catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ message: 'Erro interno do servidor durante o registro.' });
    }
}));
server.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }
    try {
        const users = yield readJsonFile(usersFilePath);
        const user = users.find((u) => u.email === email && u.senha === senha);
        if (!user) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
        res.status(200).json({ message: 'Login bem-sucedido!', user: { nome: user.nome, email: user.email } });
    }
    catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno do servidor durante o login.' });
    }
}));
// =======================================================
// ROTAS DE ROTAS FAVORITAS
// =======================================================
server.get('/favoritas/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.email;
    try {
        const users = yield readJsonFile(usersFilePath);
        const user = users.find((u) => u.email === userEmail);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ rotasFavoritas: user.rotasFavoritas || [] });
    }
    catch (error) {
        console.error("Erro ao obter rotas favoritas:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
server.post('/favoritas/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.email;
    const { rota } = req.body;
    if (!rota) {
        return res.status(400).json({ message: 'O nome da rota é obrigatório.' });
    }
    try {
        const users = yield readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u) => u.email === userEmail);
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
        yield writeJsonFile(usersFilePath, users);
        res.status(200).json({ message: 'Rota adicionada aos favoritos!', rotasFavoritas: user.rotasFavoritas });
    }
    catch (error) {
        console.error("Erro ao adicionar rota favorita:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
server.delete('/favoritas/:email/:rota', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.email;
    const rotaToRemove = decodeURIComponent(req.params.rota);
    try {
        const users = yield readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u) => u.email === userEmail);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const user = users[userIndex];
        if (!user.rotasFavoritas || !user.rotasFavoritas.includes(rotaToRemove)) {
            return res.status(404).json({ message: 'Rota favorita não encontrada para este usuário.' });
        }
        user.rotasFavoritas = user.rotasFavoritas.filter((r) => r !== rotaToRemove);
        yield writeJsonFile(usersFilePath, users);
        res.status(200).json({ message: 'Rota removida dos favoritos!', rotasFavoritas: user.rotasFavoritas });
    }
    catch (error) {
        console.error("Erro ao remover rota favorita:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
// =======================================================
// ROTA ESPECÍFICA PARA database.json
// =======================================================
server.get('/database.json', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(linesDataPath, 'utf8');
        console.log(`[GET /database.json] Arquivo lido com sucesso de: ${linesDataPath}`);
        res.status(200).json(JSON.parse(data));
    }
    catch (error) {
        console.error(`[GET /database.json] ERRO ao servir database.json do caminho: ${linesDataPath}. Erro:`, error);
        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'Arquivo database.json não encontrado no servidor.' });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao carregar dados das linhas.' });
    }
}));
server.get('/usuarios/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email.toLowerCase();
    try {
        const users = yield readJsonFile(usersFilePath);
        const user = users.find((u) => u.email.toLowerCase() === email);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        // Retorne o usuário sem a senha
        const { senha } = user, userSemSenha = __rest(user, ["senha"]);
        res.status(200).json(userSemSenha);
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
// ROTA PARA ATUALIZAR O NÚMERO DE TICKETS
server.put('/usuarios/:email/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { tickets } = req.body; // Número de tickets que o usuário comprou
    // Validação simples para garantir que o número de tickets seja válido
    if (typeof tickets !== 'number' || tickets <= 0) {
        return res.status(400).json({ message: 'O número de tickets deve ser um valor positivo.' });
    }
    try {
        const users = yield readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u) => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
        const user = users[userIndex];
        user.tickets += tickets; // Atualiza o número de tickets do usuário
        yield writeJsonFile(usersFilePath, users); // Atualiza o arquivo JSON
        res.status(200).json({ success: true, user }); // Retorna os dados atualizados do usuário
    }
    catch (error) {
        console.error("Erro ao atualizar tickets:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar os tickets.' });
    }
}));
server.put('/usuarios/:email/usarticket', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const users = yield readJsonFile(usersFilePath);
        const userIndex = users.findIndex((u) => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
        const user = users[userIndex];
        if (user.tickets > 0) {
            user.tickets -= 1;
            yield writeJsonFile(usersFilePath, users);
            return res.status(200).json({ success: true, ticketsRestantes: user.tickets });
        }
        else {
            return res.status(400).json({ success: false, message: 'Sem tickets disponíveis.' });
        }
    }
    catch (error) {
        console.error("Erro ao usar ticket:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}));
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servindo arquivos estáticos de: ${staticFilesRoot}`);
    console.log(`Caminho esperado para usuarios.json: ${usersFilePath}`);
    console.log(`Caminho esperado para database.json: ${linesDataPath}`);
});
