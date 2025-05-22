// src/viagens/viagens.js

const btnAdicionar = document.getElementById('adicionar');
const selectLinha = document.getElementById('searchSelectStart');
const listaDestinos = document.getElementById('lista-destinos');

const API_BASE_URL = 'http://localhost:3000';

let linhasData = [];

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const displayHours = hours === 24 ? 0 : hours;
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getDiaDaSemana() {
    const now = new Date();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 0) {
        return "Domingos e Feriados";
    } else if (dayOfWeek === 6) {
        return "Sábados";
    } else {
        return "Dias Úteis";
    }
}

function calcularProximoTrem(lineName) {
    const now = new Date();
    const currentMinutes = timeToMinutes(`${now.getHours()}:${now.getMinutes()}`);
    const currentDayType = getDiaDaSemana();

    const line = linhasData.find(l => l.linha === lineName);

    if (!line) {
        return { error: `Linha "${lineName}" não encontrada.` };
    }

    const daySchedule = line.horarios.find(h => h.dia === currentDayType);

    if (!daySchedule) {
        return { error: `Horário para "${currentDayType}" não encontrado para a linha ${lineName}.` };
    }

    let nextTrainTimeMinutes = -1;
    let foundSchedule = false;

    for (const faixa of daySchedule.faixas) {
        const inicioMinutes = timeToMinutes(faixa.inicio);
        const fimMinutes = timeToMinutes(faixa.fim);
        const intervalo = faixa.intervalo_minutos;

        let effectiveFimMinutes = fimMinutes;
        if (faixa.fim === "24:00") {
            effectiveFimMinutes = 24 * 60;
        }

        if (currentMinutes >= inicioMinutes && currentMinutes < effectiveFimMinutes) {
            const minutesIntoFaixa = currentMinutes - inicioMinutes;
            const intervalsPassed = Math.floor(minutesIntoFaixa / intervalo);
            nextTrainTimeMinutes = inicioMinutes + (intervalsPassed + 1) * intervalo;
            foundSchedule = true;
            break;
        }
        else if (currentMinutes < inicioMinutes) {
            nextTrainTimeMinutes = inicioMinutes;
            foundSchedule = true;
            break;
        }
    }

    if (!foundSchedule || nextTrainTimeMinutes > timeToMinutes("24:00")) {
        const firstScheduleOfNextDay = daySchedule.faixas[0];
        const firstTrainNextDayMinutes = timeToMinutes(firstScheduleOfNextDay.inicio);

        nextTrainTimeMinutes = (24 * 60 - currentMinutes) + firstTrainNextDayMinutes;

        if (nextTrainTimeMinutes < currentMinutes) {
            nextTrainTimeMinutes += (24 * 60);
        }
    }

    let timeUntilNextTrainMinutes = nextTrainTimeMinutes - currentMinutes;
    if (timeUntilNextTrainMinutes < 0) {
        timeUntilNextTrainMinutes += (24 * 60);
    }
    if (nextTrainTimeMinutes === (24 * 60)) {
        nextTrainTimeMinutes = 0;
    }

    return {
        line: lineName,
        nextTrainTime: minutesToTime(nextTrainTimeMinutes),
        timeUntilNextTrainMinutes: timeUntilNextTrainMinutes
    };
}
function getLoggedInUserEmail() {
    const userEmail = localStorage.getItem("loggedInUserEmail");
    return userEmail;
}

function renderFavoriteRoutes(routes) {
    listaDestinos.innerHTML = '';
    routes.forEach(route => {
        const li = document.createElement('li');
        li.className = 'trip-item';

        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'delete-icon';
        deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteIcon.dataset.routeName = route;

        const span = document.createElement('span');
        span.textContent = route;
        span.className = 'destino';
        span.dataset.routeName = route;

        const nextTrainButton = document.createElement('button');
        nextTrainButton.className = 'next-train-button';
        nextTrainButton.textContent = 'Próximo Trem';
        nextTrainButton.dataset.lineName = route;

        li.appendChild(deleteIcon);
        li.appendChild(span);
        li.appendChild(nextTrainButton);

        listaDestinos.appendChild(li);
    });
}

async function loadFavoriteRoutes() {
    const userEmail = localStorage.getItem("loggedInUserEmail"); // Usar diretamente localStorage.getItem
    if (!userEmail) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/favoritas/${userEmail}`);
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                 renderFavoriteRoutes([]);
                 return;
            }
            throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        renderFavoriteRoutes(data.rotasFavoritas);
    } catch (error) {
    console.error("Erro ao carregar rotas favoritas:", error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
    } else {
        alert("Erro ao carregar suas rotas favoritas.");
    }
    }
}

btnAdicionar.addEventListener('click', async () => {
    const destino = selectLinha.value.trim();
    const userEmail = localStorage.getItem("loggedInUserEmail"); // Usar diretamente localStorage.getItem

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

listaDestinos.addEventListener('click', async (e) => {
    if (e.target.closest('.delete-icon')) {
        const deleteIconElement = e.target.closest('.delete-icon');
        const routeToRemove = deleteIconElement.dataset.routeName;
        const userEmail = localStorage.getItem("loggedInUserEmail"); // Usar diretamente localStorage.getItem

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
                throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
            }

            const data = await response.json();
            renderFavoriteRoutes(data.rotasFavoritas);
        } catch (error) {
            console.error("Erro ao remover rota favorita:", error);
            alert(`Erro ao remover rota favorita: ${error.message}`);
        }
    }
    else if (e.target.classList.contains('next-train-button')) {
        const lineName = e.target.dataset.lineName;
        if (!lineName) {
            alert("Não foi possível identificar a linha.");
            return;
        }

        if (linhasData.length === 0) {
            alert("Dados de horários das linhas ainda não carregados. Tente novamente em instantes.");
            return;
        }

        const result = calcularProximoTrem(lineName);

        if (result.error) {
            alert(`Erro ao calcular próximo trem: ${result.error}`);
        } else {
            alert(`Próximo trem para ${result.line}: Chega às ${result.nextTrainTime} (em ${result.timeUntilNextTrainMinutes} minutos).`);
        }
    }
});

async function loadLinesData() {
    try {
        const response = await fetch('/src/database.json'); // Caminho para database.json
        if (!response.ok) {
            throw new Error(`Erro ao carregar database.json: ${response.statusText}`);
        }
        linhasData = await response.json();
    } catch (error) {
        console.error("Erro ao carregar dados das linhas:", error);
        alert("Não foi possível carregar os dados de horários das linhas.");
    }
}

// Este é o addEventListener da página de viagens
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser"); // Pega o nome salvo no login.js
    const greetingMessage = document.getElementById("greetingMessage");

    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }

    loadLinesData();
    loadFavoriteRoutes();
});