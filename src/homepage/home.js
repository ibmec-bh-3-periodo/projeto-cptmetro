let userDatabase = [];
let currentUser = null;

async function loadUserDatabase() {
    try {
        const response = await fetch('../usuarios.json'); // Caminho corrigido!
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        userDatabase = await response.json();
    } catch (error) {
        console.error("Não foi possível carregar o banco de dados de usuários:", error);
        alert("Erro ao carregar dados do usuário. O saldo pode não ser exibido corretamente.");
    }
}

function updateTicketsDisplay() {
    const ticketsValorElement = document.getElementById("saldo-valor");
    let usuarioAtualizado = localStorage.getItem("currentUser");
    if (usuarioAtualizado) {
        usuarioAtualizado = JSON.parse(usuarioAtualizado);
        ticketsValorElement.innerText = usuarioAtualizado.tickets ?? 0;
    } else if (currentUser) {
        ticketsValorElement.innerText = currentUser.tickets ?? 0;
    } else {
        ticketsValorElement.innerText = `0`;
    }
}


const recarregarBtn = document.getElementById("recarregar-saldo-btn");
if (recarregarBtn) {
    // Manter ou remover este listener dependendo se você quer alguma ação JS antes do redirecionamento
    // recarregarBtn.addEventListener("click", () => { /* Sua lógica aqui */ });
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUserDatabase();

    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const greetingMessage = document.getElementById("greetingMessage");
    
    if (loggedInUserEmail) {
        // Sempre busca o usuário atualizado do banco de dados
        currentUser = userDatabase.find(user => user.email === loggedInUserEmail);

        if (currentUser) {
            greetingMessage.textContent = `Bem-vindo ao Metrô, ${currentUser.nome}!`;
            // Atualiza o localStorage com os dados mais recentes do banco
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            updateTicketsDisplay();
        } else {
            greetingMessage.textContent = "Bem-vindo ao Metrô!";
            console.error("Erro: Usuário logado via 'loggedInUserEmail' não encontrado no banco de dados carregado.");
            localStorage.removeItem('loggedInUserEmail');
            localStorage.removeItem('currentUser');
            updateTicketsDisplay();
        }
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
        updateTicketsDisplay();
    }
});