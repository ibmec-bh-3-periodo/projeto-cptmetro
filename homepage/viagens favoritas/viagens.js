// Selecionar elementos
const btnAdicionar = document.getElementById('adicionar');
const inputDestino = document.getElementById('destino');
const listaDestinos = document.getElementById('lista-destinos');

// Definir o ícone do coração
let iconeCoracao = '❤ '; // Você pode alterar esse valor para o ícone que preferir

// Evento de clique para adicionar um destino
btnAdicionar.addEventListener('click', () => {
    const destino = inputDestino.value.trim();

    if (destino !== "") {
        // Criar novo item de viagem favorita
        const li = document.createElement('li');
        li.className = 'trip-item';

        // Criar o ícone de coração para remoção (antes do nome do destino)
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = iconeCoracao; // Usar o ícone definido na variável

        // Adicionar o nome do destino
        const span = document.createElement('span');
        span.textContent = destino;
        span.className = 'destino'; // Adiciona uma classe para o destino

        // Adicionar elementos ao item da lista
        li.appendChild(heart);
        li.appendChild(span);

        // Adicionar o item à lista de destinos
        listaDestinos.appendChild(li);

        // Limpar o campo de entrada
        inputDestino.value = "";
    }
});

// Evento para remover item ao clicar no coração
listaDestinos.addEventListener('click', (e) => {
    if (e.target.classList.contains('heart')) {
        const item = e.target.parentElement;
        listaDestinos.removeChild(item);
    }
});

// Evento para mostrar o tempo de metrô ao clicar no destino
listaDestinos.addEventListener('click', (e) => {
    if (e.target.classList.contains('destino')) {
        // Simular a obtenção do tempo de metrô em minutos
        const tempoMetro = Math.floor(Math.random() * 30) + 1; // Tempo entre 1 e 30 minutos
        alert(`O metrô leva aproximadamente ${tempoMetro} minutos para ${e.target.textContent}.`);
    }
});

// Função para alterar o ícone do coração
function alterarIconeCoracao(novoIcone) {
    iconeCoracao = novoIcone; // Atualiza o ícone do coração
}

// Exemplo de uso:
// alterarIconeCoracao('❤️'); // Chame essa função com o novo ícone que deseja usar
