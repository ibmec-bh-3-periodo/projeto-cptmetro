const btnAdicionar = document.getElementById('adicionar');
// Change this line to target your select element
const selectLinha = document.getElementById('searchSelectStart');
const listaDestinos = document.getElementById('lista-destinos');

let iconeCoracao = '❤ ';

btnAdicionar.addEventListener('click', () => {
    // Get the selected value from the select element
    const destino = selectLinha.value.trim();

    // Check if a valid option was selected (not the "Selecione a linha" option)
    if (destino !== "" && destino !== "Selecione a linha") {
        const li = document.createElement('li');
        li.className = 'trip-item';

        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = iconeCoracao;

        const span = document.createElement('span');
        span.textContent = destino;
        span.className = 'destino';

        li.appendChild(heart);
        li.appendChild(span);

        listaDestinos.appendChild(li);

        // Reset the select to its default option after adding
        selectLinha.value = "";
    } else {
        alert("Por favor, selecione uma linha válida para adicionar aos favoritos.");
    }
});

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

function alterarIconeCoracao(novoIcone) {
    iconeCoracao = novoIcone;
}

// Script para exibir a saudação
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const greetingMessage = document.getElementById("greetingMessage");

    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }
});