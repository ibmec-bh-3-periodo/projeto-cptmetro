// Simulação de saldo e viagens restantes
let saldoAtual = 4.40;


// Função para recarregar saldo (simulada)
// function recarregarSaldo() {
//     saldoAtual += 4.40;
//     document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(1)}`;
// }

//document.getElementById("recarregar-saldo-btn").addEventListener("click", recarregarSaldo);

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