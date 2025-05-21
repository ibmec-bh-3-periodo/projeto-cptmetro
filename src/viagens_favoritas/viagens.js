// viagens.js

const btnAdicionar = document.getElementById('adicionar');
const selectLinha = document.getElementById('searchSelectStart');
const listaDestinos = document.getElementById('lista-destinos');

// Não precisamos mais do ícone de coração como string, pois usaremos Font Awesome diretamente
const API_BASE_URL = 'http://localhost:3000'; // Verifique se este endereço corresponde ao seu servidor

// Função para obter o email do usuário logado do localStorage
function getLoggedInUserEmail() {
    const userEmail = localStorage.getItem("loggedInUserEmail");
    console.log("DEBUG: getLoggedInUserEmail() returned:", userEmail);
    return userEmail;
}

// Função para renderizar (mostrar) as rotas favoritas na interface
function renderFavoriteRoutes(routes) {
    listaDestinos.innerHTML = ''; // Limpa a lista existente antes de renderizar
    routes.forEach(route => {
        const li = document.createElement('li');
        li.className = 'trip-item';

        // --- NOVO: Cria o ícone de Lixeira no lugar do Coração ---
        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'delete-icon'; // Usando a nova classe para estilização
        deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira do Font Awesome
        deleteIcon.dataset.routeName = route; // Armazena o nome da rota para a exclusão

        const span = document.createElement('span');
        span.textContent = route;
        span.className = 'destino';
        span.dataset.routeName = route;

        // Cria o botão "Próximo Trem"
        const nextTrainButton = document.createElement('button');
        nextTrainButton.className = 'next-train-button';
        nextTrainButton.textContent = 'Próximo Trem';
        nextTrainButton.dataset.lineName = route;

        li.appendChild(deleteIcon); // Adiciona o ícone de lixeira primeiro
        li.appendChild(span);
        li.appendChild(nextTrainButton); // Adiciona o botão "Próximo Trem"

        listaDestinos.appendChild(li);
    });
}

// Função para carregar as rotas favoritas do backend
async function loadFavoriteRoutes() {
    const userEmail = getLoggedInUserEmail();
    if (!userEmail) {
        console.log("Nenhum usuário logado, não é possível carregar favoritos.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}`);
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                 console.log("Usuário não encontrado ou sem rotas favoritas ainda.");
                 renderFavoriteRoutes([]);
                 return;
            }
            throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        renderFavoriteRoutes(data.rotasFavoritas);
    } catch (error) {
        console.error("Erro ao carregar rotas favoritas:", error);
        alert("Erro ao carregar suas rotas favoritas.");
    }
}

// Listener de evento para adicionar uma rota favorita
btnAdicionar.addEventListener('click', async () => {
    const destino = selectLinha.value.trim();
    const userEmail = getLoggedInUserEmail();

    if (!userEmail) {
        alert("Você precisa estar logado para adicionar rotas favoritas.");
        return;
    }

    if (destino === "" || destino === "Selecione a linha") {
        alert("Por favor, selecione uma linha válida para adicionar aos favoritos.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rota: destino }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        renderFavoriteRoutes(data.rotasFavoritas);
        selectLinha.value = "Selecione a linha";
    } catch (error) {
        console.error("Erro ao adicionar rota favorita:", error);
        alert(`Erro ao adicionar rota favorita: ${error.message}`);
    }
});

// Listener de evento principal para cliques na lista (delegation)
listaDestinos.addEventListener('click', async (e) => {
    // --- NOVO: Lógica de clique no ícone de lixeira (agora no lugar do coração) ---
    if (e.target.closest('.delete-icon')) { // Usa .closest para pegar o span.delete-icon mesmo se clicar no <i>
        const deleteIconElement = e.target.closest('.delete-icon');
        const routeToRemove = deleteIconElement.dataset.routeName;
        const userEmail = getLoggedInUserEmail();

        if (!userEmail) {
            alert("Você precisa estar logado para remover rotas favoritas.");
            return;
        }

        if (!confirm(`Tem certeza que deseja remover "${routeToRemove}" dos seus favoritos?`)) {
            return; // Usuário cancelou
        }

        try {
            const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}/${encodeURIComponent(routeToRemove)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
            }

            const data = await response.json();
            renderFavoriteRoutes(data.rotasFavoritas);
        } catch (error) {
            console.error("Erro ao remover rota favorita:", error);
            alert(`Erro ao remover rota favorita: ${error.message}`);
        }
    }
    // Lógica de clique no botão "Próximo Trem"
    else if (e.target.classList.contains('next-train-button')) {
        const lineName = e.target.dataset.lineName;
        if (!lineName) {
            alert("Não foi possível identificar a linha.");
            return;
        }

        try {
            const encodedLineName = encodeURIComponent(lineName);
            const response = await fetch(`${API_BASE_URL}/train-time/${encodedLineName}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
            }

            const data = await response.json();
            alert(`Próximo trem para ${data.line}: Chega às ${data.nextTrainTime} (aproximadamente em ${data.timeUntilNextTrainMinutes} minutos).`);

        } catch (error) {
            console.error("Erro ao buscar horário do trem:", error);
            alert(`Erro ao buscar horário do trem: ${error.message}`);
        }
    }
    // Lógica de clique no texto do destino (se ainda quiser mantê-la)
    else if (e.target.classList.contains('destino')) {
        // Exemplo: alert sobre tempo de metro (se ainda for relevante)
        // const tempoMetro = Math.floor(Math.random() * 30) + 1;
        // alert(`O metrô leva aproximadamente ${tempoMetro} minutos para ${e.target.textContent}.`);
    }
});

// A função alterarIconeCoracao não é mais necessária já que o coração foi removido
// function alterarIconeCoracao(novoIcone) {
//     iconeCoracao = novoIcone;
// }

// Script para exibir a saudação e carregar rotas favoritas ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const greetingMessage = document.getElementById("greetingMessage");

    console.log("DEBUG: On DOMContentLoaded - loggedInUser:", loggedInUser);
    console.log("DEBUG: On DOMContentLoaded - loggedInUserEmail:", loggedInUserEmail);

    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }

    if (loggedInUserEmail) {
        loadFavoriteRoutes();
    } else {
        console.log("DEBUG: Nenhum loggedInUserEmail encontrado, não carregando rotas favoritas.");
        // Opcional: redirecionar para a página de login se não houver usuário logado
        // window.location.href = "../login/login.html";
    }
});