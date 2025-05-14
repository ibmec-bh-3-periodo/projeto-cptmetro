qrcode.js


let saldoAtual = 0;
let viagensRestantes = 0;
const username = localStorage.getItem("loggedInUser");
const apiBaseUrl = "http://localhost:3000"; // altere se estiver em produção

// Inicializa QR Code
let qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 200,
    height: 200
});

function updateUI() {
    document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(2)}`;
    document.getElementById("viagens-restantes").innerText = viagensRestantes;
}

function generateQRCode() {
    if (saldoAtual < 4.40 || viagensRestantes <= 0) {
        alert("Saldo insuficiente para gerar o QR Code!");
        return;
    }

    fetch(`${apiBaseUrl}/usuario/${username}/reduzir`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        saldoAtual = data.saldo;
        viagensRestantes = data.viagens;
        updateUI();

        const dynamicData = `QR Code - Saldo: R$${saldoAtual.toFixed(2)}, Viagens: ${viagensRestantes}`;
        qrcode.makeCode(dynamicData);
    })
    .catch(err => {
        console.error("Erro ao reduzir saldo:", err);
        alert("Erro ao processar a viagem.");
    });
}

function recarregarSaldo() {
    fetch(`${apiBaseUrl}/usuario/${username}/recarregar`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        saldoAtual = data.saldo;
        viagensRestantes = data.viagens;
        updateUI();
    })
    .catch(err => {
        console.error("Erro ao recarregar saldo:", err);
        alert("Erro ao recarregar.");
    });
}

function carregarDadosDoUsuario() {
    if (!username) {
        alert("Usuário não identificado.");
        return;
    }

    fetch(`${apiBaseUrl}/usuario/${username}`)
    .then(res => {
        if (!res.ok) throw new Error("Usuário não encontrado");
        return res.json();
    })
    .then(data => {
        saldoAtual = data.saldo;
        viagensRestantes = data.viagens;
        updateUI();
    })
    .catch(err => {
        console.warn("Usuário ainda não tem dados. Será criado ao recarregar.");
        updateUI(); // mostra saldo inicial zerado
    });
}

document.getElementById("generate-qrcode-btn").addEventListener("click", generateQRCode);
document.getElementById("recarregar-saldo-btn").addEventListener("click", recarregarSaldo);

document.addEventListener("DOMContentLoaded", function () {
    const greetingMessage = document.getElementById("greetingMessage");

    if (greetingMessage && username) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${username}!`;
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }

    carregarDadosDoUsuario();
});
