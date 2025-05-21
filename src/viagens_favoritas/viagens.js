// viagens.js

const btnAdicionar = document.getElementById('adicionar');
const selectLinha = document.getElementById('searchSelectStart');
const listaDestinos = document.getElementById('lista-destinos');

let iconeCoracao = '❤ ';
const API_BASE_URL = 'http://localhost:3000'; // Make sure this matches your server's address

// Function to get the logged-in user's email
function getLoggedInUserEmail() {
    const userEmail = localStorage.getItem("loggedInUserEmail"); // CORRECTED KEY
    console.log("DEBUG: getLoggedInUserEmail() returned:", userEmail);
    return userEmail;
}

// Function to render favorite routes to the UI
function renderFavoriteRoutes(routes) {
    listaDestinos.innerHTML = ''; // Clear existing list
    routes.forEach(route => {
        const li = document.createElement('li');
        li.className = 'trip-item';

        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = iconeCoracao;
        heart.dataset.routeName = route; // Store the route name on the heart for easy deletion

        const span = document.createElement('span');
        span.textContent = route;
        span.className = 'destino';
        span.dataset.routeName = route; // Store for time simulation

        // Create and append the "Next Train" button
        const nextTrainButton = document.createElement('button');
        nextTrainButton.className = 'next-train-button';
        nextTrainButton.textContent = 'Próximo Trem';
        nextTrainButton.dataset.lineName = route; // Store the line name on the button itself

        li.appendChild(heart);
        li.appendChild(span);
        li.appendChild(nextTrainButton); // Append the new button

        listaDestinos.appendChild(li);
    });
}

// Function to load favorite routes from the backend
async function loadFavoriteRoutes() {
    const userEmail = getLoggedInUserEmail();
    if (!userEmail) {
        console.log("No user logged in, cannot load favorites.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}`);
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                 console.log("Usuário não encontrado ou sem rotas favoritas ainda.");
                 renderFavoriteRoutes([]); // Render empty list
                 return;
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderFavoriteRoutes(data.rotasFavoritas);
    } catch (error) {
        console.error("Erro ao carregar rotas favoritas:", error);
        alert("Erro ao carregar suas rotas favoritas.");
    }
}

// Event listener for adding a favorite route
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
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderFavoriteRoutes(data.rotasFavoritas); // Re-render the list with updated data
        selectLinha.value = "Selecione a linha"; // Reset the select to its default
    } catch (error) {
        console.error("Erro ao adicionar rota favorita:", error);
        alert(`Erro ao adicionar rota favorita: ${error.message}`);
    }
});

// Main event listener for clicks on the list
listaDestinos.addEventListener('click', async (e) => {
    if (e.target.classList.contains('heart')) {
        const routeToRemove = e.target.dataset.routeName;
        const userEmail = getLoggedInUserEmail();

        if (!userEmail) {
            alert("Você precisa estar logado para remover rotas favoritas.");
            return;
        }

        if (!confirm(`Tem certeza que deseja remover "${routeToRemove}" dos seus favoritos?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}/${encodeURIComponent(routeToRemove)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            renderFavoriteRoutes(data.rotasFavoritas);
        } catch (error) {
            console.error("Erro ao remover rota favorita:", error);
            alert(`Erro ao remover rota favorita: ${error.message}`);
        }
    } else if (e.target.classList.contains('next-train-button')) {
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
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert(`Próximo trem para ${data.line}: Chega às ${data.nextTrainTime} (aproximadamente em ${data.timeUntilNextTrainMinutes} minutos).`);

        } catch (error) {
            console.error("Erro ao buscar horário do trem:", error);
            alert(`Erro ao buscar horário do trem: ${error.message}`);
        }
    } else if (e.target.classList.contains('destino')) {
        // Original event for showing random metro time, now less relevant but kept
        // const tempoMetro = Math.floor(Math.random() * 30) + 1;
        // alert(`O metrô leva aproximadamente ${tempoMetro} minutos para ${e.target.textContent}.`);
    }
});

function alterarIconeCoracao(novoIcone) {
    iconeCoracao = novoIcone;
}

// Script para exibir a saudação e carregar rotas favoritas
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail"); // CORRECTED KEY
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
        console.log("DEBUG: No loggedInUserEmail found, not loading favorite routes.");
        // Optionally, redirect to login page if no user is logged in
        // window.location.href = "../login/login.html"; // Adjust path as needed
    }
});