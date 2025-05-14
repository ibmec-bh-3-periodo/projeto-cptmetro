let saldoAtual = 4.40;
let viagensRestantes = 1;

// Instancia o QR Code
let qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 200,
  height: 200
});

function generateQRCode() {
  let dynamicData = `QR Code - Saldo: R$${saldoAtual.toFixed(2)}, Viagens: ${viagensRestantes}`;
  qrcode.makeCode(dynamicData);
  // Atualiza os valores na tela
  document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(2)}`;
  document.getElementById("viagens-restantes").innerText = viagensRestantes;
}

// Associa botão de geração de QR Code
document.getElementById("generate-qrcode-btn").addEventListener("click", generateQRCode);

// Saudação com nome armazenado localmente
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const greetingMessage = document.getElementById("greetingMessage");
  if (greetingMessage && loggedInUser) {
    greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
  } else {
    greetingMessage.textContent = "Bem-vindo ao Metrô!";
  }

  // Atualiza saldo inicial visivelmente ao carregar
  document.getElementById("saldo-valor").innerText = `R$${saldoAtual.toFixed(2)}`;
  document.getElementById("viagens-restantes").innerText = viagensRestantes;
});
