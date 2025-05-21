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

function updateSaldoDisplay() {
    const saldoValorElement = document.getElementById("saldo-valor");
    if (saldoValorElement && currentUser) {
        saldoValorElement.innerText = `R$${currentUser.saldo.toFixed(2).replace('.', ',')}`;
    } else {
        saldoValorElement.innerText = `R$0,00`;
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
        currentUser = userDatabase.find(user => user.email === loggedInUserEmail);

        if (currentUser) {
            greetingMessage.textContent = `Bem-vindo ao Metrô, ${currentUser.nome}!`;
            updateSaldoDisplay();
        } else {
            greetingMessage.textContent = "Bem-vindo ao Metrô!";
            console.error("Erro: Usuário logado via 'loggedInUserEmail' não encontrado no banco de dados carregado.");
            localStorage.removeItem('loggedInUserEmail');
        }
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }
});