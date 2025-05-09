const express = require('express');
const data = require('./database.json');

const server = express();
server.use(express.json());




const porta: number = 3000;
server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
