document.addEventListener("DOMContentLoaded", function () {
    const greetingMessage = document.getElementById("greetingMessage");
    const saldoSpan = document.getElementById("saldo-valor");

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser && saldoSpan) {
        const saldo = parseFloat(localStorage.getItem(`saldo_${loggedInUser}`)) || 0;
        saldoSpan.textContent = `R$${saldo.toFixed(2)}`;
    }

    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    }
});
